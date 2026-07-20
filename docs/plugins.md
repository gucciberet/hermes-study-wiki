---
title: 플러그인 확장과 승인 관리
---

# 플러그인 확장과 승인 관리

플러그인은 Hermes 코어를 수정하지 않고 도구, 훅, 슬래시 명령, CLI 하위 명령을 추가하는 확장 방식입니다. 팀 전용 API나 반복 업무용 도구를 붙일 때 유용하지만, 플러그인 코드는 Hermes 프로세스에서 실행될 수 있으므로 설치와 활성화를 별도 승인 단계로 다뤄야 합니다.

## 플러그인과 MCP의 선택

- **플러그인**: Python으로 Hermes 내부의 도구·훅·명령을 직접 만들고 싶을 때
- **MCP**: 이미 존재하는 외부 도구 서버를 연결하고 싶을 때
- **쉘 훅·설정형 제공자**: 기존 CLI를 특정 이벤트나 미디어 처리에 연결할 때

새로운 일반 도구를 만들려면 대체로 플러그인이 맞고, 외부 서비스가 MCP 서버를 제공한다면 MCP가 더 단순할 수 있습니다.

## 기본 구조

사용자 플러그인은 보통 `~/.hermes/plugins/` 아래의 한 디렉터리입니다.

```text
~/.hermes/plugins/hello-world/
├── plugin.yaml  # 이름·버전·설명
├── __init__.py  # register(ctx)에서 도구·훅을 등록
├── schemas.py   # 모델에 보여 줄 도구 스키마
└── tools.py     # 실제 처리 코드
```

가장 작은 manifest는 다음과 같습니다.

```yaml
name: hello-world
version: "1.0"
description: "팀용 인사 도구"
```

`register(ctx)` 안에서는 `ctx.register_tool(...)`로 모델이 호출할 도구를, `ctx.register_hook(...)`로 lifecycle hook을 등록합니다. 스키마에는 입력 형식과 부작용을 명확히 쓰고, handler에서는 외부 입력을 검증하세요.

## 발견과 활성화는 다릅니다

일반 사용자 플러그인은 발견되더라도 기본으로 실행되지 않습니다. `plugins.enabled` 허용 목록에 들어가야 다음 세션에서 로드됩니다.

```yaml
plugins:
  enabled:
    - team-tools
  disabled:
    - retired-tool
```

```bash
# 상태 확인 또는 대화형 전환
hermes plugins

# 명시적으로 활성화·비활성화
hermes plugins enable team-tools
hermes plugins disable team-tools
```

`disabled`는 `enabled`보다 우선합니다. 설치 뒤 자동으로 켜지지 않는 것이 정상이며, 소스·의존성·권한을 검토한 뒤 활성화하세요.

## 설치·업데이트 운영 절차

```bash
# Git 소스에서 설치한 뒤 활성화 여부를 직접 확인
hermes plugins install owner/repository

# 설치된 플러그인 업데이트
hermes plugins update team-tools

# 제거
hermes plugins remove team-tools
```

프로젝트 내부 `./.hermes/plugins/`는 기본적으로 꺼져 있습니다. 신뢰하는 저장소에서만 `HERMES_ENABLE_PROJECT_PLUGINS=true`를 설정해 활성화하세요. 이름이 같으면 뒤에서 발견된 소스가 앞의 소스를 덮어쓸 수 있으므로, 운영 플러그인은 고유한 이름과 버전을 사용합니다.

## 운영 주의사항

- 플러그인은 새로운 실행 권한과 데이터 경로를 만들 수 있습니다. 최소 권한 도구부터 공개하세요.
- `pre_tool_call` 같은 훅은 모든 도구 호출에 영향을 줄 수 있으므로 성능·오류 처리·감사를 고려합니다.
- 플러그인 업데이트는 테스트 프로필에서 먼저 실행하고, 활성 플러그인 목록을 변경 이력에 남깁니다.
- API 키나 토큰은 manifest·소스·Git에 넣지 말고 별도 비밀값 관리 경로를 사용합니다.

## 공식 원문

- [Plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins)
- [Build a Hermes Plugin](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins)

_공식 문서 확인일: 2026-07-21_
