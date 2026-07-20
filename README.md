# Hermes 쉬운 한글 위키

[Hermes Agent](https://hermes-agent.nousresearch.com/) 공식 문서의 핵심을 이해하기 쉽게 한국어로 정리한 공개 학습 위키입니다.

- 공개 사이트: https://hermes-study-wiki.vercel.app
- 공식 문서: https://hermes-agent.nousresearch.com/docs

## 다루는 내용

- 설치와 빠른 시작
- 도구, 스킬, 메모리, 메시징
- 설정과 업데이트
- 프로필과 Gateway 운영
- 예약 작업(cron)과 운영 보안

문서는 공식 자료를 바탕으로 작성하며, 각 운영 문서에는 원문 링크와 확인일을 표시합니다.

## 개발

```bash
npm install
npm run start
npm run typecheck
npm run build
```

`main` 브랜치에 push하면 Vercel이 프로덕션 배포를 수행하도록 연결되어 있습니다.
