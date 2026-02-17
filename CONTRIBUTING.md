# 기여하기 (Contributing)

Link Collector 프로젝트에 기여해주셔서 감사합니다! 이 가이드는 다음에 대한 방법을 설명합니다:
- 버그 신고
- 기능 요청
- 코드 기여 (특히 다국어 지원)
- 풀 리퀘스트 작성

---

## 🌐 다국어 지원(i18n) 기여

현재 Link Collector는 **한국어(ko), 영어(en), 일본어(ja)** 를 지원합니다.
새로운 언어를 추가하고 싶으신가요? 아래 단계를 따라주세요!

### 1단계: 새 언어 파일 생성

#### a) 폴더 구조 이해
```
_locales/
  ko/
    messages.json     (한국어)
  en/
    messages.json     (영어)
  ja/
    messages.json     (일본어)
```

#### b) 새 언어 추가 예시 (프랑스어)

1. `_locales/fr/` 폴더 생성
2. 기존 `_locales/en/messages.json` 파일 복사
3. 각 메시지의 `"message"` 필드를 프랑스어로 번역

```json
// _locales/fr/messages.json 예시
{
  "extName": {
    "message": "Link Collector"
  },
  "extDescription": {
    "message": "Appuyez sur la touche Z pour sélectionner une zone de la page web et ouvrir tous les liens de cette zone à la fois."
  },
  // ... 나머지 메시지들
}
```

### 2단계: 번역 가이드라인

#### 메시지 키별 번역 팁

| 키 | 용도 | 번역 팁 |
|------|------|--------|
| `extName` | 확장 프로그램 이름 | 그대로 유지 (고유명사) |
| `extDescription` | Chrome Web Store 설명 | 명확하고 간결하게 |
| `labelHotkey` | UI 레이블 | 짧고 이해하기 쉽게 |
| `linkCount` | 링크 개수 표시 | `$COUNT$` 위치 유지 |
| `confirmMessage` | 확인 다이얼로그 | `$COUNT$`와 `$MODE$` 위치 정확히 |

#### Placeholder 처리

일부 메시지에는 `$COUNT$`, `$MODE$` 같은 placeholder가 포함됩니다.
**반드시 원래 위치에 유지해주세요!**

```json
// ❌ 잘못된 예
{
  "confirmMessage": {
    "message": "여는 $COUNT$개의 링크를 $MODE$로?"
  }
}

// ✅ 올바른 예
{
  "confirmMessage": {
    "message": "$COUNT$개 링크를 $MODE$로 여시겠어요?"
  }
}
```

### 3단계: 번역 확인

언어 코드 확인: [Chrome Supported Locales](https://developer.chrome.com/docs/extensions/reference/i18n/#locales)

### 4단계: Pull Request 작성

#### PR 제목 형식
```
i18n: Add {언어명} translation (e.g. "i18n: Add French translation")
```

#### PR 설명 템플릿
```markdown
## 추가된 언어
- 언어: 프랑스어 (fr)
- 메시지 수: 28개

## 확인사항
- [x] 모든 28개 메시지 번역 완료
- [x] placeholder ($COUNT$, $MODE$) 정확히 배치
- [x] 확장 프로그램 재로드 후 테스트 완료
  - Chrome 언어 설정 > 프랑스어로 변경
  - 팝업 UI 프랑스어로 표시됨 확인
  - 영역 선택 및 확인 다이얼로그 프랑스어 확인

## 스크린샷 (선택사항)
팝업 화면의 스크린샷을 첨부하면 좋습니다.
```

---

## 🐛 버그 신고

버그를 발견하셨나요? [Issues](https://github.com/turbobit/open-new-tab-chrome-ext/issues) 에서 신고해주세요.

### 버그 신고 템플릿

```markdown
## 문제 설명
(버그가 무엇인지 명확히 설명해주세요)

## 재현 단계
1. ...
2. ...
3. ...

## 예상 동작
(무엇이 일어나야 하는가)

## 실제 동작
(실제로 일어난 일)

## 환경
- Chrome 버전: (예: 120.0.6099.129)
- OS: (예: Windows 10, macOS 13, Ubuntu 22.04)
- 확장 프로그램 버전: 1.0
```

---

## ✨ 기능 요청

새로운 기능을 제안하고 싶으신가요? [Issues](https://github.com/turbobit/open-new-tab-chrome-ext/issues/new) 에서 "Feature Request" 레이블로 이슈를 생성해주세요.

### 기능 요청 템플릿

```markdown
## 설명
(새로운 기능이 무엇인지 설명)

## 사용 시나리오
(언제 이 기능이 필요한지)

## 예상 동작
(기능이 어떻게 작동해야 하는지)
```

---

## 📝 코드 기여 (일반)

### 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/turbobit/open-new-tab-chrome-ext.git
cd open-new-tab-chrome-ext

# Chrome 확장 프로그램으로 로드
# 1. chrome://extensions 열기
# 2. "개발자 모드" 활성화
# 3. "압축 해제된 확장 프로그램 로드" 클릭
# 4. 프로젝트 폴더 선택
```

### 코드 스타일

- **Vanilla JavaScript** 사용 (외부 라이브러리 최소화)
- 주석은 영어로 작성
- 함수는 명확한 이름 사용

### Pull Request 체크리스트

- [ ] 코드가 기존 스타일과 일치합니다
- [ ] 테스트를 실행했습니다
- [ ] 관련 문서를 업데이트했습니다
- [ ] 커밋 메시지가 명확합니다

---

## 📄 라이선스

이 프로젝트는 MIT License 하에 있습니다. 기여하심으로써 당신의 코드가 동일한 라이선스로 배포될 수 있음을 인정합니다.

---

## 💬 질문이 있으신가요?

- [GitHub Issues](https://github.com/turbobit/open-new-tab-chrome-ext/issues) 에서 질문해주세요
- 또는 이슈 섹션에 "Question" 레이블을 붙여서 문의해주세요

감사합니다! 🙏
