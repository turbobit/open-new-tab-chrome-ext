const ALLOWED_ORIGINS_KEY = 'allowedOrigins';
const BADGE_TEXT_ALLOWED = 'On';
const BADGE_TEXT_EXECUTED = '실행';
const BADGE_COLOR_ALLOWED = '#10b981';
const BADGE_COLOR_EXECUTED = '#2563eb';

let badgeTimers = new Map();

function getOrigin(url) {
  try {
    return new URL(url).origin;
  } catch (error) {
    console.warn('origin을 만들 수 없음:', url, error);
    return null;
  }
}

function setBadge(tabId, text, color) {
  if (typeof tabId !== 'number') {
    return;
  }
  chrome.action.setBadgeText({ tabId, text });
  chrome.action.setBadgeBackgroundColor({ tabId, color });
}

function clearBadge(tabId) {
  setBadge(tabId, '', '#6b7280');
}

function ensureContentScriptInjected(tabId, origin) {
  if (typeof tabId !== 'number' || !origin) {
    return;
  }

  // 전체 호스트 권한 확인
  chrome.permissions.contains({ origins: ['*://*/*'] }, (hasPermission) => {
    if (!hasPermission) {
      return;
    }

    // 특정 페이지는 scripting이 불가능하므로 체크
    if (!canScriptPage(origin)) {
      console.debug('scripting 불가능한 페이지:', origin);
      return;
    }

    chrome.scripting
      .executeScript({
        target: { tabId },
        files: ['content.js']
      })
      .catch((error) => {
        // 특수 페이지(예: 확장 프로그램 갤러리)는 무시
        if (error.message?.includes('cannot be scripted') ||
            error.message?.includes('Unknown host')) {
          console.debug('content.js 주입 불가능:', origin, error.message);
        } else {
          console.error('content.js 삽입 실패:', error);
        }
      });
  });
}

function canScriptPage(origin) {
  // Chrome 시스템 페이지와 특수 URL은 scripting 불가능
  const unsafeOrigins = [
    'chrome://',
    'about:',
    'chrome-extension://',
    'file://',
    'data:',
    'blob:'
  ];

  return !unsafeOrigins.some(prefix => origin.startsWith(prefix));
}

function refreshBadge(tabId, origin) {
  if (!origin) {
    clearBadge(tabId);
    return;
  }

  chrome.storage.sync.get({ [ALLOWED_ORIGINS_KEY]: [] }, (stored) => {
    const allowedOrigins = stored[ALLOWED_ORIGINS_KEY];
    if (allowedOrigins.includes(origin)) {
      // 활성화된 호스트
      setBadge(tabId, BADGE_TEXT_ALLOWED, BADGE_COLOR_ALLOWED);

      // 권한이 있으면 content script 주입
      chrome.permissions.contains({ origins: ['*://*/*'] }, (hasPermission) => {
        if (hasPermission) {
          ensureContentScriptInjected(tabId, origin);
        }
      });
    } else {
      // 비활성화됨
      clearBadge(tabId);
    }
  });
}

function getOriginPattern(origin) {
  return `${origin}/*`;
}

function ensureOriginPermission(origin, onGranted, onDenied) {
  if (!origin) {
    onDenied?.({ reason: 'invalid_origin' });
    return;
  }

  // Manifest V3에서는 optional_host_permissions에 선언된 패턴과 정확히 일치해야 함
  chrome.permissions.contains({ origins: ['*://*/*'] }, (hasPermission) => {
    if (hasPermission) {
      onGranted();
      return;
    }

    // 전체 호스트 권한 요청 (한 번만 필요)
    chrome.permissions.request({ origins: ['*://*/*'] }, (granted) => {
      if (granted) {
        onGranted();
      } else {
        onDenied?.({ reason: 'user_denied', origin });
      }
    });
  });
}

function markOriginAllowed(origin, callback) {
  if (!origin) {
    callback({ success: false, reason: 'invalid_origin' });
    return;
  }

  ensureOriginPermission(
    origin,
    () => {
      chrome.storage.sync.get({ [ALLOWED_ORIGINS_KEY]: [] }, (stored) => {
        const allowedOrigins = stored[ALLOWED_ORIGINS_KEY];
        if (allowedOrigins.includes(origin)) {
          callback({ success: true, origins: allowedOrigins });
          return;
        }

        const nextOrigins = [...allowedOrigins, origin];
        chrome.storage.sync.set({ [ALLOWED_ORIGINS_KEY]: nextOrigins }, () => {
          callback({ success: true, origins: nextOrigins });
        });
      });
    },
    (error) => {
      callback({ success: false, reason: error?.reason || 'unknown', origin });
    }
  );
}

function showExecutionBadge(tabId, origin) {
  if (badgeTimers.has(tabId)) {
    clearTimeout(badgeTimers.get(tabId));
  }

  setBadge(tabId, BADGE_TEXT_EXECUTED, BADGE_COLOR_EXECUTED);

  const timer = setTimeout(() => {
    badgeTimers.delete(tabId);
    refreshBadge(tabId, origin);
  }, 4000);

  badgeTimers.set(tabId, timer);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'OPEN_LINKS') {
    const { links, openMode = 'new-tab', maxTabs = 10 } = request;

    const linksToOpen = links.slice(0, maxTabs);

    if (openMode === 'new-window') {
      if (linksToOpen.length > 0) {
        chrome.windows.create({ url: linksToOpen[0] }, (newWindow) => {
          if (newWindow) {
            for (let i = 1; i < linksToOpen.length; i++) {
              chrome.tabs.create({
                windowId: newWindow.id,
                url: linksToOpen[i],
                active: false
              });
            }
          }
        });
      }
    } else {
      const active = openMode === 'new-tab';
      linksToOpen.forEach((link, index) => {
        chrome.tabs.create({
          url: link,
          active: active && index === 0
        });
      });
    }

    sendResponse({ success: true, count: linksToOpen.length });
    return true;
  }

  if (request.type === 'REGISTER_ORIGIN') {
    const { origin } = request;
    if (!origin) {
      sendResponse({ success: false, reason: 'invalid_origin' });
      return false;
    }

    markOriginAllowed(origin, (result) => {
      if (sender?.tab?.id) {
        refreshBadge(sender.tab.id, origin);
      }
      sendResponse(result);
    });
    return true;
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id || !tab.url) {
    return;
  }

  const origin = getOrigin(tab.url);
  if (!origin) {
    clearBadge(tab.id);
    return;
  }

  markOriginAllowed(origin, () => {
    showExecutionBadge(tab.id, origin);
    ensureContentScriptInjected(tab.id, origin);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab?.url) {
    refreshBadge(tabId, getOrigin(tab.url));
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab?.url) {
      clearBadge(tabId);
      return;
    }
    refreshBadge(tabId, getOrigin(tab.url));
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync' || !changes[ALLOWED_ORIGINS_KEY]) {
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab?.id && tab.url) {
        refreshBadge(tab.id, getOrigin(tab.url));
      }
    });
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab?.id && tab.url) {
        refreshBadge(tab.id, getOrigin(tab.url));
      }
    });
  });
  console.log('Link Collector installed/updated');
});
