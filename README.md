# 🔗 Link Collector - Chrome Extension

웹페이지의 특정 영역에서 링크를 효율적으로 수집하고 한 번에 열 수 있는 Chrome 확장 프로그램입니다.

![Version](https://img.shields.io/badge/version-1.1.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome](https://img.shields.io/badge/chrome-manifest%20v3-brightgreen)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)

---

## ✨ 주요 기능

### 🎯 기본 기능
- **빠른 링크 수집**: Z 키(또는 원하는 키)로 영역을 선택하여 모든 링크 수집
- **중복 자동 제거**: 같은 링크는 자동으로 제거됨
- **실시간 링크 카운트**: 선택 영역의 링크 개수를 실시간으로 표시
- **선택 박스 시각화**: 파란색 테두리로 선택 영역 표시

### ⚙️ 고급 기능
- **단축키 커스터마이징**: 기본 Z 키를 원하는 키로 변경 가능
- **열기 방식 선택**:
  - 새 탭 (포커스)
  - 백그라운드 탭
  - 새 창에서 열기
- **최대 탭 수 제한**: 한 번에 열 수 있는 최대 탭 수 설정 (1~50, 기본값: 10)
- **색상 커스터마이징**: 선택 박스의 색상을 자유롭게 설정
- **도메인 필터링**: 현재 도메인의 링크만 열기 옵션
- **확인 다이얼로그**: 링크 열기 전 확인 대화 (선택 가능)

---

## 📥 설치 방법

### Chrome Web Store (권장)
1. [Chrome Web Store에서 Link Collector 검색](https://chrome.google.com/webstore)
2. "Chrome에 추가" 클릭
3. 권한 승인

### 개발자 모드 설치
1. 이 저장소 클론 또는 다운로드
   ```bash
   git clone https://github.com/turbobit/open-new-tab-chrome-ext.git
   cd open-new-tab-chrome-ext
   ```

2. Chrome 주소창에 입력: `chrome://extensions/`

3. **개발자 모드** 활성화 (우측 상단 토글)

4. **"압축 해제된 확장 프로그램 로드"** 클릭

5. 프로젝트 폴더 선택

---

## 🚀 사용법

### 1단계: 설정 열기
- 브라우저 우측 상단의 확장 프로그램 아이콘 클릭
- Link Collector 팝업 창에서 원하는 설정 조정
- "저장" 버튼 클릭

### 2단계: 링크 선택
- 웹페이지에서 **Z 키 누르기** (또는 설정한 키)
- **마우스로 드래그**하여 링크가 있는 영역 선택
- 선택 박스 안의 **링크 개수 실시간 표시**

### 3단계: 링크 열기
- **Z 키 놓기**
- 확인 다이얼로그 표시 (활성화된 경우)
- 설정된 방식으로 링크 자동 열기

---

## ⚙️ 설정 옵션

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| **단축키** | `z` | 영역 선택을 시작할 키 (1글자) |
| **열기 방식** | 새 탭 (포커스) | 링크를 열 방식 선택 |
| **최대 탭 수** | 10 | 한 번에 열 수 있는 최대 탭 수 (1~50) |
| **선택 박스 색상** | #007bff | 선택 영역 박스 색상 |
| **도메인 필터** | OFF | 현재 도메인의 링크만 열기 |
| **확인 다이얼로그** | OFF | 링크 열기 전 확인 표시 |

---

## 🛠️ 기술 사양

### 프로젝트 구조
```
open-new-tab-chrome-ext/
├── manifest.json              # Chrome 확장 설정
├── content.js                 # 웹페이지 콘텐츠 스크립트
├── background.js              # 백그라운드 서비스 워커
├── popup.html                 # 설정 팝업 UI
├── popup.js                   # 팝업 로직
├── icon-*.png                 # 여러 크기의 아이콘
├── README.md                  # 이 파일
├── PRIVACY_POLICY.md          # 개인정보처리방침
├── STORE_DEPLOYMENT.md        # 배포 가이드
├── package.json               # npm 빌드 스크립트
├── scripts/build-release.mjs  # 릴리즈 패키지 생성
├── .gitignore                 # Git 설정
└── create-release.py          # (레거시) 배포 패키지 생성
```

### 기술 스택
- **Manifest V3** - 최신 Chrome 확장 표준
- **Vanilla JavaScript** - 외부 라이브러리 없음
- **Chrome Storage API** - 설정 동기화
- **Chrome Tabs API** - 탭 관리

### 권한
- `tabs` - 탭 생성 및 관리
- `storage` - 사용자 설정 저장/로드

### 특징
- ✅ 가벼운 용량 (약 8KB)
- ✅ 보안 최우선 (CSP 준수, XSS 방지)
- ✅ 성능 최적화 (Throttle 적용, Set 사용)
- ✅ 실시간 설정 반영
- ✅ 다국어 지원 (한국어)

---

## 🐛 문제 해결

### Q: Z 키가 작동하지 않습니다
**A:**
1. 확장 프로그램이 해당 사이트에서 실행 중인지 확인
2. `chrome://extensions` 에서 권한 확인
3. 다른 확장 프로그램과 단축키 충돌 확인
4. 단축키를 다른 키로 변경해보기

### Q: 링크가 열리지 않습니다
**A:**
1. `javascript:` 또는 `mailto:` 링크는 제외됩니다
2. 확인 다이얼로그가 활성화된 경우 "열기" 버튼 클릭
3. 최대 탭 수 설정 확인
4. 선택 영역에 실제 링크가 있는지 확인

### Q: 설정이 저장되지 않습니다
**A:**
1. 팝업에서 "저장" 버튼을 클릭했는지 확인
2. 저장 메시지가 표시되는지 확인 (2초 간)
3. 새로고침 후 다시 확인
4. 동기화 설정 확인 (`chrome://settings/syncSetup`)

### Q: 색상 아이콘이 나타나지 않습니다
**A:**
1. 확장 프로그램 재로드 (`chrome://extensions` > 재로드)
2. 브라우저 캐시 삭제
3. 확장 프로그램 다시 설치

---

## 📋 개발 및 배포

### 개발 환경 설정
```bash
# 저장소 클론
git clone https://github.com/turbobit/open-new-tab-chrome-ext.git
cd open-new-tab-chrome-ext

# 개발자 모드로 설치
# chrome://extensions 에서 "압축 해제된 확장 프로그램 로드" 사용
```

### 배포 패키지 생성
```bash
# npm 빌드 (권장)
npm run build
```

### GitHub Actions 자동 릴리즈
- 워크플로 파일: `.github/workflows/release.yml`
- 트리거: Git 태그 푸시 시 자동 실행
- 동작: `npm run build` 실행 후 `dist/link-collector.zip`을 GitHub Release에 자동 첨부

```bash
# 예시: 버전 태그 생성 및 푸시
git tag v1.1.1
git push origin v1.1.1
```

### Chrome Web Store 배포
자세한 가이드는 [STORE_DEPLOYMENT.md](./STORE_DEPLOYMENT.md) 참조

---

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

```
MIT License

Copyright (c) 2024 Link Collector Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🤝 기여하기

버그 보고 및 개선 제안을 환영합니다!

### 버그 신고
1. [GitHub Issues](https://github.com/turbobit/open-new-tab-chrome-ext/issues) 열기
2. 상세한 설명 제공
3. 재현 단계 기술

### 기능 제안
1. Discussion 또는 Issue 생성
2. 기능의 필요성 설명
3. 예상 사용 시나리오 제시

### Pull Request
```bash
# 1. Fork 저장소
# 2. Feature 브랜치 생성
git checkout -b feature/your-feature

# 3. 변경사항 커밋
git commit -m "Add your feature"

# 4. 브랜치 푸시
git push origin feature/your-feature

# 5. Pull Request 생성
```

---

## 📞 지원 및 연락처

- **GitHub Issues**: [버그 신고 및 기능 요청](https://github.com/turbobit/open-new-tab-chrome-ext/issues)
- **Chrome Web Store**: [리뷰 섹션에 문의](https://chrome.google.com/webstore)
- **공식 문서**: [STORE_DEPLOYMENT.md](./STORE_DEPLOYMENT.md), [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)

---

## 📊 버전 정보

### v1.1.1 (현재)
- ✅ 기본 링크 수집 기능
- ✅ 단축키 커스터마이징
- ✅ 설정 팝업 UI
- ✅ 링크 필터링
- ✅ 확인 다이얼로그

### 향후 계획
- 🔄 다국어 지원 확장
- 🔄 링크 미리보기
- 🔄 링크 히스토리
- 🔄 바로가기 키 커스터마이징 UI

---

## 🙏 감사의 말

이 프로젝트를 사용해주시고 피드백을 제공해주신 모든 사용자분께 감사드립니다.

---

**Made with ❤️ for Chrome users**

Last updated: 2026년 2월
