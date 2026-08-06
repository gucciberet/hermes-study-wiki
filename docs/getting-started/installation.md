---
sidebar_position: 2
title: "설치"
description: "Linux, macOS, WSL2, 네이티브 Windows 또는 Termux를 통한 Android에 Hermes Agent 설치"
---

# 설치

2분 안에 Hermes Agent를 설치하고 실행하세요!

:::tip 플랫폼 지원
전체 플랫폼 지원 매트릭스(지원되는 OS, 배포 방식 및 플랫폼별 제한 기능)는
**[플랫폼 지원](./platform-support.md)**을 참조하세요.
:::

## 빠른 설치
### macOS 또는 Windows에서 Hermes Desktop 설치 프로그램 사용 (권장)
명령줄 및 데스크톱 애플리케이션을 쉽게 설치하려면, 웹사이트에서 [Hermes Desktop 설치 프로그램을 다운로드](https://hermes-agent.nousresearch.com/)하여 실행하세요.

### Hermes Desktop 없이:
Hermes Desktop 없이 명령줄만 설치하려면 다음을 실행하세요:

#### Linux / macOS / WSL2 / Android (Termux)
```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

#### Windows (native)

powershell에서 실행하세요:
```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1) 
```

명령줄 전용 설치 후 Hermes Desktop을 설치하고 실행하려면, 다음을 실행하세요
```bash
hermes desktop
```

### 설치 프로그램의 작업

설치 프로그램은 모든 것을 자동으로 처리합니다 — 모든 종속성(Python, Node.js, ripgrep, ffmpeg), 저장소 클론, 가상 환경, 전역 `hermes` 명령 설정 및 LLM provider 구성까지 처리합니다. 완료되면 바로 채팅할 수 있습니다.

#### 설치 레이아웃

설치 프로그램이 파일을 배치하는 위치는 일반 사용자로 설치하는지 root로 설치하는지에 따라 다릅니다:

| 설치 프로그램                              | 코드 위치                  | `hermes` 바이너리                         | 데이터 디렉터리                       |
| -------------------------------------- | ------------------------------ | --------------------------------------- | ------------------------------------ |
| 사용자별 (git 설치 프로그램)               | `~/.hermes/hermes-agent/`      | `~/.local/bin/hermes` (심볼릭 링크)         | `~/.hermes/`                         |
| root 모드 (`sudo curl … \| sudo bash`) | `/usr/local/lib/hermes-agent/` | `/usr/local/bin/hermes`                 | `/root/.hermes/` (또는 `$HERMES_HOME`) |

root 모드 **FHS 레이아웃**(`/usr/local/lib/…`, `/usr/local/bin/hermes`)은 Linux에서 다른 시스템 전체 개발 도구가 배치되는 위치와 일치합니다. 하나의 시스템 설치로 모든 사용자를 지원해야 하는 공유 머신 배포에 유용합니다. 사용자별 구성(auth, skills, sessions)은 여전히 각 사용자의 `~/.hermes/` 또는 명시적인 `HERMES_HOME` 아래에 있습니다.

### 설치 후

shell을 다시 로드하고 채팅을 시작하세요:

```bash
source ~/.bashrc   # or: source ~/.zshrc
hermes             # Start chatting!
```

나중에 개별 설정을 다시 구성하려면 전용 명령을 사용하세요:

```bash
hermes model          # Choose your LLM provider and model
hermes tools          # Configure which tools are enabled
hermes gateway setup  # Set up messaging platforms
hermes config set     # Set individual config values
hermes config get     # Inspect individual config values
hermes setup          # Or run the full setup wizard to configure everything at once
```

:::tip 가장 빠른 경로: Nous Portal
하나의 구독으로 [Tool Gateway](/user-guide/features/tool-gateway)(웹 검색, 이미지 생성, TTS, 클라우드 브라우저)를 포함한 300개 이상의 모델을 사용할 수 있습니다. 도구별 키를 관리하는 번거로움을 건너뛰세요:

```bash
hermes setup --portal
```

이 한 번의 명령으로 로그인하고, Nous를 provider로 설정하며, Tool Gateway를 켭니다.
:::

---

## 사전 요구 사항

**설치 프로그램:** Windows 이외의 플랫폼에서는 유일한 사전 요구 사항이 **Git**입니다. Linux에서는 `curl`과 `xz-utils`도 사용할 수 있는지 확인하세요(설치 프로그램이 Node.js를 `.tar.xz` 아카이브로 다운로드합니다). 데스크톱 앱은 네이티브 모듈을 컴파일하기 위해 추가로 `g++`(또는 Debian/Ubuntu의 `build-essential`)가 필요합니다. 설치 프로그램은 그 외의 모든 것을 자동으로 처리합니다:

- **uv** (빠른 Python 패키지 관리자)
- **Python 3.11** (uv를 통해, sudo 불필요)
- **Node.js v22** (브라우저 자동화 및 WhatsApp bridge용)
- **ripgrep** (빠른 파일 검색)
- **ffmpeg** (TTS용 오디오 형식 변환)

:::info
Python, Node.js, ripgrep 또는 ffmpeg를 수동으로 설치할 필요가 **없습니다**. 설치 프로그램이 누락된 항목을 감지해 설치합니다. `git`을 사용할 수 있는지만 확인하세요(`git --version`). Linux에서는 `curl`과 `xz-utils`가 설치되어 있는지 확인하세요(Debian/Ubuntu에서는 `sudo apt install curl xz-utils`). 데스크톱 앱용으로 `build-essential`도 설치하세요(`sudo apt install build-essential`).
:::

:::tip Nix 사용자
Nix는 더 이상 **명시적으로 지원되는 설치 경로가 아닙니다**(최선의 노력만 제공). Nix(NixOS, macOS 또는 Linux에서)를 이미 사용하고 있다면, Nix flake, 선언형 NixOS 모듈 및 선택적 컨테이너 모드를 포함한 전용 설정 경로가 있습니다. **[Nix 및 NixOS 설정](./nix-setup.md)** 가이드를 참조하세요.
:::

---

## 수동 / 개발자 설치

기여, 특정 브랜치에서 실행 또는 가상 환경을 완전히 제어하기 위해 저장소를 클론하고 소스에서 설치하려는 경우, 기여 가이드의 [개발 환경 설정](../developer-guide/contributing.md#development-setup) 섹션을 참조하세요.

---

## sudo 없이 / 시스템 서비스 사용자 설치

전용의 권한 없는 사용자(예: `hermes` systemd 서비스 계정 또는 `sudo` 액세스가 없는 모든 사용자)로 Hermes를 실행할 수 있습니다. 설치 경로에서 실제로 root가 필요한 유일한 부분은 Chromium이 사용하는 공유 라이브러리(`libnss3`, `libxkbcommon` 등)를 `apt`로 설치하는 Playwright의 `--with-deps` 단계입니다. 설치 프로그램은 sudo 사용 가능 여부를 감지하고 sudo가 없을 때 원활하게 성능을 낮춥니다 — 서비스 사용자 자신의 Playwright 캐시에 Chromium 바이너리를 설치하고 관리자가 별도로 실행해야 하는 정확한 명령을 출력합니다.

**권장 분리(Debian/Ubuntu):**

1. **한 번만, sudo 권한이 있는 관리자 사용자로**, Chromium에 필요한 시스템 라이브러리를 설치하세요:
   ```bash
   sudo npx playwright install-deps chromium
   ```
   (어디서든 실행할 수 있습니다 — `npx`가 필요할 때 Playwright를 가져옵니다.)

2. **권한 없는 서비스 사용자로**, 일반 설치 프로그램을 실행하세요. 누락된 sudo를 감지하고 `--with-deps`를 건너뛰며 Chromium을 사용자의 로컬 Playwright 캐시에 설치합니다:
   ```bash
   curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
   ```

   브라우저 자동화가 필요 없는 headless 환경에서 실행하는 경우처럼 Playwright 단계를 완전히 건너뛰려면 `--skip-browser`를 전달하세요:
   ```bash
   curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-browser
   ```

3. **서비스 사용자의 shell에서 `hermes`를 사용할 수 있도록 하세요.** 설치 프로그램은 `~/.local/bin/hermes`에 런처를 작성합니다. 시스템 서비스 계정에는 `~/.local/bin`이 포함되지 않은 최소 PATH가 있는 경우가 많습니다. 이를 사용자의 환경에 추가하거나, 런처를 시스템 위치에 심볼릭 링크하세요:
   ```bash
   # Option A — add to the service user's profile
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

   # Option B — symlink system-wide (run as an admin)
   sudo ln -s /home/hermes/.hermes/hermes-agent/venv/bin/hermes /usr/local/bin/hermes
   ```

4. **확인:** 이제 `hermes doctor`가 문제없이 실행되어야 합니다. `ModuleNotFoundError: No module named 'dotenv'`가 발생하면, venv 런처(`~/.hermes/hermes-agent/venv/bin/hermes`) 대신 시스템 Python으로 저장소 소스 `hermes` 파일(`~/.hermes/hermes-agent/hermes`)을 호출하고 있는 것입니다 — 3단계를 수정하세요.

5. **이 계정에서 메시징 gateway도 실행하나요?** 서비스 사용자의 사용자 수준 서비스는 lingering을 활성화하기 전까지 로그아웃 시 중지되고 부팅 시 시작되지 않습니다:

   ```bash
   sudo loginctl enable-linger <service-user>
   ```

   서비스 설정 자체는 [Messaging Gateway](/user-guide/messaging/)를 참조하세요.

같은 패턴이 Arch(설치 프로그램은 동일한 sudo 감지 로직으로 pacman을 사용), Fedora/RHEL 및 openSUSE에서도 동작합니다 — 이 배포판들은 `--with-deps`를 전혀 지원하지 않으므로 관리자가 항상 시스템 라이브러리를 별도로 설치합니다. 설치 프로그램이 관련 `dnf`/`zypper` 명령을 출력합니다.

---

## 문제 해결

| 문제 | 해결 방법 |
|---------|----------|
| `hermes: command not found` | shell을 다시 로드하거나(`source ~/.bashrc`) PATH를 확인하세요 |
| `API key not set` | `hermes model`을 실행하여 provider를 구성하거나 `hermes config set OPENROUTER_API_KEY your_key`를 실행하세요 |
| 업데이트 후 구성 누락 | `hermes config check`를 실행한 다음 `hermes config migrate`를 실행하세요 |

추가 진단을 위해 `hermes doctor`를 실행하세요 — 정확히 무엇이 누락되었는지와 해결 방법을 알려 줍니다.

## 설치 방식 자동 감지

Hermes는 git 설치 프로그램, Docker 또는 NixOS를 통해 설치되었는지 자동 감지하며, `hermes update`는 해당 경로에 맞는 업데이트 명령을 출력합니다. 설정할 환경 변수는 없습니다 — 감지는 설치 레이아웃(`~/.hermes/hermes-agent/` 체크아웃, Docker 이미지 스탬프 또는 Nix 스토어 경로)을 기반으로 합니다. `hermes doctor`도 환경 요약 아래에 감지된 방식을 표시합니다.
