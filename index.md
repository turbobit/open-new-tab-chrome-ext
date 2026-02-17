---
layout: default
title: Link Collector
---

# 🔗 Link Collector

> Z 키로 웹페이지의 링크를 일괄 수집하는 Chrome 확장 프로그램

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/turbobit/open-new-tab-chrome-ext)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-red)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](#라이선스)

---

## ✨ 주요 기능

### 🎯 기본 기능
- **빠른 링크 수집**: Z 키로 영역 선택 → 모든 링크 자동 수집
- **중복 제제거**: 같은 링크는 자동으로 제거
- **실시간 카운트**: 선택 영역의 링크 개수 실시간 표시

### ⚙️ 고급 기능
- **단축키 커스터마이징**: 기본 Z 키를 원하는 키로 변경
- **열기 방식 선택**: 새 탭 / 백그라운드 탭 / 새 창
- **최대 탭 수 제한**: 1~50개 범위에서 설정
- **색상 커스터마이징**: 선택 박스 색상 자유롭게 변경
- **도메인 필터**: 현재 도메인의 링크만 선택 가능
- **확인 다이얼로그**: 링크 열기 전 확인 옵션
- **다국어 지원**: 한국어, 영어, 일본어 (언어 기여 환영!)

---

## 📥 설치 방법

### Chrome Web Store (권장)
1. [Chrome Web Store](https://chrome.google.com/webstore)에서 "Link Collector" 검색
2. "Chrome에 추가" 클릭
3. 권한 승인

### 개발자 모드
```bash
git clone https://github.com/turbobit/open-new-tab-chrome-ext.git
cd open-new-tab-chrome-ext
```

1. Chrome 주소창에 `chrome://extensions/` 입력
2. **개발자 모드** 활성화 (우측 상단)
3. **"압축 해제된 확장 프로그램 로드"** 클릭
4. 프로젝트 폴더 선택

---

## 🚀 사용법

### 1단계: 설정 열기
확장 프로그램 아이콘 클릭 → 설정 팝업 열기

### 2단계: 링크 선택
- Z 키 누르기
- 마우스로 링크 영역 드래그
- 링크 개수 실시간 표시

### 3단계: 링크 열기
- Z 키 놓기
- 확인 다이얼로그 (필요 시)
- 설정된 방식으로 자동 열기

---

## 📚 더 알아보기

**한국어 (Korean)**
- [📖 전체 가이드](./docs/README.md)
- [🔒 개인정보처리방침](./docs/privacy.md)
- [📋 배포 가이드](./docs/deployment.md)

**영어 (English)**
- [📖 Full Guide](./docs/README.en.md)

- [🐛 GitHub Issues](https://github.com/turbobit/open-new-tab-chrome-ext/issues)

---

## 🛠️ 기술 정보

| 항목 | 정보 |
|------|------|
| **버전** | 1.0 |
| **라이선스** | MIT |
| **지원 브라우저** | Chrome 100+ |
| **용량** | ~8KB |
| **권한** | tabs, storage |
| **지원 언어** | 한국어, 영어, 일본어 |
| **Manifest** | V3 (최신) |

---

## 🤝 기여

버그 신고, 기능 제안, 그리고 **새로운 언어 번역**을 환영합니다!

- [GitHub Issues 열기](https://github.com/turbobit/open-new-tab-chrome-ext/issues)
- [Pull Request 제출](https://github.com/turbobit/open-new-tab-chrome-ext/pulls)
- [📝 기여 가이드](https://github.com/turbobit/open-new-tab-chrome-ext/blob/main/CONTRIBUTING.md) - 다국어 기여 방법

---

## 📝 라이선스

MIT License © 2024 Link Collector Contributors

자유롭게 사용, 수정, 배포 가능합니다.

---

**Made with ❤️ for Chrome users**
