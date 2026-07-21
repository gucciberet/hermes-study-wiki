---
title: OpenAI 호환 API 서버 운영
---

# OpenAI 호환 API 서버 운영

Hermes API 서버는 Hermes 에이전트를 OpenAI 호환 HTTP 백엔드로 노출합니다. Open WebUI·LobeChat처럼 OpenAI 형식을 말하는 프런트엔드가 연결하면, 단순 모델 응답이 아니라 Hermes의 파일·터미널·웹·메모리·스킬 도구를 사용하는 에이전트 작업을 요청할 수 있습니다.

이 기능은 **로컬 UI 또는 신뢰하는 내부 서비스**를 Hermes에 붙일 때 적합합니다. API 호출자는 에이전트의 강력한 도구에 접근할 수 있으므로, 모델 API를 단순 중계하는 서버보다 훨씬 엄격하게 보호해야 합니다.

## 안전하게 켜는 순서

API 서버는 gateway 프로세스 안에서 실행됩니다. 먼저 제공자와 모델을 정상 구성한 뒤, 프로필의 `.env`에 API 서버를 활성화합니다. `API_SERVER_KEY`는 필수이며 실제 값은 비밀 관리 경로에만 보관합니다.

```dotenv
# ~/.hermes/.env
API_SERVER_ENABLED=true
API_SERVER_HOST=127.0.0.1
API_SERVER_PORT=8642
# API_SERVER_KEY는 실제 비밀값으로 별도 설정
```

```bash
# 포그라운드에서 기동하며 로그 확인
hermes gateway

# 별도 터미널에서 생존 상태 확인
curl http://127.0.0.1:8642/health
```

기본 바인드 주소는 `127.0.0.1`, 기본 포트는 `8642`입니다. 공개 IP에 직접 바인드하지 말고, 외부 연결이 꼭 필요하면 인증을 강제하는 리버스 프록시·TLS·네트워크 접근 제어를 먼저 설계하세요.

## 클라이언트 연결 정보

OpenAI 호환 클라이언트에는 다음 정보를 사용합니다.

| 항목 | 값 |
| --- | --- |
| Base URL | `http://127.0.0.1:8642/v1` |
| 인증 | `Authorization: Bearer $API_SERVER_KEY` |
| 모델 목록 | `GET /v1/models` |
| 기본 모델 ID | 기본 프로필은 `hermes-agent`, 다른 프로필은 프로필 이름 |

Chat Completions 호환 요청은 `POST /v1/chat/completions`를 사용합니다. 이 형식은 무상태이므로 클라이언트가 매 요청마다 `messages` 전체를 보냅니다. 반면 `POST /v1/responses`는 `previous_response_id`로 서버에 저장된 대화·도구 결과를 다음 요청에 연결할 수 있습니다.

```bash
# 변수 값은 실행 환경의 비밀 관리 경로에서만 주입합니다.
curl http://127.0.0.1:8642/v1/chat/completions \
  -H "Authorization: Bearer $API_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "hermes-agent",
    "messages": [{"role": "user", "content": "프로젝트의 README를 요약해 줘"}]
  }'
```

요청의 `model` 필드는 호환성을 위해 받지만, 실제로 쓰는 LLM은 Hermes 서버 쪽 `config.yaml`의 모델 설정이 결정합니다. 따라서 UI 사용자가 임의 모델명을 보내도 서버의 운영 모델을 바꾸지 않습니다.

## 장기 작업과 상태 확인

대시보드나 자체 UI가 작업 진행 상황을 보여 주어야 하면 Runs API를 사용합니다.

- `POST /v1/runs`: 에이전트 작업을 만들고 `run_id`를 받습니다.
- `GET /v1/runs/{run_id}`: SSE 연결 없이 현재 상태를 조회합니다.
- `GET /v1/runs/{run_id}/events`: 도구 진행·토큰 델타·수명주기를 SSE로 구독합니다.
- `POST /v1/runs/{run_id}/stop`: 실행 중인 작업에 중단을 요청합니다.
- `POST /v1/runs/{run_id}/approval`: 승인 대기 도구 호출에 사람의 결정을 전달합니다.

`/health`는 가벼운 생존 확인입니다. 모니터링에서 설정·상태 DB·모델·디스크·gateway 상태까지 확인하려면 인증된 `GET /health/detailed`를 사용하고, HTTP 상태 코드만 보지 말고 응답의 `status`와 `readiness.checks`도 판단하세요.

## 브라우저와 CORS

서버 간 연결(Open WebUI 같은 일반적인 구성)은 CORS가 필요 없습니다. 브라우저 JavaScript가 Hermes에 직접 요청해야 할 때만 정확한 origin을 열거합니다.

```dotenv
# 와일드카드 대신 실제 개발 origin만 허용
API_SERVER_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

CORS는 기본적으로 꺼져 있습니다. 넓은 origin 허용은 브라우저에서 API 키와 에이전트 도구 권한이 오용될 범위를 키우므로 피하세요.

## 운영 주의사항

- `API_SERVER_KEY`는 loopback 환경에서도 필수입니다. 문서·Git·브라우저 코드에 넣지 않습니다.
- Responses API 저장 응답은 gateway 재시작 뒤에도 SQLite에 남고 최대 100개를 LRU 방식으로 보관합니다. 민감한 대화 보존 정책을 확인하세요.
- API의 파일 업로드는 지원하지 않습니다. 이미지 URL 또는 `data:image/...` 형태의 인라인 이미지는 Chat Completions와 Responses API에서 지원하지만, 일반 문서 파일은 지원하지 않습니다.
- 공개 프런트엔드에 연결하기 전에는 도구 허용 범위와 승인 정책을 별도로 검토하세요. API 서버는 터미널 명령을 포함한 Hermes 도구 세트에 접근합니다.

## 공식 원문

- [API Server](https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server)

_공식 문서 확인일: 2026-07-22_
