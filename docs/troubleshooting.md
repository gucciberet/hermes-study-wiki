---
title: 운영 장애 진단 순서
---

# 운영 장애 진단 순서

Hermes 운영 장애는 대개 설치 경로, 제공자 설정, 문맥 길이, gateway 실행 상태, MCP 외부 프로세스 중 한 곳에서 시작합니다. 문제마다 설정을 무작정 바꾸기보다 **재현 → 상태 확인 → 최소 변경 → 재검증** 순서로 좁히면 운영 환경을 더 안전하게 유지할 수 있습니다.

## 공통 1차 점검

```bash
hermes status
hermes doctor
hermes config check
```

먼저 오류가 CLI 세션만의 문제인지, gateway·cron까지 영향을 받는 공통 설정 문제인지 구분합니다. 오류 메시지·실행 시각·재현 명령은 기록하되 API 키, 토큰, 메시지 본문, 개인 경로가 포함된 원본 로그는 공유하지 마세요.

## 명령을 찾을 수 없을 때

설치 직후 `hermes: command not found`가 나오면 새 PATH가 현재 셸에 아직 반영되지 않았을 수 있습니다.

```bash
source ~/.bashrc    # bash
# 또는 새 터미널을 엽니다.

which hermes
ls ~/.local/bin/hermes
```

Hermes 설치기는 일반적으로 `~/.local/bin`을 PATH에 추가합니다. 비표준 셸 설정을 쓰는 경우에는 그 경로가 실제 로그인 셸 PATH에 포함되는지 확인합니다. Python 버전 오류라면 Hermes는 Python 3.11 이상이 필요하므로 먼저 `python3 --version`으로 확인합니다.

## 제공자·모델 오류

### 세션의 `/model`에 원하는 제공자가 없을 때

채팅 안의 `/model`은 이미 설정된 제공자만 전환합니다. 새 제공자 추가, OAuth, 엔드포인트 설정은 터미널에서 실행합니다.

```bash
hermes model
```

설정 후 새 세션을 시작해야 새 후보가 보입니다. 서로 다른 제공자의 자격증명을 섞어 쓰지 말고, 비밀값은 `.env`와 Hermes 인증 흐름에서만 관리합니다.

### 429·5xx 또는 모델 없음

요청 제한(429)은 잠시 뒤 재시도하고, 지속되면 다른 모델·제공자 또는 폴백 체인을 검토합니다. 모델을 찾지 못하면 추측한 ID를 직접 고치기보다 `hermes model`에서 현재 제공자가 제공하는 모델을 확인하세요.

```bash
hermes model
hermes chat --provider <이미_구성한_대체_제공자>
```

## 긴 대화와 컨텍스트 초과

컨텍스트 길이 초과는 긴 대화, 대량 도구 출력, 또는 모델의 컨텍스트 길이를 잘못 감지한 경우에 발생합니다. 먼저 현재 세션에서 문맥을 압축합니다.

```text
/compress
/usage
```

압축 뒤에도 반복되면 새 세션을 시작하거나, 실제 모델의 컨텍스트 창을 `config.yaml`에 명시합니다.

```yaml
model:
  default: your-model-name
  context_length: 131072 # 실제 모델 컨텍스트 길이로 교체
```

로컬 또는 custom endpoint는 서버가 실제로 적용한 컨텍스트 길이와 Hermes 설정이 일치해야 합니다. 특히 Ollama의 최대 모델 컨텍스트와 실행 시 `num_ctx`는 다를 수 있습니다.

## gateway가 응답하지 않을 때

```bash
hermes gateway status
hermes gateway start
```

gateway가 떠 있는데도 응답이 없으면 다음을 순서대로 확인합니다.

1. gateway 로그에 인증·네트워크·플랫폼 연결 오류가 있는지 확인합니다.
2. 메시지 사용자가 allowlist 또는 DM pairing 정책을 통과하는지 확인합니다.
3. webhook 기반 플랫폼이면 공개 URL, TLS, 방화벽, 포트가 송신 측에서 도달 가능한지 확인합니다.
4. 설정을 바꿨다면 gateway를 재시작합니다.

메신저 gateway는 비대화형 환경이라 `sudo` 암호 입력을 할 수 없습니다. 관리 작업은 `hermes chat` 같은 터미널 인터페이스에서 수행하거나, 허용할 명령을 운영자가 별도 최소 권한 정책으로 설계하세요.

## MCP 연결·도구 발견 문제

MCP 서버가 연결되지 않으면 Hermes 자체보다 서버 실행 명령, 런타임, PATH를 먼저 확인합니다.

```bash
node --version     # npx 기반 MCP 서버인 경우
```

다음도 함께 점검합니다.

- `mcp_servers`의 `command`, `args`, URL과 `enabled` 값이 맞는가?
- `tools.include`가 실제 MCP 서버의 **원래 도구 이름**을 허용하는가?
- 원격 HTTP MCP의 네트워크·TLS·서버 로그는 정상인가?
- 설정 변경 뒤 대화에서 `/reload-mcp`를 실행했는가?

서버는 시작됐지만 도구가 보이지 않으면 `tools/list` 지원 여부와 include/exclude 필터를 우선 검토합니다. 시간 초과는 Hermes 로그뿐 아니라 MCP 서버 자체 로그도 확인해야 원인을 분리할 수 있습니다.

## 터미널에서 Node·nvm·pyenv 등이 안 보일 때

Hermes는 시작 시 로그인 셸 환경을 수집합니다. bash 로그인 셸은 일반적으로 `~/.bashrc`를 읽지 않으므로, 셸 초기화 파일에만 PATH를 설정한 도구는 보이지 않을 수 있습니다. 필요한 초기화 파일만 명시합니다.

```yaml
terminal:
  shell_init_files:
    - ~/.nvm/nvm.sh
    - /etc/profile.d/cargo.sh
```

zsh 전용 문법이 있는 파일을 bash에서 그대로 읽으면 실패할 수 있습니다. 전체 셸 설정 파일보다 PATH를 설정하는 전용 초기화 파일을 지정하는 편이 안전합니다.

## 공식 원문

- [FAQ & Troubleshooting](https://hermes-agent.nousresearch.com/docs/reference/faq)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [MCP (Model Context Protocol)](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)

_공식 문서 확인일: 2026-07-22_
