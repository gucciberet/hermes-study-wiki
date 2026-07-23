# Hermes Agent 문서 (한국어)

[Hermes Agent](https://hermes-agent.nousresearch.com/) 공식 문서를 한국어로 번역한 공개 사이트입니다. 공식 문서 사이트의 UI/UX와 소스 구조를 그대로 따르며, 현재는 빠른 시작(Quickstart) 한 페이지를 게시합니다.

- 공개 사이트: https://hermes-study-wiki.vercel.app
- 공식 문서: https://hermes-agent.nousresearch.com/docs

## 구조

- 사이트는 [Docusaurus](https://docusaurus.io/)로 빌드됩니다.
- 게시 페이지: `docs/getting-started/quickstart.md` → `/docs/getting-started/quickstart`
- 번역 진행 상태는 `translation-state.json`에 기록됩니다(사이트에는 게시되지 않음).

## 개발

```bash
npm install
npm run start
npm run typecheck
npm run build
```

`main` 브랜치에 push하면 Vercel이 프로덕션 배포를 수행하도록 연결되어 있습니다.
