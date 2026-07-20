---
title: Webhook 이벤트 자동화
---

# Webhook 이벤트 자동화

Webhook 어댑터는 GitHub, GitLab, 모니터링 서비스 등의 HTTP 이벤트를 받아 Hermes 작업으로 바꿉니다. 요청을 인증하고, 필요한 필드만 프롬프트에 넣고, 결과를 로그 또는 연결된 메시지 채널에 전달할 수 있습니다.

외부 이벤트는 편리하지만 비신뢰 입력입니다. 공개 인터넷에 노출하기 전에는 격리·도구 범위·승인 정책을 먼저 설계하세요.

## 시작 순서

1. `hermes gateway setup`에서 webhook을 활성화하고 포트와 전역 HMAC 비밀값을 설정합니다.
2. `config.yaml`에 이름 있는 route를 추가합니다.
3. 외부 서비스의 URL을 `http://<호스트>:8644/webhooks/<route-name>` 형식으로 설정합니다.
4. gateway를 실행한 뒤 health endpoint로 수신 서버를 확인합니다.

```bash
hermes gateway setup
curl http://localhost:8644/health
```

정상이라면 health endpoint는 webhook 플랫폼이 정상이라는 JSON 응답을 돌려줍니다. 외부 서비스에서 접근해야 한다면 방화벽·리버스 프록시·TLS·포트 노출도 별도로 점검해야 합니다.

## 최소 route를 좁게 만들기

아래는 pull request 이벤트만 받아 로그에 남기는 형태입니다. HMAC 값은 별도 비밀 저장소 또는 Hermes 설정 흐름에서 관리하고, Git에 커밋하지 마세요.

```yaml
platforms:
  webhook:
    enabled: true
    extra:
      port: 8644
      routes:
        pr-review:
          events: ["pull_request"]
          secret: "<별도 보관한 HMAC 비밀값>"
          prompt: |
            다음 PR의 변경 사항을 검토하고 위험 요소만 요약하세요.
            저장소: {repository.full_name}
            제목: {pull_request.title}
            URL: {pull_request.html_url}
          deliver: "log"
```

`events`를 비워 두면 모든 이벤트를 받습니다. 처음에는 필요한 이벤트만 허용하고, `{__raw__}`나 빈 `prompt`처럼 전체 payload를 넣는 방식보다 명시한 필드를 사용하는 편이 안전합니다. payload 안의 PR 제목·커밋 메시지·이슈 본문은 서명이 유효해도 신뢰할 수 없는 텍스트입니다.

## 알림만 필요하면 `deliver_only`

추론 없이 정해진 문구를 전달할 때는 agent 실행을 생략할 수 있습니다.

```yaml
platforms:
  webhook:
    enabled: true
    extra:
      routes:
        build-alert:
          events: ["alert"]
          secret: "<별도 보관한 HMAC 비밀값>"
          deliver: "slack"
          deliver_only: true
          prompt: "배포 알림: {status} — {summary}"
```

`deliver_only: true`는 LLM을 호출하지 않아 비용과 지연을 줄입니다. 이 경우 실제 전달 대상이 반드시 있어야 하며 `deliver: log`는 허용되지 않습니다.

## 보안과 장애 대응

- route마다 비밀값이 필요합니다. GitHub는 HMAC 서명, GitLab은 토큰 헤더를 검증합니다.
- Generic V2 서명은 timestamp를 포함하며 서버 시각의 ±300초 안에서만 수락되어 재전송 공격을 줄입니다.
- 기본 제한은 route당 분당 30건, 최대 본문은 1MB, 동일 delivery ID의 중복 방지는 1시간입니다.
- 인터넷 노출 gateway는 Docker·SSH 백엔드 또는 VM에서 격리하고, webhook 세션의 터미널·파일·외부 쓰기 도구를 최소화하세요.
- 수신되지 않으면 URL 경로·방화벽·health endpoint를, 서명 오류면 route와 송신 측의 비밀값 및 헤더를 확인합니다.

## 공식 원문

- [Webhooks](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks)

_공식 문서 확인일: 2026-07-21_
