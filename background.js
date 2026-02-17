// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'OPEN_LINKS') {
    const { links, openMode = 'new-tab', maxTabs = 10 } = request;

    // maxTabs 만큼만 슬라이싱
    const linksToOpen = links.slice(0, maxTabs);

    if (openMode === 'new-window') {
      // 새 창에서 열기: 첫 링크로 새 창 생성, 나머지는 해당 창에 탭 추가
      if (linksToOpen.length > 0) {
        chrome.windows.create({ url: linksToOpen[0] }, (newWindow) => {
          if (newWindow) {
            // 나머지 링크들을 새 창에 탭으로 추가
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
      // 새 탭에서 열기 (포커스 또는 백그라운드)
      const active = openMode === 'new-tab';
      linksToOpen.forEach((link, index) => {
        chrome.tabs.create({
          url: link,
          active: active && index === 0 // 'new-tab' 모드: 첫 탭만 활성화
        });
      });
    }

    sendResponse({ success: true, count: linksToOpen.length });
    return true; // 비동기 응답을 위해 true 반환
  }
});

// 확장 프로그램 설치/업데이트 시 로그
chrome.runtime.onInstalled.addListener(() => {
  console.log('Link Collector installed/updated');
});
