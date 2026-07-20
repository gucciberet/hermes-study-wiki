---
title: MCP 서버를 안전하게 연결하기
---

# MCP 서버를 안전하게 연결하기

MCP(Model Context Protocol)는 Hermes가 외부 도구 서버의 기능을 발견해 사용하는 표준 연결 방식입니다. 파일시스템, GitHub, 데이터베이스, 사내 API처럼 이미 MCP 서버로 제공되는 기능을 Python 플러그인 없이 연동할 수 있습니다.

MCP 서버는 결국 별도 코드 또는 원격 서비스입니다. 연결 전에는 서버의 제작자, 실행 명령, 파일·네트워크·자격증명 접근 범위를 확인하세요.

## 가장 작은 stdio 연결

MCP 지원은 표준 Hermes 설치에 포함되어 있습니다. `~/.hermes/config.yaml`의 `mcp_servers`에 서버를 추가합니다.

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/absolute/path/to/project"
    tools:
      include: ["list_directory", "read_file"]
      resources: false
      prompts: false
```

```bash
hermes chat
```

시작 시 Hermes가 서버에 연결해 도구를 발견하고 등록합니다. 이 예시는 필요한 읽기 도구만 허용하는 방식입니다. 실제 도구 이름은 서버가 제공하는 원래 MCP 이름을 기준으로 확인하세요.

## HTTP 서버도 같은 위치에 설정

원격 MCP는 `command` 대신 `url`을 사용합니다. `headers`에 필요한 인증 정보가 있다면 실제 값은 파일·환경 설정 등 비밀 관리 경로에 두고 Git이나 문서 예시에 기록하지 마세요.

```yaml
mcp_servers:
  internal-docs:
    url: "https://mcp.example.internal/mcp"
    enabled: true
    connect_timeout: 60
    timeout: 300
    tools:
      include: ["search_docs"]
      resources: false
      prompts: false
```

TLS 검증은 기본적으로 켜져 있습니다. `ssl_verify: false`는 서버 인증서 검증을 끄므로 실제 서비스에 사용하지 마세요. HTTP 서버가 OAuth를 지원하면 `auth: oauth`로 OAuth 2.1 PKCE 흐름을 사용할 수 있습니다.

## 도구 허용 목록을 기본값으로

`tools.include`를 설정하면 해당 서버의 **원래 MCP 도구 이름**만 등록됩니다. `include`와 `exclude`를 함께 쓰면 include가 우선합니다.

```yaml
mcp_servers:
  issue-tracker:
    command: "mcp-issue-server"
    args: []
    tools:
      include: ["list_issues", "create_issue"]
      resources: false
      prompts: false
```

도구가 Hermes에 등록될 때 이름은 `mcp_<server>_<tool>` 형태가 됩니다. 서버 이름이나 도구 이름의 하이픈·점은 밑줄로 바뀝니다. 그러나 `include`와 `exclude`에는 변환 전의 원래 이름을 써야 합니다.

## 적용 확인과 장애 격리

설정을 바꾼 뒤 대화 안에서 다음 명령으로 MCP를 다시 읽을 수 있습니다.

```text
/reload-mcp
```

문제가 있는 서버를 즉시 중단해야 한다면 연결 설정을 지우기보다 다음처럼 비활성화해 두고 원인을 조사할 수 있습니다.

```yaml
mcp_servers:
  legacy-service:
    url: "https://mcp.example.internal/mcp"
    enabled: false
```

`enabled: false`면 Hermes는 연결·도구 발견·도구 등록을 모두 건너뜁니다. 필터링 결과 등록할 도구가 하나도 없으면 빈 MCP toolset도 만들지 않습니다.

## 운영 점검표

- 서버를 실행하는 명령과 의존성은 신뢰·검토되었는가?
- 처음에는 읽기 전용 또는 명시적 allowlist만 열었는가?
- 삭제·결제·배포 같은 변경 도구는 승인 정책과 함께 검토했는가?
- 연결 실패는 서버 단위로 격리되고, 필요하면 `enabled: false`로 되돌릴 수 있는가?

## 공식 원문

- [MCP (Model Context Protocol)](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)
- [MCP Config Reference](https://hermes-agent.nousresearch.com/docs/reference/mcp-config-reference)

_공식 문서 확인일: 2026-07-21_
