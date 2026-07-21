---
title: ACP로 VS Code·Zed 연결
---

# ACP로 VS Code·Zed 연결

ACP(Agent Context Protocol)는 IDE가 표준 입출력(stdio)으로 Hermes와 통신하도록 하는 프로토콜입니다. ACP 호환 편집기에서는 채팅만이 아니라 도구 활동, 파일 diff, 터미널 명령, 승인 요청, 스트리밍 응답을 편집기 UI에서 볼 수 있습니다.

이는 Hermes를 별도 터미널이나 메신저 봇으로 쓰는 대신, 현재 열어 둔 작업공간에 맞춘 코딩 에이전트로 쓰고 싶을 때 적합합니다.

## ACP 모드의 도구 범위

ACP 서버는 편집기 흐름에 맞춘 `hermes-acp` 도구 세트를 사용합니다. 파일 읽기·쓰기·패치·검색, 터미널과 프로세스, 웹/브라우저, 메모리·스킬·세션 검색, 코드 실행·위임, 비전을 포함합니다.

반대로 메시지 전달과 cron 관리처럼 일반적인 편집기 UX에 맞지 않는 기능은 의도적으로 제외됩니다. ACP에서 작업한다고 해서 다른 Hermes 기능 전체가 IDE 안에 그대로 나타나는 것은 아닙니다.

## 설치와 자체 점검

Hermes를 소스에서 개발 설치한 환경에서는 ACP extra를 추가합니다.

```bash
pip install -e '.[acp]'
```

그러면 `hermes acp`, `hermes-acp`, `python -m acp_adapter` 실행 경로가 제공됩니다. 서버를 직접 실행할 필요는 없고, 대체로 IDE가 아래 명령을 stdio 하위 프로세스로 시작합니다.

```bash
hermes acp

# 비대화형 사전 점검
hermes acp --version
hermes acp --check
hermes doctor
```

ACP의 표준 출력은 JSON-RPC 전송 전용입니다. 로그는 stderr로 나가므로, 명령 출력에 일반 텍스트를 섞어 프로토콜을 깨뜨리지 마세요.

## VS Code 연결

1. VS Code에서 **ACP Client** 확장을 설치합니다.
2. Activity Bar의 ACP Client 패널을 엽니다.
3. 기본 에이전트 목록에서 **Hermes Agent**를 선택하고 연결합니다.

수동 등록이 필요한 경우 VS Code 설정의 `acp.agents`에 다음처럼 명령을 지정합니다.

```json
{
  "acp.agents": {
    "Hermes Agent": {
      "command": "hermes",
      "args": ["acp"]
    }
  }
}
```

## Zed 연결

Zed 0.221.x 이상에서는 공식 ACP Registry로 설치할 수 있습니다.

1. Agent Panel에서 **Add Agent**를 선택하거나 `zed: acp registry` 명령을 실행합니다.
2. **Hermes Agent**를 검색해 설치합니다.
3. 새 Hermes external-agent 스레드를 시작합니다.

Registry 실행 경로는 `uvx --from 'hermes-agent[acp]==<version>' hermes-acp`를 사용하므로 `uv`가 `PATH`에 있어야 합니다. 먼저 `hermes model`로 제공자 자격증명과 모델을 구성하세요.

## 작업공간·세션·승인 방식

- ACP 세션은 실행 중인 ACP 서버 프로세스 안에서 관리됩니다. `list`, `load`, `resume`, `fork` 범위도 그 프로세스에 한정됩니다.
- 편집기의 현재 작업 디렉터리가 ACP 작업 ID에 연결됩니다. 따라서 파일·터미널 도구는 ACP 서버를 띄운 위치가 아니라 편집기 작업공간을 기준으로 실행됩니다.
- 기본 Hermes 설정·스킬·상태 DB는 CLI와 공유합니다. 즉 제공자 해석도 기존 Hermes 설정을 그대로 따릅니다.

위험 명령은 편집기 승인 창으로 돌아옵니다. 처음에는 **Allow once**를 쓰고, 같은 안전한 명령을 그 작업 동안 반복할 때만 **Allow for session**을 고려하세요. **Allow always**는 Hermes 영구 허용 목록에 기록되므로, `git status`처럼 장기적으로 안전한 명령에만 사용합니다. 승인 시간 초과나 브리지 오류는 거부로 처리됩니다.

## 브라우저 도구는 별도 준비

ACP의 브라우저 도구는 Python wheel에 포함되지 않은 `agent-browser`와 Chromium에 의존합니다. 필요할 때만 설치합니다.

```bash
hermes acp --setup-browser

# 약 400MB 다운로드를 비대화형으로 승인할 때
hermes acp --setup-browser --yes
```

이 과정은 Hermes 관리 Node.js, 필요한 npm 패키지, Playwright Chromium(또는 감지된 시스템 Chrome/Chromium)을 준비합니다. 이미 준비된 항목은 다시 실행해도 건너뛰므로 재실행해도 안전합니다.

## 장애 진단

에이전트가 IDE 목록에 없으면 `hermes`가 `PATH`에 있는지, ACP extra가 설치됐는지, Zed Registry 경로라면 `uv`가 설치됐는지 확인합니다. 서버가 즉시 종료되면 다음 순서로 좁힙니다.

```bash
hermes acp --version
hermes acp --check
hermes doctor
hermes status
hermes model
```

`hermes model`은 ACP 전용 인증이 아니라 Hermes 공통 제공자 설정을 확인하는 명령입니다. API 키·OAuth 정보는 편집기 설정이나 프로젝트 파일에 넣지 말고 Hermes의 기존 비밀 관리 경로를 사용하세요.

## 공식 원문

- [ACP Editor Integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp)

_공식 문서 확인일: 2026-07-22_
