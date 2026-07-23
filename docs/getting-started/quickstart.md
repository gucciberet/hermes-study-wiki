---
sidebar_position: 1
title: "빠른 시작"
description: "Hermes Agent와의 첫 대화 — 설치부터 5분 안에 채팅까지"
---

# 빠른 시작

이 가이드는 실제 사용 환경에서도 견딜 수 있는, 동작하는 Hermes 환경을 처음부터 구축하도록 안내합니다. 설치하고, provider(공급자)를 선택하고, 채팅이 정상 동작하는지 확인하고, 문제가 생겼을 때 정확히 무엇을 해야 하는지 알게 됩니다.

## 영상으로 보고 싶으신가요?

**Onchain AI Garage**에서 설치, 설정, 기본 명령어를 다루는 Masterclass 워크스루를 제작했습니다 — 영상을 따라가며 진행하는 것을 선호한다면 이 페이지의 좋은 동반 자료입니다. 더 많은 내용은 전체 [Hermes Agent 튜토리얼 및 사용 사례](https://www.youtube.com/playlist?list=PLmpUb_PWAkDxewld5ZYyKifuHxgIbiq2d) 재생목록을 참조하세요.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', marginBottom: '1.5rem'}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube-nocookie.com/embed/R3YOGfTBcQg"
    title="Hermes Agent Masterclass: Installation, Setup, Basic Commands"
    frameBorder="0"
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>

## 이 가이드는 누구를 위한 것인가

- 완전히 처음이며 동작하는 환경까지 가장 짧은 경로를 원하는 분
- provider를 전환하는 중이며 설정 실수로 시간을 낭비하고 싶지 않은 분
- 팀, 봇 또는 상시 실행 워크플로를 위해 Hermes를 설정하는 분
- "설치는 됐는데 아무것도 안 된다"에 지친 분

## 가장 빠른 경로

목표에 맞는 행을 선택하세요:

| 목표 | 먼저 이것부터 | 그다음 이것을 |
|---|---|---|
| 그냥 내 컴퓨터에서 Hermes가 동작하기만 하면 됨 | `hermes setup` | 실제 채팅을 실행해 응답하는지 확인 |
| 사용할 provider를 이미 알고 있음 | `hermes model` | 설정을 저장한 뒤 채팅 시작 |
| 봇이나 상시 실행 환경을 원함 | CLI가 동작한 후 `hermes gateway setup` | Telegram, Discord, Slack 또는 다른 플랫폼 연결 |
| 로컬 또는 자체 호스팅 모델을 원함 | `hermes model` → 커스텀 endpoint | endpoint, 모델 이름, 컨텍스트 길이 확인 |
| 다중 provider 폴백을 원함 | 먼저 `hermes model` | 기본 채팅이 동작한 후에만 라우팅과 폴백 추가 |

**경험 법칙:** Hermes가 정상적인 채팅을 완료하지 못한다면, 아직 더 많은 기능을 추가하지 마세요. 먼저 깔끔한 대화 하나가 동작하게 만든 다음, gateway, cron, skills, 음성 또는 라우팅을 얹으세요.

---

## 1. Hermes Agent 설치
### macOS 또는 Windows에서 Hermes Desktop 설치 프로그램 사용 (권장)
명령줄 및 데스크톱 애플리케이션을 손쉽게 설치하려면, 저희 웹사이트에서 [Hermes Desktop 설치 프로그램을 다운로드](https://hermes-agent.nousresearch.com/)하여 실행하세요.

### Hermes Desktop 없이:
Hermes Desktop 없이 명령줄만 설치하려면, 다음을 실행하세요:

#### Linux / macOS / WSL2 / Android (Termux)
```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

#### Windows (native)

powershell에서 실행:
```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1) 
```

:::tip Android / Termux
휴대폰에 설치하는 경우, 테스트된 수동 설치 경로, 지원되는 추가 기능, 현재 Android 특유의 제한 사항은 전용 [Termux 가이드](./termux.md)를 참조하세요.
:::

완료된 후, shell을 다시 로드하세요:

```bash
source ~/.bashrc   # 또는 source ~/.zshrc
```

자세한 설치 옵션, 사전 요구 사항, 문제 해결은 [설치 가이드](./installation.md)를 참조하세요.

## 2. Provider 선택

가장 중요한 단일 설정 단계입니다. `hermes model`을 사용하여 대화형으로 선택 과정을 진행하세요:

```bash
hermes model
```

:::tip 가장 쉬운 경로: Nous Portal
하나의 구독으로 300개 이상의 모델과 [Tool Gateway](../user-guide/features/tool-gateway.md)(웹 검색, 이미지 생성, TTS, 클라우드 브라우저)를 모두 사용할 수 있습니다. 새로 설치한 경우:

```bash
hermes setup --portal
```

이 한 번의 명령으로 로그인하고, Nous를 provider로 설정하며, Tool Gateway를 켭니다.
:::

:::info 설정 모드
새로 설치한 경우, `hermes setup`은 세 가지 모드를 제공합니다:

- **Quick Setup (Nous Portal)** — 무료 OAuth 로그인, API 키 불필요; 모델과 Tool Gateway 도구를 설정합니다. 권장하는 빠른 경로입니다.
- **Full Setup** — 모든 provider, 도구, 옵션을 직접 하나씩 진행합니다(본인의 키를 준비하세요).
- **Blank Slate** — 에이전트를 실행하는 데 필요한 최소한을 제외하고 모든 것이 **꺼진** 상태로 시작합니다: **provider 및 모델, File Operations 툴셋, Terminal 툴셋**. 웹, 브라우저, 코드 실행, 비전, 메모리, 위임, cron, skills, 플러그인, MCP 서버는 없으며 — 압축, 체크포인트, 스마트 라우팅, 메모리 캡처도 모두 비활성화됩니다. 최소 기준선이 적용된 후, 두 가지 경로 중 하나를 선택합니다: **모든 것을 비활성화한 채로 시작**(지금 최소 에이전트로 마무리), 또는 **모든 구성을 하나씩 진행**(도구, skills, 플러그인, MCP, 메시징을 선택적으로 활성화). 최소한으로 완전히 통제되는 에이전트를 원하고 정확히 필요한 것만 활성화할 생각일 때 이것을 선택하세요.

Blank Slate는 명시적인 `platform_toolsets.cli` 목록과 `agent.disabled_toolsets`를 기록하므로, 선택하지 않은 것은 절대 로드되지 않습니다 — `hermes update` 이후에도 마찬가지입니다. 나중에 `hermes tools`로 무엇이든 다시 활성화하거나, `hermes skills opt-in --sync`로 skills를 시드하거나, `hermes setup agent`로 설정을 조정하세요.
:::

좋은 기본값:

| Provider | 설명 | 설정 방법 |
|----------|-----------|---------------|
| **Nous Portal** | 구독 기반, 설정 불필요 | `hermes model`을 통한 OAuth 로그인 |
| **OpenAI Codex** | ChatGPT OAuth, Codex 모델 사용 | `hermes model`을 통한 디바이스 코드 인증 |
| **Anthropic** | Claude 모델 직접 사용 — Max 요금제 + 추가 사용 크레딧(OAuth), 또는 토큰당 과금용 API 키 | `hermes model` → OAuth 로그인(Max + 추가 크레딧 필요), 또는 Anthropic API 키 |
| **OpenRouter** | 여러 모델에 걸친 다중 provider 라우팅 | API 키 입력 |
| **Fireworks AI** | OpenAI 호환 모델 API 직접 사용 | `FIREWORKS_API_KEY` 설정 |
| **Z.AI** | GLM / Zhipu 호스팅 모델 | `GLM_API_KEY` / `ZAI_API_KEY` 설정(`Z_AI_API_KEY`도 허용) |
| **Kimi / Moonshot** | Moonshot 호스팅 코딩 및 채팅 모델 | `KIMI_API_KEY` 설정(또는 Kimi-Coding 전용 `KIMI_CODING_API_KEY`) |
| **Kimi / Moonshot China** | 중국 지역 Moonshot endpoint | `KIMI_CN_API_KEY` 설정 |
| **Arcee AI** | Trinity 모델 | `ARCEEAI_API_KEY` 설정 |
| **GMI Cloud** | 다중 모델 직접 API | `GMI_API_KEY` 설정 |
| **MiniMax (OAuth)** | 브라우저 OAuth를 통한 MiniMax 프런티어 모델 — API 키 불필요(`hermes_cli/models.py`의 모델 이름은 릴리스마다 변경될 수 있음) | `hermes model` → MiniMax (OAuth) |
| **MiniMax** | 국제 MiniMax endpoint | `MINIMAX_API_KEY` 설정 |
| **MiniMax China** | 중국 지역 MiniMax endpoint | `MINIMAX_CN_API_KEY` 설정 |
| **Alibaba Cloud** | DashScope를 통한 Qwen 모델 | `DASHSCOPE_API_KEY` 설정(Qwen Coding Plan은 `ALIBABA_CODING_PLAN_API_KEY`도 허용) |
| **Hugging Face** | 통합 라우터를 통한 20개 이상의 오픈 모델(Qwen, DeepSeek, Kimi 등) | `HF_TOKEN` 설정 |
| **AWS Bedrock** | 네이티브 Converse API를 통한 Claude, Nova, Llama, DeepSeek | IAM 역할 또는 `aws configure`([가이드](../guides/aws-bedrock.md)) |
| **Azure Foundry** | Azure AI Foundry 호스팅 모델 | `AZURE_FOUNDRY_API_KEY` + `AZURE_FOUNDRY_BASE_URL` 설정 |
| **Google AI Studio** | 직접 API를 통한 Gemini 모델 | `GOOGLE_API_KEY` / `GEMINI_API_KEY` 설정 |
| **xAI** | 직접 API를 통한 Grok 모델 | `XAI_API_KEY` 설정 |
| **xAI Grok OAuth** | SuperGrok / Premium+ 구독, API 키 불필요 | `hermes model` → xAI Grok OAuth |
| **NovitaAI** | 다중 모델 API gateway | `NOVITA_API_KEY` 설정 |
| **StepFun** | Step Plan 모델 | `STEPFUN_API_KEY` 설정 |
| **Xiaomi MiMo** | Xiaomi 호스팅 모델 | `XIAOMI_API_KEY` 설정 |
| **Tencent TokenHub** | Tencent 호스팅 모델 | `TOKENHUB_API_KEY` 설정 |
| **Ollama Cloud** | 관리형 Ollama 호스팅 모델 | `OLLAMA_API_KEY` 설정 |
| **LM Studio** | OpenAI 호환 API를 노출하는 로컬 데스크톱 앱 | `LM_API_KEY` 설정(기본값이 아니면 `LM_BASE_URL`도) |
| **Qwen OAuth** | Qwen Portal 브라우저 OAuth — API 키 불필요 | `hermes model` → Qwen OAuth |
| **Kilo Code** | KiloCode 호스팅 모델 | `KILOCODE_API_KEY` 설정 |
| **OpenCode Zen** | 엄선된 모델에 대한 종량제 액세스 | `OPENCODE_ZEN_API_KEY` 설정 |
| **OpenCode Go** | 오픈 모델을 위한 월 $10 구독 | `OPENCODE_GO_API_KEY` 설정 |
| **DeepSeek** | DeepSeek API 직접 액세스 | `DEEPSEEK_API_KEY` 설정 |
| **NVIDIA NIM** | build.nvidia.com 또는 로컬 NIM을 통한 Nemotron 모델 | `NVIDIA_API_KEY` 설정(선택: `NVIDIA_BASE_URL`) |
| **GitHub Copilot** | GitHub Copilot 구독(GPT-5.x, Claude, Gemini 등) | `hermes model`을 통한 OAuth, 또는 `COPILOT_GITHUB_TOKEN` / `GH_TOKEN` |
| **GitHub Copilot ACP** | Copilot ACP 에이전트 백엔드(로컬 `copilot` CLI 실행) | `hermes model`(`copilot` CLI + `copilot login` 필요) |
| **Custom Endpoint** | VLLM, SGLang, Ollama 또는 모든 OpenAI 호환 API | base URL + API 키 설정 |

대부분의 처음 사용자에게: provider를 선택하고, 변경해야 하는 이유를 알지 못한다면 기본값을 그대로 받아들이세요. 환경 변수와 설정 단계가 포함된 전체 provider 카탈로그는 [Providers](../integrations/providers.md) 페이지에 있습니다.

:::caution 최소 컨텍스트: 64K 토큰
Hermes Agent는 최소 **64,000 토큰**의 컨텍스트를 가진 모델을 필요로 합니다. 더 작은 윈도우를 가진 모델은 다단계 도구 호출 워크플로에 필요한 작업 메모리를 충분히 유지하지 못하며 시작 시 거부됩니다. 대부분의 호스팅 모델(Claude, GPT, Gemini, Qwen, DeepSeek)은 이를 쉽게 충족합니다. 로컬 모델을 실행하는 경우, 컨텍스트 크기를 최소 64K로 설정하세요(예: llama.cpp의 경우 `--ctx-size 65536`, Ollama의 경우 `-c 65536`).
:::

:::tip
`hermes model`로 언제든지 provider를 전환할 수 있습니다 — 락인 없음. 지원되는 모든 provider의 전체 목록과 설정 세부 정보는 [AI Providers](../integrations/providers.md)를 참조하세요.
:::

### 설정이 저장되는 방식

Hermes는 비밀 정보를 일반 설정과 분리합니다:

- **비밀 정보 및 토큰** → `~/.hermes/.env`
- **비밀이 아닌 설정** → `~/.hermes/config.yaml`

값을 올바르게 설정하는 가장 쉬운 방법은 CLI를 통하는 것입니다:

```bash
hermes config set model anthropic/claude-opus-4.6
hermes config set terminal.backend docker
hermes config set OPENROUTER_API_KEY sk-or-...
```

올바른 값이 올바른 파일로 자동으로 들어갑니다.

## 3. 첫 채팅 실행

```bash
hermes            # 클래식 CLI
hermes --tui      # 최신 TUI (권장)
```

모델, 사용 가능한 도구, skills가 표시된 환영 배너를 보게 됩니다. 구체적이고 검증하기 쉬운 prompt(프롬프트)를 사용하세요:

:::tip 인터페이스 선택
Hermes는 두 가지 터미널 인터페이스를 제공합니다: 클래식 `prompt_toolkit` CLI와, 모달 오버레이·마우스 선택·논블로킹 입력을 갖춘 최신 [TUI](../user-guide/tui.md). 둘은 동일한 세션, 슬래시 명령어, 설정을 공유합니다 — `hermes`와 `hermes --tui`로 각각 사용해 보세요.
:::

```
Summarize this repo in 5 bullets and tell me what the main entrypoint is.
```

```
Check my current directory and tell me what looks like the main project file.
```

```
Help me set up a clean GitHub PR workflow for this codebase.
```

**성공은 이렇게 보입니다:**

- 배너에 선택한 모델/provider가 표시됨
- Hermes가 오류 없이 응답함
- 필요하면 도구를 사용할 수 있음(터미널, 파일 읽기, 웹 검색)
- 대화가 한 턴 이상 정상적으로 이어짐

이것이 동작하면, 가장 어려운 부분은 넘긴 것입니다.

## 4. 세션 동작 확인

넘어가기 전에, 재개(resume)가 동작하는지 확인하세요:

```bash
hermes --continue    # 가장 최근 세션 재개
hermes -c            # 짧은 형식
```

방금 진행한 세션으로 돌아가야 합니다. 그렇지 않다면, 같은 profile에 있는지, 세션이 실제로 저장되었는지 확인하세요. 이는 나중에 여러 설정이나 여러 머신을 다룰 때 중요합니다.

## 5. 주요 기능 사용해 보기

### 터미널 사용

```
❯ What's my disk usage? Show the top 5 largest directories.
```

에이전트가 사용자를 대신하여 터미널 명령을 실행하고 결과를 보여줍니다.

### 슬래시 명령어

`/`를 입력하면 모든 명령어의 자동 완성 드롭다운이 표시됩니다:

| 명령어 | 기능 |
|---------|-------------|
| `/help` | 사용 가능한 모든 명령어 표시 |
| `/tools` | 사용 가능한 도구 목록 표시 |
| `/model` | 대화형으로 모델 전환 |
| `/personality pirate` | 재미있는 personality 사용해 보기 |
| `/save` | 대화 저장 |

### 여러 줄 입력

`Alt+Enter`, `Ctrl+J` 또는 `Shift+Enter`를 눌러 새 줄을 추가합니다. `Shift+Enter`는 이를 고유한 시퀀스로 전송하는 터미널을 필요로 합니다(기본적으로 Kitty / foot / WezTerm / Ghostty; iTerm2 / Alacritty / VS Code 터미널은 Kitty 키보드 프로토콜을 활성화한 경우). `Alt+Enter`와 `Ctrl+J`는 모든 터미널에서 동작합니다.

### 에이전트 중단

에이전트가 너무 오래 걸리면, 새 메시지를 입력하고 Enter를 누르세요 — 현재 작업을 중단하고 새 지시로 전환합니다. `Ctrl+C`도 동작합니다.

## 6. 다음 계층 추가

기본 채팅이 동작한 후에만 진행하세요. 필요한 것을 선택하세요:

### 봇 또는 공유 어시스턴트

```bash
hermes gateway setup    # 대화형 플랫폼 구성
```

[Telegram](/user-guide/messaging/telegram), [Discord](/user-guide/messaging/discord), [Slack](/user-guide/messaging/slack), [WhatsApp](/user-guide/messaging/whatsapp), [Signal](/user-guide/messaging/signal), [Email](/user-guide/messaging/email) 또는 [Home Assistant](/user-guide/messaging/homeassistant), 또는 [Microsoft Teams](/user-guide/messaging/teams)를 연결하세요.

### 자동화 및 도구

- `hermes tools` — 플랫폼별 도구 액세스 조정
- `hermes skills` — 재사용 가능한 워크플로 탐색 및 설치
- Cron — 봇이나 CLI 설정이 안정된 후에만

### 샌드박스 터미널

안전을 위해, 에이전트를 Docker 컨테이너나 원격 서버에서 실행하세요:

```bash
hermes config set terminal.backend docker    # Docker 격리
hermes config set terminal.backend ssh       # 원격 서버
```

### 음성 모드

```bash
# Hermes 설치 디렉터리에서 실행합니다(curl 설치 프로그램은 이를 Linux/macOS에서는
# ~/.hermes/hermes-agent에, Windows에서는 %LOCALAPPDATA%\hermes\hermes-agent에 배치합니다):
cd ~/.hermes/hermes-agent
uv pip install -e ".[voice]"
# 무료 로컬 음성-텍스트 변환을 위한 faster-whisper 포함
```

그런 다음 CLI에서: `/voice on`. 녹음하려면 `Ctrl+B`를 누르세요. [음성 모드](../user-guide/features/voice-mode.md)를 참조하세요.

### Skills

Skills는 Hermes에게 특정 작업을 수행하는 방법을 가르치는 온디맨드 지침 문서입니다 — Kubernetes에 배포하기, GitHub PR 열기, 모델 파인튜닝하기, GIF 검색하기. 각각은 이름, 설명, 단계별 절차를 담은 `SKILL.md` 파일입니다. 에이전트는 짧은 설명을 무료로 읽고, 작업이 실제로 필요로 할 때만 skill의 전체 내용을 로드하므로, skills를 추가해도 모든 요청이 비대해지지 않습니다.

Hermes에는 이미 `~/.hermes/skills/`에 설치된 번들 skills 카탈로그가 함께 제공됩니다. Skills Hub에서 더 추가하거나, 직접 작성할 수 있습니다.

**허브에서 탐색 및 설치:**

```bash
hermes skills browse                      # 사용 가능한 모든 것 나열
hermes skills search kubernetes           # 키워드로 skills 찾기
hermes skills install openai/skills/k8s   # 하나 설치(먼저 보안 스캔 실행)
```

install 인자는 허브의 `source/path` 슬러그입니다 — `openai/skills/k8s`는 OpenAI 카탈로그의 `k8s` skill을 의미합니다. `hermes skills browse`는 사용할 정확한 슬러그를 보여줍니다.

**skill 사용** — 설치된 모든 skill은 자동으로 슬래시 명령어가 됩니다:

```bash
/k8s deploy the staging manifest          # 요청과 함께 skill 실행
/k8s                                       # 로드한 뒤 Hermes가 무엇이 필요한지 묻게 함
```

이는 CLI와 연결된 모든 메시징 플랫폼에서 동작합니다. 모든 것을 미리 설치할 필요는 없습니다 — 에이전트는 일반 대화 중 작업이 일치할 때 알맞은 번들 skill을 스스로 선택합니다.

직접 작성하기, 외부 skill 디렉터리, 전체 허브 소스 목록은 [Skills 시스템](../user-guide/features/skills.md)을 참조하세요.

### MCP 서버

```yaml
# ~/.hermes/config.yaml에 추가
mcp_servers:
  github:
    command: npx
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_xxx"
```

### 에디터 통합 (ACP)

ACP 지원은 표준 `[all]` 추가 기능에 포함되어 제공되므로, curl 설치 프로그램에 이미 포함되어 있습니다. 다음만 실행하세요:

```bash
hermes acp
```

(`[all]` 없이 설치했다면, 먼저 `cd ~/.hermes/hermes-agent && uv pip install -e ".[acp]"`를 실행하세요.)

[ACP 에디터 통합](../user-guide/features/acp.md)을 참조하세요.

---

## 흔한 실패 모드

다음은 시간을 가장 많이 낭비하게 하는 문제들입니다:

| 증상 | 유력한 원인 | 해결 |
|---|---|---|
| Hermes가 열리지만 빈 응답이나 깨진 응답을 줌 | provider 인증 또는 모델 선택이 잘못됨 | `hermes model`을 다시 실행하고 provider, 모델, 인증 확인 |
| 커스텀 endpoint가 "동작"하지만 쓰레기 값을 반환함 | 잘못된 base URL, 모델 이름, 또는 실제로 OpenAI 호환이 아님 | 먼저 별도의 클라이언트에서 endpoint 확인 |
| Gateway가 시작되지만 아무도 메시지를 보낼 수 없음 | 봇 토큰, 허용 목록, 또는 플랫폼 설정이 불완전함 | `hermes gateway setup`을 다시 실행하고 `hermes gateway status` 확인 |
| `hermes --continue`가 이전 세션을 찾지 못함 | profile을 전환했거나 세션이 저장된 적 없음 | `hermes sessions list`를 확인하고 올바른 profile에 있는지 확인 |
| 모델을 사용할 수 없거나 이상한 폴백 동작 | provider 라우팅 또는 폴백 설정이 너무 공격적임 | 기본 provider가 안정될 때까지 라우팅을 꺼 두기 |
| `hermes doctor`가 설정 문제를 표시함 | 설정 값이 누락되었거나 오래됨 | 설정을 수정하고, 기능을 추가하기 전에 일반 채팅을 다시 테스트 |

## 복구 툴킷

무언가 잘못된 것 같을 때는, 다음 순서를 사용하세요:

1. `hermes doctor`
2. `hermes model`
3. `hermes setup`
4. `hermes sessions list`
5. `hermes --continue`
6. `hermes gateway status`

이 순서는 "뭔가 고장 난 느낌"에서 알려진 정상 상태로 빠르게 되돌려 줍니다.

---

## 빠른 참조

| 명령어 | 설명 |
|---------|-------------|
| `hermes` | 채팅 시작 |
| `hermes model` | LLM provider와 모델 선택 |
| `hermes tools` | 플랫폼별로 활성화할 도구 구성 |
| `hermes setup` | 전체 설정 마법사(모든 것을 한 번에 구성) |
| `hermes doctor` | 문제 진단 |
| `hermes update` | 최신 버전으로 업데이트 |
| `hermes gateway` | 메시징 gateway 시작 |
| `hermes --continue` | 마지막 세션 재개 |

## 다음 단계

- **[CLI 가이드](../user-guide/cli.md)** — 터미널 인터페이스 마스터하기
- **[설정](../user-guide/configuration.md)** — 환경 사용자화하기
- **[메시징 Gateway](../user-guide/messaging/index.md)** — Telegram, Discord, Slack, WhatsApp, Signal, Email, Home Assistant, Teams 등 연결
- **[도구 및 툴셋](../user-guide/features/tools.md)** — 사용 가능한 기능 탐색
- **[AI Providers](../integrations/providers.md)** — 전체 provider 목록과 설정 세부 정보
- **[Skills 시스템](../user-guide/features/skills.md)** — 재사용 가능한 워크플로와 지식
- **[팁 및 모범 사례](../guides/tips.md)** — 파워 유저 팁
