// 기본값
const DEFAULT_SETTINGS = {
  hotkey: 'z',
  openMode: 'new-tab',
  maxTabs: 10,
  boxColor: '#007bff',
  sameDomainOnly: false,
  showConfirmDialog: false
};

// DOM 요소
const hotkeyInput = document.getElementById('hotkey');
const openModeRadios = document.querySelectorAll('input[name="openMode"]');
const maxTabsInput = document.getElementById('maxTabs');
const boxColorInput = document.getElementById('boxColor');
const colorPreview = document.getElementById('colorPreview');
const sameDomainCheckbox = document.getElementById('sameDomainOnly');
const showConfirmDialogCheckbox = document.getElementById('showConfirmDialog');
const saveBtn = document.getElementById('saveBtn');
const statusDiv = document.getElementById('status');

// 팝업 로드 시 현재 설정 불러오기
document.addEventListener('DOMContentLoaded', loadSettings);

// 색상 입력 실시간 반영
boxColorInput.addEventListener('input', (e) => {
  colorPreview.style.backgroundColor = e.target.value;
});

// 저장 버튼 클릭
saveBtn.addEventListener('click', saveSettings);

// 단축키 입력 - 1글자만 허용
hotkeyInput.addEventListener('keydown', (e) => {
  // 첫 글자만 유지
  if (hotkeyInput.value.length >= 1) {
    e.preventDefault();
    hotkeyInput.value = e.key.toLowerCase();
  }
});

hotkeyInput.addEventListener('input', (e) => {
  if (e.target.value.length > 1) {
    e.target.value = e.target.value.charAt(0);
  }
  e.target.value = e.target.value.toLowerCase();
});

// maxTabs 유효성 검사
maxTabsInput.addEventListener('input', (e) => {
  let value = parseInt(e.target.value) || 1;
  if (value < 1) value = 1;
  if (value > 50) value = 50;
  e.target.value = value;
});

// 현재 설정 로드
function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    hotkeyInput.value = settings.hotkey;
    document.getElementById(`openMode-${settings.openMode}`).checked = true;
    maxTabsInput.value = settings.maxTabs;
    boxColorInput.value = settings.boxColor;
    colorPreview.style.backgroundColor = settings.boxColor;
    sameDomainCheckbox.checked = settings.sameDomainOnly;
    showConfirmDialogCheckbox.checked = settings.showConfirmDialog;
  });
}

// 설정 저장
function saveSettings() {
  const settings = {
    hotkey: hotkeyInput.value || 'z',
    openMode: document.querySelector('input[name="openMode"]:checked').value,
    maxTabs: Math.max(1, Math.min(50, parseInt(maxTabsInput.value) || 10)),
    boxColor: boxColorInput.value,
    sameDomainOnly: sameDomainCheckbox.checked,
    showConfirmDialog: showConfirmDialogCheckbox.checked
  };

  chrome.storage.sync.set(settings, () => {
    // 저장 완료 메시지 표시
    statusDiv.classList.add('show');
    setTimeout(() => {
      statusDiv.classList.remove('show');
    }, 2000);
  });
}
