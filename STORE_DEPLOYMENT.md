# Chrome Web Store 배포 가이드

## 📋 배포 전 체크리스트

### 1. 아이콘 준비
- [ ] SVG 아이콘 온라인 변환 (icon.svg → PNG)
  - 16x16 → icon-16x16.png
  - 32x32 → icon-32x32.png
  - 48x48 → icon-48x48.png
  - 128x128 → icon-128x128.png
- [ ] 변환된 PNG 파일을 프로젝트 폴더에 복사

### 2. 파일 구조 확인
```
open-new-tab-chrome-ext/
├── manifest.json
├── content.js
├── background.js
├── popup.html
├── popup.js
├── icon-16x16.png
├── icon-32x32.png
├── icon-48x48.png
├── icon-128x128.png
└── README.md
```

### 3. 확장 프로그램 패킹 (.zip)
```bash
# 권장: npm 빌드로 릴리즈 ZIP 생성
npm run build

# 생성 파일
# dist/link-collector.zip
```

---

## 🚀 Chrome Web Store 등록 단계

### Step 1: 개발자 계정 등록
1. https://chrome.google.com/webstore/devconsole 접속
2. Google 계정으로 로그인
3. 개발자 등록 ($5 일회)

### Step 2: 새 항목 등록
1. "새 항목" 클릭
2. link-collector.zip 업로드
3. 자동 검사 대기

### Step 3: 스토어 정보 작성

#### 이름 & 설명
**이름:** Link Collector

**짧은 설명 (132자 이내):**
```
Z 키로 웹페이지의 링크들을 일괄 수집해 새 탭으로 열기.
단축키, 색상, 열기 방식 등을 자유롭게 설정 가능합니다.
```

**상세 설명:**
```
Link Collector는 웹페이지의 특정 영역에서 링크를 효율적으로 수집하는 Chrome 확장 프로그램입니다.

[주요 기능]
✨ 영역 선택: Z 키를 누르고 마우스로 영역을 선택하여 링크 수집
🔧 커스터마이징: 단축키, 색상, 최대 탭 수 등 자유롭게 설정
🎯 링크 필터링: 현재 도메인의 링크만 열기 옵션
⚡ 확인 다이얼로그: 링크 열기 전 확인 (선택 가능)
📊 실시간 링크 카운트: 선택 영역의 링크 개수 표시

[사용법]
1. 확장 프로그램 아이콘을 클릭하여 설정
2. Z 키(또는 원하는 키)를 누르기
3. 마우스로 링크 영역 드래그
4. Z 키를 놓으면 링크가 열립니다

[설정 옵션]
- 단축키 변경
- 링크 열기 방식: 새 탭/백그라운드 탭/새 창
- 한 번에 열 최대 탭 수 (기본값: 10)
- 선택 박스 색상 커스터마이징
- 현재 도메인 필터링
- 확인 다이얼로그 토글

개인 및 상업적 용도로 자유롭게 사용할 수 있습니다.
```

#### 카테고리
- **카테고리:** 생산성
- **콘텐츠 등급:** 모든 연령
- **언어:** 한국어 (또는 영어: English)

#### 아이콘 & 스크린샷
- **아이콘:** 128x128.png
- **스크린샷:**
  - 1280x800 권장 (최소 2개)
  - 아이콘 클릭 시 팝업 설정 화면
  - Z 키로 링크 선택 화면
  - 확인 다이얼로그 화면

### Step 4: 개인정보처리방침 및 지원
- **개인정보처리방침 URL:** (필수)
  - https://turbobit.github.io/open-new-tab-chrome-ext/docs/privacy
- **지원 URL:** (선택사항)
  - https://github.com/turbobit/open-new-tab-chrome-ext/issues

### Step 5: 콘텐츠 등급 설정
1. IARC 심사 양식 작성
2. 이메일 확인
3. 심사 완료 (자동)

### Step 6: 검토 제출
1. 모든 정보 입력 완료 확인
2. "검토 제출" 클릭
3. Google 심사 대기 (보통 1-3시간)

---

## 📝 manifest.json 최적화 팁

✅ **이미 적용된 사항:**
- Manifest V3 (최신)
- 명확한 권한 명시
- 아이콘 설정

---

## 🔍 검토 시 주의사항

### Google이 확인하는 사항:
1. ✅ 악성 코드 없음 (자동 검사)
2. ✅ 권한의 적절성 (storage, tabs만 사용)
3. ✅ 명확한 기능 설명
4. ✅ 프라이버시 정책

### 거절될 수 있는 이유:
❌ 링크로 직접 방문 권장 (현재: 해당 없음 - 링크 수집만 함)
❌ 부정확한 설명
❌ 숨겨진 기능 (현재: 해당 없음)

---

## 💡 배포 후

### 버전 업데이트
```json
// manifest.json
"version": "1.1" (자동 업데이트 후 숫자 증가)
```

1. 코드 변경
2. manifest.json version 업데이트
3. zip 파일 다시 생성
4. 스토어에서 "새 패키지 업로드"

### 리뷰 모니터링
- Chrome Web Store 대시보드에서 사용자 리뷰 확인
- 버그 리포트 대응

---

## 🌐 온라인 리소스

- [Chrome Web Store Manifest V3 가이드](https://developer.chrome.com/docs/extensions/mv3/)
- [개발자 가이드](https://support.google.com/chrome/a/answer/2663860)
- [스토어 정책](https://support.google.com/chrome_webstore/answer/1047993)

---

## 📞 지원

배포 중 문제가 발생하면:
1. [Google Chrome 확장 프로그램 지원](https://support.google.com/chrome_webstore)
2. [개발자 포럼](https://groups.google.com/a/chromium.org/g/chromium-extensions)
