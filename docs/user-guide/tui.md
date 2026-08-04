---
sidebar_position: 2
title: "TUI"
description: "Hermes를 위한 현대적인 터미널 UI를 실행하세요 — 마우스 친화적이고, 풍부한 오버레이와 비차단 입력을 제공합니다."
---

# TUI

TUI는 Hermes를 위한 현대적인 프런트엔드입니다. [클래식 CLI](cli.md)와 같은 Python 런타임을 기반으로 하는 터미널 UI입니다. 동일한 에이전트, 동일한 세션, 동일한 슬래시 명령어를 더 깔끔하고 반응성 높은 환경에서 사용할 수 있습니다.

Hermes를 대화형으로 실행하는 권장 방법입니다.

## 실행

```bash
# Launch the TUI
hermes --tui

# Resume the latest TUI session (falls back to the latest classic session)
hermes --tui -c
hermes --tui --continue

# Resume a specific session by ID or title
hermes --tui -r 20260409_000000_aa11bb
hermes --tui --resume "my t0p session"

# Run source directly — skips the prebuild step (for TUI contributors)
hermes --tui --dev
```

환경 변수로도 활성화할 수 있습니다:

```bash
export HERMES_TUI=1
hermes          # now uses the TUI
hermes chat     # same
```

또는 `~/.hermes/config.yaml`에서 영구 기본값으로 설정합니다:

```yaml
display:
  interface: tui   # "cli" (default) or "tui"
```

`display.interface: tui`를 설정하면 인수 없는 `hermes`(및 `hermes chat`)가 TUI를 실행합니다. 명시적 플래그가 항상 우선합니다. 단일 호출에서 클래식 REPL로 돌아가려면 `hermes --cli`를 실행하고, 설정 기본값이 `cli`일 때 TUI를 강제하려면 `hermes --tui` 또는 `HERMES_TUI=1`을 사용하세요.

클래식 CLI는 계속해서 기본 배포값입니다. 슬래시 명령어, 빠른 명령어, 스킬 사전 로딩, 성격, 여러 줄 입력, 인터럽트를 포함해 [CLI 인터페이스](cli.md)에 문서화된 모든 기능은 TUI에서도 동일하게 작동합니다.

## TUI를 사용하는 이유

- **즉시 첫 프레임** — 앱이 로드되기 전에 배너가 그려지므로 Hermes가 시작되는 동안 터미널이 멈춘 것처럼 느껴지지 않습니다.
- **비차단 입력** — 세션이 준비되기 전에 메시지를 입력하고 대기열에 넣을 수 있습니다. 에이전트가 온라인이 되는 즉시 첫 프롬프트가 전송됩니다.
- **풍부한 오버레이** — 모델 선택기, 세션 선택기, 승인 및 명확화 프롬프트가 인라인 흐름 대신 모달 패널로 렌더링됩니다.
- **실시간 세션 패널** — 도구와 스킬이 초기화되면서 점진적으로 채워집니다.
- **마우스 친화적 선택** — SGR 반전 대신 균일한 배경으로 드래그하여 강조 표시합니다. 터미널의 일반 복사 동작으로 복사하세요.
- **대체 화면 렌더링** — 차등 업데이트로 스트리밍 중 깜빡임이 없고, 종료 후 스크롤백이 지저분해지지 않습니다.
- **작성기 편의 기능** — 긴 스니펫의 인라인 붙여넣기 접기, 클립보드 이미지 대체 기능을 갖춘 `Cmd+V` / `Ctrl+V` 텍스트 붙여넣기, 대괄호 붙여넣기 안전성, 이미지/파일 경로 첨부 정규화를 제공합니다.

동일한 [스킨](features/skins.md)과 [성격](features/personality.md)이 적용됩니다. `/skin ares`, `/personality pirate`로 세션 중간에 전환하면 UI가 즉시 다시 그려집니다. 사용자 지정 가능한 전체 키 목록과 클래식 및 TUI에 적용되는 항목은 [스킨 및 테마](features/skins.md)를 참조하세요. TUI는 배너 팔레트, UI 색상, 프롬프트 글리프/색상, 세션 표시, 완성 메뉴, 선택 배경, `tool_prefix`, `help_header`를 따릅니다.

### 접을 수 있는 배너 섹션

TUI 시작 배너는 런타임 정보를 네 개의 접을 수 있는 섹션으로 그룹화하며, 각 섹션 제목 옆에 `▸` / `▾` 셰브론이 표시됩니다:

| 섹션 | 기본 상태 |
|---------|---------------|
| 도구 | 열림 |
| 스킬 | 접힘 |
| 시스템 프롬프트 | 접힘 |
| MCP 서버 | 접힘 |

섹션 헤더의 아무 곳이나(또는 셰브론)를 클릭하여 전환하세요. 세션 시작 시 가장 자주 확인하는 섹션이므로 도구 목록은 기본으로 열려 있습니다. 수십 개의 스킬을 설치했거나 많은 MCP 서버를 연결해도 배너가 간결하게 유지되도록 스킬, 시스템 프롬프트, MCP 서버는 기본으로 접혀 있습니다. 상태는 배너 인스턴스에 로컬이므로 다음 실행에서는 기본값으로 재설정됩니다.

## 요구 사항

- **Node.js** ≥ 20 — TUI는 Python CLI가 실행하는 하위 프로세스로 작동합니다. `hermes doctor`가 이를 확인합니다.
- **TTY** — 클래식 CLI처럼 stdin을 파이핑하거나 비대화형 환경에서 실행하면 단일 쿼리 모드로 대체됩니다.

첫 실행 시 Hermes는 TUI의 Node 종속성을 `ui-tui/node_modules`에 설치합니다(한 번만, 몇 초 소요). 이후 실행은 빠릅니다. 새 Hermes 버전을 가져오면 소스가 dist보다 최신일 때 TUI 번들이 자동으로 다시 빌드됩니다.

:::tip Git 워크트리 간에 작업하시나요?
여러 워크트리에서 `hermes --tui --dev`를 실행하는 기여자는 체크아웃마다 설치하지 않고 하나의 `node_modules`를 공유할 수 있습니다. [워크트리에서 TUI 및 데스크톱 사용](../developer-guide/worktree-ui-dev.md)을 참조하세요.
:::

### 외부 사전 빌드

사전 빌드된 번들을 제공하는 배포판(Nix, 시스템 패키지)은 Hermes가 이를 가리키도록 할 수 있습니다:

```bash
export HERMES_TUI_DIR=/path/to/prebuilt/ui-tui
hermes --tui
```

디렉터리에는 `dist/entry.js`가 있어야 합니다.

## 키 바인딩

키 바인딩은 [클래식 CLI](cli.md#keybindings)와 정확히 일치합니다. 유일한 동작 차이는 다음과 같습니다:

- **마우스 드래그**는 균일한 선택 배경으로 텍스트를 강조 표시합니다.
- **`Cmd+V` / `Ctrl+V`**는 먼저 일반 텍스트 붙여넣기를 시도하고, 이후 OSC52/네이티브 클립보드 읽기로 대체하며, 마지막으로 클립보드 또는 붙여넣은 페이로드가 이미지로 해석되면 이미지를 첨부합니다.
- **`/terminal-setup`**은 macOS에서 더 나은 `Cmd+Enter` 및 실행 취소/다시 실행 일치를 위해 로컬 VS Code / Cursor / Windsurf 터미널 바인딩을 설치합니다.
- **슬래시 자동 완성**은 인라인 드롭다운이 아닌 설명이 포함된 부동 패널로 열립니다.
- **`Ctrl+X`**는 실시간 세션 전환기를 엽니다. 대기열 메시지가 강조 표시된 경우(에이전트가 아직 실행 중일 때 전송됨)에는 해당 대기열 메시지를 삭제합니다. **`Esc`**는 삭제하지 않고 편집을 취소하고 강조 표시를 해제합니다.
- **`Ctrl+G` / `Ctrl+X Ctrl+E`**는 여러 줄/긴 프롬프트 작성을 위해 현재 입력 버퍼를 `$EDITOR`에서 엽니다. 저장 후 종료하면 내용이 프롬프트로 다시 전송됩니다.

## 슬래시 명령어

모든 슬래시 명령어가 변경 없이 작동합니다. 일부는 TUI 소유이며, 더 풍부한 출력을 제공하거나 인라인 패널 대신 오버레이로 렌더링합니다:

| 명령어 | TUI 동작 |
|---------|--------------|
| `/help` | 분류된 명령어가 있는 오버레이, 화살표 키로 탐색 가능 |
| `/sessions` (별칭 `/switch`) | 실시간 세션 전환기 — 열린 TUI 세션을 나열하고, 세션 간 전환, 종료 또는 다른 세션 시작 가능 |
| `/model` | 비용 힌트와 함께 공급자별로 그룹화된 모달 모델 선택기 |
| `/skin` | 실시간 미리 보기 — 탐색하는 동안 테마 변경 적용 |
| `/details` | 자세한 도구 호출 정보 전환(전역 또는 섹션별) |
| `/usage` | 풍부한 토큰 / 비용 / 컨텍스트 패널 |
| `/agents` (별칭 `/tasks`) | 관측 가능성 오버레이 — 종료/일시 중지 제어, 분기별 비용 / 토큰 / 파일 롤업, 턴별 기록이 있는 실시간 하위 에이전트 트리 |
| `/reload` | 새로 추가한 API 키가 재시작 없이 적용되도록 실행 중인 TUI 프로세스에 `~/.hermes/.env`를 다시 읽음 |
| `/mouse [on\|off\|toggle\|wheel\|buttons\|all]` | 런타임에 마우스 추적 프리셋 선택(`config.yaml`의 `display.mouse_tracking`에도 유지). `wheel`(1000+1006)은 프롬프트 행에서 tmux가 "No image in clipboard"를 스팸하는 원인이 되는 호버 이벤트 없이 스크롤 휠 스크롤을 유지합니다. `buttons`는 드래그 선택을 추가하며, `all`은 호버 기반 UI의 기본값입니다. |

설치된 스킬, 빠른 명령어, 성격 전환을 포함한 모든 다른 슬래시 명령어는 클래식 CLI와 동일하게 작동합니다. [슬래시 명령어 참조](../reference/slash-commands.md)를 확인하세요.

## 실시간 세션 전환기

하나의 터미널이 여러 TUI 세션의 디스패처 역할을 하도록 하려면 실시간 세션 전환기를 사용하세요. 현재 이 TUI 프로세스에서 실시간인 세션만 나열합니다. 종료된 세션은 저장된 트랜스크립트로 남아 있으며 `/resume` 또는 `hermes --tui --resume <id-or-title>`로 다시 열 수 있습니다.

다음 중 하나로 엽니다:

- TUI에서 `Ctrl+X`.
- `/sessions` 또는 `/switch`.
- 즉시 새 실시간 세션을 만들려면 `/sessions new`.
- 상태 표시줄의 `N live sessions` 수를 클릭.

<img alt="하나의 실시간 세션과 +new 행이 있는 Hermes TUI 세션 오케스트레이터" src="/docs/img/docs/tui-session-orchestrator/session-orchestrator.png" />

<video controls muted loop playsInline src="/docs/img/docs/tui-session-orchestrator/session-orchestrator-demo.mp4" title="Hermes TUI 세션 오케스트레이터 데모" style={{maxWidth: '100%'}}></video>

전환기 내부에서:

- `↑` / `↓`로 선택 항목을 이동합니다. 마우스 클릭으로도 행을 선택할 수 있습니다.
- `Enter`는 선택한 실시간 세션으로 전환합니다.
- `Ctrl+D`는 선택한 실시간 세션을 닫습니다.
- `Ctrl+N`은 빈 실시간 세션을 시작합니다.
- `Ctrl+R`은 실시간 세션 목록을 새로 고칩니다.
- `Esc`는 전환기를 닫습니다.
- `+new`를 선택하고 프롬프트를 입력한 후 `Enter`를 눌러 새 실시간 세션을 디스패치합니다. 새 세션에만 사용할 모델을 선택하려면 먼저 `Tab`을 누르세요.

## LaTeX 수식 렌더링

TUI의 마크다운 파이프라인은 LaTeX 수식을 인라인으로 렌더링합니다. `$E = mc^2$` 및 `$$\frac{a}{b}$$`는 원시 TeX 소스 대신 유니코드 형식의 수식으로 렌더링됩니다. 인라인 및 블록 수식 모두에 작동하며, 지원하지 않는 구문은 복사 가능한 상태를 유지하도록 코드 범위로 감싼 리터럴 TeX를 표시하는 것으로 대체됩니다.

항상 켜져 있으므로 구성할 항목이 없습니다. 클래식 CLI는 원시 TeX를 유지합니다.

## 밝은 터미널 감지

TUI는 밝은 터미널을 자동 감지하고 그에 따라 밝은 테마로 전환합니다. 감지는 세 계층으로 작동합니다:

1. `HERMES_TUI_THEME` 환경 변수 — 최우선 순위입니다. 값: `light`, `dark` 또는 원시 6자 배경 hex(예: `ffffff`, `1a1a2e`).
2. `COLORFGBG` 환경 변수 — xterm 계열 터미널에서 사용하는 전통적인 "내 배경색은 무엇인가?" 힌트입니다.
3. OSC 11을 통한 터미널 배경 프로브 — `COLORFGBG`를 설정하지 않는 최신 터미널(Ghostty, Warp, iTerm2, WezTerm, Kitty)에서 작동합니다.

터미널과 관계없이 밝은 테마를 영구적으로 사용하려면:

```bash
export HERMES_TUI_THEME=light
```

## Busy 표시기 스타일

상태 표시줄 Busy 표시기는 플러그형입니다. 기본값은 에이전트 작업 중 2.5초마다 Hermes의 kawaii 얼굴 팔레트를 순환합니다. 구성 또는 `/indicator` 슬래시 명령어로 다른 스타일을 선택하세요:

```yaml
display:
  tui_status_indicator: kaomoji   # kaomoji | emoji | unicode | ascii
```

또는 세션 중에 `/indicator emoji`(등)를 사용합니다. 스타일은 일치하는 글리프 너비와 함께 제공되므로 순환 중에도 상태 표시줄의 나머지 부분이 흔들리지 않습니다.

## 자동 재개

기본적으로 `hermes --tui`는 매 실행 시 새 세션을 시작합니다. 최신 TUI 세션에 자동으로 다시 연결하려면(터미널 또는 SSH 연결이 예기치 않게 끊길 때 유용) 선택하여 활성화하세요:

```bash
export HERMES_TUI_RESUME=1          # most-recent TUI session
# or:
export HERMES_TUI_RESUME=<session-id>   # specific session
```

변수를 해제하거나 세션별로 `--resume <id>`를 명시적으로 전달해 재정의하세요.

## 상태 표시줄

TUI의 상태 표시줄은 에이전트 상태를 실시간으로 추적합니다:

| 상태 | 의미 |
|--------|---------|
| `starting agent…` | 세션 ID는 활성 상태이며, 도구와 스킬은 아직 온라인 전환 중입니다. 입력할 수 있으며, 메시지는 준비되면 대기열에 들어가 전송됩니다. |
| `ready` | 에이전트가 유휴 상태이며 입력을 받습니다. |
| `thinking…` / `running…` | 에이전트가 추론하거나 도구를 실행 중입니다. |
| `interrupted` | 현재 턴이 취소되었습니다. 다시 전송하려면 Enter를 누르세요. |
| `forging session…` / `resuming…` | 초기 연결 또는 `--resume` 핸드셰이크입니다. |

스킨별 상태 표시줄 색상과 임계값은 클래식 CLI와 공유됩니다. 사용자 지정은 [스킨](features/skins.md)을 참조하세요.

상태 표시줄에는 다음도 표시됩니다:

- **git 브랜치가 포함된 작업 디렉터리** — `~/projects/hermes-agent (docs/two-week-gap-sweep)`. 보조 터미널에서 `git checkout`하면(수정 시간 캐시) 브랜치 접미사가 업데이트되므로 TUI는 실행 시점의 브랜치가 아니라 실제 활성 브랜치를 반영합니다.
- **프롬프트별 경과 시간** — 턴 실행 중에는 `⏱ 12s/3m 45s`(실시간), 턴 완료 후에는 `⏲ 32s / 3m 45s`로 고정됩니다. 첫 번째 숫자는 마지막 사용자 메시지 이후 시간이고, 두 번째 숫자는 전체 세션 기간입니다. 새 프롬프트마다 재설정됩니다.
- **`🗜️ N`** — 실행 중인 세션이 자동 압축된 횟수입니다. 첫 압축이 실행되면 표시됩니다.
- **`▶ N`** — 이 세션에서 현재 실행 중인 `/background` 작업 수입니다. 하나 이상의 작업이 진행 중일 때마다 표시됩니다.
- **`⚠ YOLO`** — YOLO 모드가 켜져 있을 때마다 표시되는 경고(`hermes --yolo`, `/yolo`, 또는 `HERMES_YOLO_MODE=1`)입니다. 자동 승인 세션을 알아차리지 못한 채 실행할 수 없도록 같은 배지가 시작 배너에도 표시됩니다.

## 구성

TUI는 `~/.hermes/config.yaml`, 프로필, 성격, 스킨, 빠른 명령어, 자격 증명 풀, 메모리 공급자, 도구/스킬 활성화 등 모든 표준 Hermes 구성을 따릅니다. TUI 전용 구성 파일은 없습니다.

일부 키는 특히 TUI 환경을 조정합니다:

```yaml
display:
  skin: default              # any built-in or custom skin
  personality: helpful
  details_mode: collapsed    # hidden | collapsed | expanded — global accordion default
  sections:                  # optional: per-section overrides (any subset)
    thinking: expanded       # always open
    tools: expanded          # always open
    activity: collapsed      # opt back IN to the activity panel (hidden by default)
  mouse_tracking: all        # off | wheel | buttons | all (or true/false for back-compat).
                             #   wheel   — 1000+1006 (scroll + click; no drag, no hover —
                             #             recommended inside tmux to silence the prompt-row
                             #             "No image in clipboard" spam from hover events)
                             #   buttons — adds 1002 for terminal-side drag selection
                             #   all     — adds 1003 for hover (scrollbar paginate-on-hover,
                             #             link mouseenter, etc.)
```

런타임 전환:

- `/details [hidden|collapsed|expanded|cycle]` — 전역 모드 설정
- `/details <section> [hidden|collapsed|expanded|reset]` — 하나의 섹션 재정의
  (섹션: `thinking`, `tools`, `subagents`, `activity`)

**기본 표시 상태**

TUI는 꺾쇠표의 벽 대신 턴을 실시간 트랜스크립트로 스트리밍하도록 독자적인 섹션별 기본값을 제공합니다:

- `thinking` — **확장됨**. 모델이 내보내는 대로 추론이 인라인으로 스트리밍됩니다.
- `tools` — **확장됨**. 도구 호출과 결과가 열린 상태로 렌더링됩니다.
- `subagents` — 전역 `details_mode`를 따릅니다(기본적으로 꺾쇠표 아래 접힘 — 실제 위임이 발생할 때까지 조용히 유지됨).
- `activity` — **숨김**. 주변 메타(게이트웨이 힌트, 터미널 패리티 넛지, 백그라운드 알림)는 대부분의 일상 사용에서 잡음입니다. 도구 실패는 실패한 도구 행에 계속 인라인으로 렌더링되며, 모든 패널이 숨겨져 있을 때 주변 오류/경고는 부동 알림 백스톱을 통해 표시됩니다.

섹션별 재정의는 섹션 기본값과 전역 `details_mode`보다 우선합니다. 레이아웃을 변경하려면:

- `display.sections.thinking: collapsed` — 추론을 다시 꺾쇠표 아래에 배치
- `display.sections.tools: collapsed` — 도구 호출을 다시 꺾쇠표 아래에 배치
- `display.sections.activity: collapsed` — 활동 패널 다시 활성화
- 런타임에 `/details <section> <mode>`

`display.sections`에 명시적으로 설정된 항목은 기본값보다 우선하므로 기존 구성은 변경 없이 계속 작동합니다.

## 세션

세션은 TUI와 클래식 CLI 간에 공유됩니다. 둘 다 동일한 `~/.hermes/state.db`에 기록합니다. 한쪽에서 세션을 시작하고 다른 쪽에서 재개할 수 있습니다. 세션 선택기는 소스 태그와 함께 두 소스의 세션을 표시합니다.

수명 주기, 검색, 압축, 내보내기는 [세션](sessions.md)을 참조하세요.

## TUI가 게이트웨이와 통신하는 방식

기본적으로 TUI는 자체 프로세스 내 게이트웨이를 생성하므로 각 TUI 인스턴스는 독립적입니다. 구성할 것이 없습니다.

코드베이스나 로그에서 `HERMES_TUI_GATEWAY_URL` 환경 변수를 볼 수 있습니다. 이는 사용자 대면 원격 연결 옵션이 아닌 **웹 대시보드의 내부 연결 세부 정보**입니다. 대시보드의 "Chat" 탭(`hermes dashboard` → `/chat`)을 열면 대시보드의 웹 서버가 내장 TUI 하위 프로세스를 생성하고 `HERMES_TUI_GATEWAY_URL`을 주입하여 해당 하위 프로세스가 루프백 WebSocket(`/api/ws`)을 통해 대시보드 자체 프로세스 내 `tui_gateway`에 연결하게 합니다. `/api/ws` 엔드포인트는 대시보드 서버(`hermes_cli/web_server.py`) 내부에만 존재하며, 해당 프로세스의 수명과 인증에 바인딩됩니다.

독립형 게이트웨이 포트에 임의의 TUI를 연결하는 일반적인 모드는 없습니다. 특히 OpenAI 호환 API 서버(`hermes gateway` / `api_server` 플랫폼)는 `/api/ws`를 제공하지 않습니다. 이는 모델 백엔드 환경(`/v1/chat/completions`, `/v1/models`, …)이며, TUI의 JSON-RPC 제어 채널을 의도적으로 노출하지 않습니다. `HERMES_TUI_GATEWAY_URL`을 해당 포트로 설정하면 404가 발생합니다.

여러 환경에서 하나의 세션 집합을 공유하려면 공유 `~/.hermes/state.db`([세션](sessions.md) 참조) 또는 웹 대시보드의 내장 채팅([웹 대시보드](features/web-dashboard.md#chat) 참조)을 사용하세요. 게이트웨이 URL을 직접 설정하지 마세요.

## 클래식 CLI로 되돌리기

`hermes`를 `--tui` 없이 실행하면 기본적으로 클래식 CLI가 유지됩니다. 시스템이 TUI를 선호하도록 하려면 `~/.hermes/config.yaml`에 `display.interface: tui`를 설정하거나 셸 프로필에서 `HERMES_TUI=1`을 설정하세요. 돌아가려면 `interface: cli`를 설정하거나 환경 변수를 해제하거나, 단일 실행에는 `hermes --cli`를 전달하세요.

TUI 실행에 실패하면(Node 없음, 번들 누락, TTY 문제) Hermes는 진단 정보를 출력하고 대체 실행하므로 사용자가 막히지 않습니다.

## 함께 보기

- [CLI 인터페이스](cli.md) — 전체 슬래시 명령어 및 키 바인딩 참조(공유)
- [세션](sessions.md) — 재개, 분기, 기록
- [스킨 및 테마](features/skins.md) — 배너, 상태 표시줄, 오버레이 테마 지정
- [음성 모드](features/voice-mode.md) — 두 인터페이스 모두에서 작동
- [구성](configuration.md) — 모든 구성 키
