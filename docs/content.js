(() => {
  if (window.__LINK_COLLECTOR_LOADED__) {
    return;
  }
  window.__LINK_COLLECTOR_LOADED__ = true;

  const FALLBACK_MESSAGES = {
    linkCount: ([count = '0']) => `${count}개`,
    confirmMessage: ([count = '0', mode = '새 탭']) => `링크 ${count}개를 ${mode}으로 열까요?`,
    confirmOpen: () => '열기',
    confirmCancel: () => '취소',
    openModeNewTabShort: () => '새 탭',
    openModeBackgroundTabShort: () => '백그라운드 탭',
    openModeNewWindowShort: () => '새 창'
  };

  function getLocalizedMessage(key, substitutions = []) {
    if (typeof chrome !== 'undefined' && chrome.i18n && typeof chrome.i18n.getMessage === 'function') {
      try {
        const message = chrome.i18n.getMessage(key, substitutions);
        if (message) {
          return message;
        }
      } catch (error) {
        console.warn('i18n 메시지 조회 실패', key, error);
      }
    }
    const fallback = FALLBACK_MESSAGES[key];
    return fallback ? fallback(substitutions) : substitutions[0] || key;
  }

  const CURRENT_ORIGIN = window.location.origin;

  function registerCurrentOrigin() {
    if (!CURRENT_ORIGIN) {
      return;
    }
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
      return;
    }
    chrome.runtime.sendMessage(
      { type: 'REGISTER_ORIGIN', origin: CURRENT_ORIGIN },
      (response) => {
        handlePermissionResponse(response);
      }
    );
  }

  function handlePermissionResponse(response) {
    if (!response) {
      return;
    }

    if (response.success === false) {
      showPermissionDeniedNotification(response.reason);
    }
  }

  function showPermissionDeniedNotification(reason) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      z-index: 99999999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
    `;

    let message = '링크 수집기 권한이 필요합니다';
    if (reason === 'user_denied') {
      message = '링크 수집기 권한을 거부했습니다. 확장 아이콘을 클릭하여 다시 활성화할 수 있습니다.';
    }

    notification.textContent = message;
    notification.onclick = () => notification.remove();

    document.body.appendChild(notification);

    // 5초 후 자동 삭제
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);

    // 애니메이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    if (!document.querySelector('style[data-link-collector]')) {
      style.setAttribute('data-link-collector', 'true');
      document.head.appendChild(style);
    }
  }

  // ====== 설정 변수 ======
  let settings = {
    hotkey: 'z',
    openMode: 'new-tab',
    maxTabs: 10,
    boxColor: '#007bff',
    sameDomainOnly: false,
    showConfirmDialog: false
  };

  // ====== 상태 변수 ======
  let isSelecting = false;
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let selectionBox = null;
  let linkCountBadge = null;
  let lastCollectTime = 0;
  const THROTTLE_MS = 100;

// ====== 초기화 ======
document.addEventListener('DOMContentLoaded', initializeSettings);
window.addEventListener('load', initializeSettings);

// 초기 로드 시점에도 즉시 로드
initializeSettings();

function initializeSettings() {
  // chrome.storage 사용 가능 여부 확인
  if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
    console.warn('chrome.storage.sync가 사용 불가능합니다');
    return;
  }

  chrome.storage.sync.get({
    hotkey: 'z',
    openMode: 'new-tab',
    maxTabs: 10,
    boxColor: '#007bff',
    sameDomainOnly: false,
    showConfirmDialog: false
  }, (savedSettings) => {
    settings = savedSettings;
    console.log('Link Collector 설정 로드:', settings);
  });
}

// 저장소 변경 감지 (실시간 설정 반영)
if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
      for (const key in changes) {
        if (key in settings) {
          settings[key] = changes[key].newValue;
        }
      }
      console.log('Link Collector 설정 업데이트:', settings);
    }
  });
}

// ====== 이벤트 리스너 ======
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === settings.hotkey && !e.ctrlKey && !e.altKey && !e.metaKey) {
    e.preventDefault();
    startSelection();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() === settings.hotkey && isSelecting) {
    finishSelection();
  }
});

// ====== 선택 시작 ======
function startSelection() {
  if (isSelecting) return;

  registerCurrentOrigin();

  isSelecting = true;

  // 선택 박스 생성
  selectionBox = document.createElement('div');
  const rgbColor = hexToRgb(settings.boxColor);
  selectionBox.style.cssText = `
    position: fixed;
    border: 2px solid ${settings.boxColor};
    background-color: rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1);
    z-index: 999999;
    pointer-events: none;
  `;
  document.body.appendChild(selectionBox);

  // 링크 수 뱃지 생성
  linkCountBadge = document.createElement('div');
  linkCountBadge.style.cssText = `
    position: fixed;
    background: ${settings.boxColor};
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    z-index: 9999999;
    pointer-events: none;
    display: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;
  document.body.appendChild(linkCountBadge);

  // 마우스 이벤트 등록
  document.addEventListener('mousemove', onMouseMove);
}

// ====== 마우스 이동 ======
function onMouseMove(e) {
  if (!isSelecting || !selectionBox) return;

  if (!startX && !startY) {
    // 처음 이동 시 시작 좌표 설정
    startX = e.clientX;
    startY = e.clientY;
    endX = e.clientX;
    endY = e.clientY;
    return;
  }

  // 현재 마우스 위치 저장
  endX = e.clientX;
  endY = e.clientY;

  const minX = Math.min(startX, e.clientX);
  const minY = Math.min(startY, e.clientY);
  const width = Math.abs(e.clientX - startX);
  const height = Math.abs(e.clientY - startY);

  selectionBox.style.left = `${minX}px`;
  selectionBox.style.top = `${minY}px`;
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;

  // Throttle: 링크 수 표시 (100ms마다 최대 1회)
  const now = Date.now();
  if (now - lastCollectTime > THROTTLE_MS) {
    updateLinkCountBadge(minX, minY, width, height);
    lastCollectTime = now;
  }
}

// ====== 링크 수 뱃지 업데이트 ======
function updateLinkCountBadge(x, y, width, height) {
  if (!linkCountBadge) return;

  const linksArray = collectLinksInArea(x, y, width, height);
  const count = linksArray.length;

  if (count > 0) {
    linkCountBadge.textContent = getLocalizedMessage('linkCount', [count.toString()]);
    linkCountBadge.style.display = 'block';
    // 박스 우측 하단에 위치
    linkCountBadge.style.left = `${x + width - 50}px`;
    linkCountBadge.style.top = `${y + height - 30}px`;
  } else {
    linkCountBadge.style.display = 'none';
  }
}

// ====== 선택 완료 ======
function finishSelection() {
  if (!isSelecting) return;

  // 마우스 이동 이벤트 제거
  document.removeEventListener('mousemove', onMouseMove);

  // 시작 좌표와 끝 좌표가 없으면 종료
  if (!startX || !startY || !endX || !endY) {
    cleanup();
    return;
  }

  // 마우스가 이동한 영역 계산
  const minX = Math.min(startX, endX);
  const minY = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  // 선택된 링크들을 수집
  const linksArray = collectLinksInArea(minX, minY, width, height);

  if (linksArray.length > 0) {
    // 확인 다이얼로그 설정에 따라 처리
    if (settings.showConfirmDialog) {
      showConfirmDialog(linksArray);
    } else {
      openSelectedLinks(linksArray);
    }
  }

  // 선택 박스 제거 및 상태 초기화
  cleanup();
}

// ====== 확인 다이얼로그 ======
function showConfirmDialog(linksArray) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99999998;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 24px;
    max-width: 400px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
  `;

  const message = document.createElement('p');
  message.style.cssText = `
    margin: 0 0 20px 0;
    font-size: 16px;
    color: #333;
    font-weight: 500;
  `;
  message.textContent = getLocalizedMessage('confirmMessage', [linksArray.length.toString(), getOpenModeLabel(settings.openMode)]);

  const buttonGroup = document.createElement('div');
  buttonGroup.style.cssText = `
    display: flex;
    gap: 12px;
    justify-content: center;
  `;

  const confirmBtn = document.createElement('button');
  confirmBtn.style.cssText = `
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  `;
  confirmBtn.textContent = getLocalizedMessage('confirmOpen');
  confirmBtn.onmouseover = () => confirmBtn.style.background = '#0056b3';
  confirmBtn.onmouseout = () => confirmBtn.style.background = '#007bff';
  confirmBtn.onclick = () => {
    closeDialog();
    openSelectedLinks(linksArray);
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.style.cssText = `
    padding: 10px 20px;
    background: #e0e0e0;
    color: #333;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  `;
  cancelBtn.textContent = getLocalizedMessage('confirmCancel');
  cancelBtn.onmouseover = () => cancelBtn.style.background = '#d0d0d0';
  cancelBtn.onmouseout = () => cancelBtn.style.background = '#e0e0e0';
  cancelBtn.onclick = closeDialog;

  buttonGroup.appendChild(confirmBtn);
  buttonGroup.appendChild(cancelBtn);

  dialog.appendChild(message);
  dialog.appendChild(buttonGroup);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // 키보드 이벤트
  const closeDialog = () => {
    overlay.remove();
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter') {
      document.removeEventListener('keydown', handleKeydown);
      closeDialog();
      openSelectedLinks(linksArray);
    } else if (e.key === 'Escape') {
      document.removeEventListener('keydown', handleKeydown);
      closeDialog();
    }
  };

  document.addEventListener('keydown', handleKeydown);
}

function getOpenModeLabel(mode) {
  const keys = {
    'new-tab': 'openModeNewTabShort',
    'background-tab': 'openModeBackgroundTabShort',
    'new-window': 'openModeNewWindowShort'
  };
  return getLocalizedMessage(keys[mode] || 'openModeNewTabShort');
}

// ====== 링크 수집 ======
function collectLinksInArea(x, y, width, height) {
  const linksSet = new Set();
  const currentDomain = window.location.hostname;

  const allLinks = document.querySelectorAll('a[href]');
  allLinks.forEach(link => {
    const rect = link.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (
      centerX >= x &&
      centerX <= x + width &&
      centerY >= y &&
      centerY <= y + height
    ) {
      const url = link.href;
      if (url && !url.startsWith('javascript:') && !url.startsWith('mailto:')) {
        // 도메인 필터 적용
        if (settings.sameDomainOnly) {
          try {
            const linkDomain = new URL(url).hostname;
            if (linkDomain === currentDomain) {
              linksSet.add(url);
            }
          } catch (e) {
            // URL 파싱 실패 무시
          }
        } else {
          linksSet.add(url);
        }
      }
    }
  });

  return Array.from(linksSet);
}

// ====== 링크 열기 ======
function openSelectedLinks(linksArray) {
  if (linksArray.length === 0) {
    return;
  }

  // chrome.runtime 존재 여부 확인
  if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
    console.error('chrome.runtime이 사용 불가능합니다');
    return;
  }

  chrome.runtime.sendMessage({
    type: 'OPEN_LINKS',
    links: linksArray,
    openMode: settings.openMode,
    maxTabs: settings.maxTabs
  });
}

// ====== 정리 ======
function cleanup() {
  isSelecting = false;
  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;
  if (selectionBox) {
    selectionBox.remove();
    selectionBox = null;
  }
  if (linkCountBadge) {
    linkCountBadge.remove();
    linkCountBadge = null;
  }
}

// ====== 유틸 함수 ======
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 123, b: 255 };
}

})();
