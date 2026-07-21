---
title: 웹 Dashboard 확장과 플러그인
---

# 웹 Dashboard 확장과 플러그인

`hermes dashboard` 웹 Dashboard는 소스를 포크하지 않고 테마와 플러그인으로 확장할 수 있습니다. 운영 화면의 색·글꼴을 바꾸는 수준부터, 새 탭·기존 페이지 위젯·FastAPI 백엔드 경로를 추가하는 수준까지 런타임에 적용됩니다.

이 문서는 **웹 Dashboard** 확장을 다룹니다. 네이티브 Desktop 앱의 SDK는 별도 체계이므로, 웹 Dashboard용 `manifest.json`과 Desktop용 플러그인 파일을 혼용하지 마세요.

## 어떤 확장 방식을 쓸지

| 목표 | 방식 | 위치 |
| --- | --- | --- |
| 색·글꼴·간격만 바꾸기 | YAML 테마 | `~/.hermes/dashboard-themes/` |
| 새 화면 탭 추가 | Dashboard UI 플러그인 | `~/.hermes/plugins/<이름>/dashboard/` |
| Sessions·Logs 같은 기존 화면에 카드 추가 | 페이지 슬롯(slot) | UI 플러그인 내부 `registerSlot()` |
| Dashboard가 읽을 전용 데이터 제공 | Backend 플러그인 | `dashboard/plugin_api.py` |

테마·UI 플러그인·백엔드 플러그인은 독립적으로 사용할 수 있습니다. Dashboard 소스 수정이나 `npm run build`는 필요하지 않습니다.

## 작은 테마부터 적용하기

Dashboard는 `~/.hermes/dashboard-themes/`의 YAML 파일을 읽습니다. 누락한 키는 기본 테마 값으로 채워지므로, 처음에는 색만 지정해도 됩니다.

```bash
mkdir -p ~/.hermes/dashboard-themes
```

```yaml
# ~/.hermes/dashboard-themes/team-dark.yaml
name: team-dark
label: Team Dark
description: 팀 운영용 어두운 테마

palette:
  background: "#101827"
  midground: "#d8f0ff"
  foreground: "#ffffff"

layout:
  radius: "0.5rem"
  density: comfortable
```

Dashboard를 새로고침한 뒤 헤더의 팔레트 선택기에서 테마를 고릅니다. 선택 값은 `config.yaml`의 `dashboard.theme`에 저장됩니다. `palette`의 세 레이어는 카드·테두리·포커스 링 등 파생 색상에도 연쇄 적용됩니다.

## Dashboard 플러그인의 최소 구조

하나의 Hermes 플러그인은 CLI/gateway 확장과 Dashboard 확장을 함께 가질 수 있습니다. Dashboard UI만 필요하다면 다음 구조면 충분합니다.

```text
~/.hermes/plugins/team-status/
└── dashboard/
    ├── manifest.json       # 필수: 탭과 진입점 정의
    └── dist/
        └── index.js        # 필수: 로드 가능한 단일 JS 번들
```

`manifest.json`은 고유한 소문자 이름과 탭 경로를 정의합니다.

```json
{
  "name": "team-status",
  "label": "팀 상태",
  "description": "운영 현황 탭",
  "icon": "Activity",
  "tab": {
    "path": "/team-status",
    "position": "after:skills"
  },
  "entry": "dist/index.js"
}
```

JavaScript는 Dashboard가 제공하는 SDK를 통해 등록합니다. React를 번들에 직접 넣지 않고 `window.__HERMES_PLUGIN_SDK__`가 제공하는 React와 컴포넌트를 사용합니다. 최종 파일은 `<script>`로 불러올 수 있는 단일 JS 파일이어야 하며, IIFE 형태가 기본 선택입니다.

```javascript
(function () {
  "use strict";
  const SDK = window.__HERMES_PLUGIN_SDK__;
  const React = SDK.React;

  function TeamStatus() {
    return React.createElement("p", null, "팀 상태 플러그인");
  }

  window.__HERMES_PLUGINS__.register("team-status", TeamStatus);
})();
```

## 기존 화면을 교체하지 말고 보강하기

기본 Sessions·Analytics·Logs·Cron·Skills·Config·Env·Docs·Chat 화면은 `<페이지>:top`, `<페이지>:bottom` 슬롯을 제공합니다. 화면 전체를 교체하는 `tab.override`보다 슬롯을 우선하면 Hermes 업데이트로 추가되는 기본 기능을 계속 유지할 수 있습니다.

```javascript
window.__HERMES_PLUGINS__.registerSlot(
  "team-status",
  "sessions:top",
  TeamStatus,
);
```

탭 없이 슬롯만 쓰는 플러그인은 manifest의 `tab.hidden: true`를 설정합니다. 같은 슬롯에 여러 플러그인이 등록되면 등록 순서대로 쌓입니다.

## 백엔드 API를 추가할 때

UI 플러그인이 Hermes 상태를 가공해 보여 줘야 한다면 플러그인 안에 FastAPI `router`를 내보내는 `plugin_api.py`를 둘 수 있습니다. 경로는 `/api/plugins/<plugin-name>/` 아래에 마운트됩니다. UI에서는 `SDK.fetchJSON()`을 사용하면 Dashboard의 인증 처리를 함께 사용합니다.

```python
# ~/.hermes/plugins/team-status/dashboard/plugin_api.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/summary")
def summary():
    return {"status": "ok"}
```

이 예시의 경로는 `GET /api/plugins/team-status/summary`가 됩니다. Dashboard 프로세스 내부에서 실행되는 Python 코드는 Hermes 내부 상태에 접근할 수 있으므로, 요청 입력 검증과 최소 권한을 일반 웹 서비스 수준으로 적용하세요.

## 탐색·재로딩과 보안

Dashboard는 사용자 플러그인, 번들 플러그인, 그리고 명시적으로 활성화한 프로젝트 플러그인을 우선순위에 따라 탐색합니다. 새 플러그인을 넣은 뒤에는 Dashboard를 재시작하거나 다음 경로로 탐색 캐시를 갱신합니다.

```bash
curl http://127.0.0.1:9119/api/dashboard/plugins/rescan
```

플러그인 백엔드 경로는 Dashboard가 기본적으로 localhost에 바인드된다는 전제를 갖습니다. 신뢰하지 않는 플러그인이 있다면 Dashboard를 `--host 0.0.0.0`으로 공개하지 마세요. 그렇게 노출하면 플러그인의 API 경로도 함께 외부에 열릴 수 있습니다.

## 운영 점검표

- 플러그인 이름·탭 경로가 다른 플러그인과 충돌하지 않는가?
- 전체 페이지 교체보다 슬롯 보강으로 해결할 수 있는가?
- UI 번들은 SDK의 React를 쓰고 React를 중복 번들하지 않는가?
- 플러그인 API가 외부 입력을 검증하고 민감한 설정·자격증명을 반환하지 않는가?
- 새 플러그인은 비운영 프로필 Dashboard에서 먼저 확인했는가?

## 공식 원문

- [Extending the Dashboard](https://hermes-agent.nousresearch.com/docs/user-guide/features/extending-the-dashboard)
- [Web Dashboard](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard)

_공식 문서 확인일: 2026-07-22_
