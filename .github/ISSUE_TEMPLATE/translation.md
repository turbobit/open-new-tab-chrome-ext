---
name: Translation Request / 번역 요청
about: Request a new language translation for Link Collector
title: "i18n: Add [Language] translation"
labels: i18n, translation
assignees: ''

---

## Language / 언어

(e.g., French / 프랑스어)

## Language Code

(e.g., fr - See [Chrome supported locales](https://developer.chrome.com/docs/extensions/reference/i18n/#locales))

## Translation Status / 번역 상태

- [ ] Translation draft completed / 번역 초안 완료
- [ ] Proofread by native speaker / 모국어 사용자가 검수함

## Translation Draft / 번역 초안

(Paste the complete `_locales/{language}/messages.json` content here)

```json
{
  "extName": {
    "message": "[Your Language] - Link Collector"
  },
  "extDescription": {
    "message": "[Your Language Translation]"
  }
  // ... all 28 message keys
}
```

## Notes / 노트

(Any special notes about this translation, e.g., regional variations, cultural considerations)

---

**Translation Contribution Guidelines / 번역 기여 가이드:**
- See [CONTRIBUTING.md](../CONTRIBUTING.md#-다국어-지원i18n-기여) for detailed guidelines
- Please ensure all 28 message keys are translated
- Use the existing `_locales/en/messages.json` as a template
- Maintain placeholder positions (`$COUNT$`, `$MODE$`) exactly as shown
