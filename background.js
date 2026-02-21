const ALLOWED_ORIGINS_KEY = 'allowedOrigins';
const BADGE_TEXT_PROMPT = '클릭';
const BADGE_TEXT_EXECUTED = '실행';
const BADGE_COLOR_PROMPT = '#10b981';
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

function refreshBadge(tabId, origin) {
  if (!origin) {
    clearBadge(tabId);
    return;
  }

  chrome.storage.sync.get({ [ALLOWED_ORIGINS_KEY]: [] }, (stored) => {
    const allowedOrigins = stored[ALLOWED_ORIGINS_KEY];
    if (allowedOrigins.includes(origin)) {
      setBadge(tabId, BADGE_TEXT_PROMPT, BADGE_COLOR_PROMPT);
    } else {
      clearBadge(tabId);
    }
  });
}

function markOriginAllowed(origin, callback) {
  chrome.storage.sync.get({ [ALLOWED_ORIGINS_KEY]: [] }, (stored) => {
    const allowedOrigins = stored[ALLOWED_ORIGINS_KEY];
    if (allowedOrigins.includes(origin)) {
      callback(allowedOrigins);
      return;
    }

    const nextOrigins = [...allowedOrigins, origin];
    chrome.storage.sync.set({ [ALLOWED_ORIGINS_KEY]: nextOrigins }, () => {
      callback(nextOrigins);
    });
  });
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
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }).catch((error) => {
      console.error('content.js 삽입 실패', error);
    });
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
