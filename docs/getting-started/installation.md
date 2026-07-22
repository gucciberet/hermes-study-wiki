---
title: 설치
sidebar_position: 2
description: Linux, macOS, WSL2, 네이티브 Windows 또는 Android Termux에 Hermes Agent를 설치하는 방법
source_path: website/docs/getting-started/installation.md
source_url: https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/installation.md
source_sha: 39237bc6f4b66b64efa61ccd2e916ecf9c848d64
source_checked_at: '2026-07-23'
---

# 설치

2분 안에 Hermes Agent를 실행할 수 있습니다.

:::tip[플랫폼 지원]
지원하는 운영체제·배포 방식·플랫폼별 기능의 전체 목록은 [플랫폼 지원](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support)에서 확인하세요.
:::

## 빠른 설치

### macOS 또는 Windows에서 Hermes Desktop 설치 프로그램 사용(권장)

명령줄과 데스크톱 앱을 쉽게 설치하려면 [Hermes Desktop 설치 프로그램](https://hermes-agent.nousresearch.com/)을 내려받아 실행하세요.

### Hermes Desktop 없이 설치

Hermes Desktop 없이 명령줄만 설치하려면 다음을 실행하세요.

#### Linux / macOS / WSL2 / Android (Termux)

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

#### Windows(네이티브)

PowerShell에서 실행하세요.

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

명령줄만 설치한 뒤 Hermes Desktop을 설치하고 실행하려면 다음을 실행하면 됩니다.

```bash
hermes desktop
```

### 설치 프로그램이 하는 일

설치 프로그램은 필요한 작업을 자동으로 처리합니다. Python, Node.js, ripgrep, ffmpeg 등의 의존성을 설치하고, 저장소를 복제하며, 가상 환경과 전역 `hermes` 명령을 구성하고, LLM 제공자 설정까지 안내합니다. 설치가 끝나면 바로 대화할 수 있습니다.

#### 설치 위치

설치를 일반 사용자로 하는지 root로 하는지에 따라 설치 위치가 달라집니다.

| 설치 방식 | 코드 위치 | `hermes` 실행 파일 | 데이터 디렉터리 |
| --- | --- | --- | --- |
| 사용자별(git 설치 프로그램) | `~/.hermes/hermes-agent/` | `~/.local/bin/hermes`(심볼릭 링크) | `~/.hermes/` |
| root 모드(`sudo curl … \| sudo bash`) | `/usr/local/lib/hermes-agent/` | `/usr/local/bin/hermes` | `/root/.hermes/`(또는 `$HERMES_HOME`) |

root 모드의 **FHS 레이아웃**(`/usr/local/lib/…`, `/usr/local/bin/hermes`)은 다른 시스템 전체 개발 도구가 Linux에 설치되는 위치와 같습니다. 하나의 시스템 설치를 여러 사용자가 함께 쓰는 환경에 적합합니다. 인증·스킬·세션 등 사용자별 설정은 계속 각 사용자의 `~/.hermes/` 또는 명시한 `HERMES_HOME` 아래에 저장됩니다.

### 설치 후

셸 설정을 다시 불러온 뒤 대화를 시작하세요.

```bash
source ~/.bashrc   # 또는: source ~/.zshrc
hermes             # 대화 시작
```

나중에 개별 설정을 다시 구성하려면 전용 명령을 사용하세요.

```bash
hermes model          # LLM 제공자와 모델 선택
hermes tools          # 활성화할 도구 구성
hermes gatew\
ay setup              # 메시징 플랫폼 설정
hermes config set     # 개별 구성 값 설정
hermes config get     # 개별 구성 값 확인
hermes setup          # 전체 설정 마법사 실행
```

:::tip[가장 빠른 방법: Nous Portal]
하나의 구독으로 300개 이상의 모델과 [Tool Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway)(웹 검색, 이미지 생성, TTS, 클라우드 브라우저)를 사용할 수 있습니다. 도구별 키를 따로 관리하지 않아도 됩니다.

```bash
hermes setup --portal
```

이 명령은 로그인하고 Nous를 제공자로 설정하며 Tool Gateway를 한 번에 켭니다.
:::

---

## 사전 요구 사항

**설치 프로그램:** Windows가 아닌 플랫폼에서 필요한 사전 요구 사항은 **Git**뿐입니다. Linux에서는 `curl`과 `xz-utils`도 설치되어 있어야 합니다. 설치 프로그램이 Node.js를 `.tar.xz` 아카이브로 내려받기 때문입니다. 데스크톱 앱은 네이티브 모듈을 컴파일하기 위해 `g++`(Debian/Ubuntu에서는 `build-essential`)가 추가로 필요합니다. 그 밖의 항목은 설치 프로그램이 자동으로 처리합니다.

- **uv**(빠른 Python 패키지 관리자)
- **Python 3.11**(uv를 통해 설치, sudo 불필요)
- **Node.js v22**(브라우저 자동화와 WhatsApp 브리지용)
- **ripgrep**(빠른 파일 검색)
- **ffmpeg**(TTS 오디오 형식 변환)

:::info
Python, Node.js, ripgrep, ffmpeg를 직접 설치할 필요는 없습니다. 설치 프로그램이 없는 항목을 찾아 설치합니다. 먼저 Git만 사용할 수 있으면 됩니다(`git --version`). Linux에서는 `curl`과 `xz-utils`를 설치하세요(Debian/Ubuntu: `sudo apt install curl xz-utils`). 데스크톱 앱에는 `build-essential`도 설치하세요(`sudo apt install build-essential`).
:::

:::tip[Nix 사용자]
Nix는 더 이상 명시적으로 지원하는 설치 경로가 아니며, 최선의 노력(best-effort)으로만 지원합니다. NixOS·macOS·Linux에서 이미 Nix를 사용한다면 Nix flake, 선언형 NixOS 모듈, 선택적 컨테이너 모드를 다루는 [Nix 및 NixOS 설정](https://hermes-agent.nousresearch.com/docs/getting-started/nix-setup) 문서를 참고하세요.
:::

---

## 수동 설치 / 개발자 설치

기여를 위해 저장소를 복제하거나, 특정 브랜치에서 실행하거나, 가상 환경을 완전히 제어하려면 [기여 가이드의 개발 환경 설정](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing#development-setup)을 참고하세요.

---

## sudo 없이 설치하거나 권한 없는 계정으로 설치하기

전용의 권한 없는 계정(예: `hermes` systemd 계정 또는 sudo 권한이 없는 사용자)으로 Hermes를 실행할 수 있습니다. 설치 과정에서 실제로 root 권한이 필요한 부분은 Chromium이 사용하는 공유 라이브러리(`libnss3`, `libxkbcommon` 등)를 `apt`로 설치하는 Playwright의 `--with-deps` 단계뿐입니다. 설치 프로그램은 sudo 사용 가능 여부를 확인해, sudo를 쓸 수 없을 때도 정상적으로 처리합니다. 해당 경우 사용자의 Playwright 캐시에 Chromium 바이너리를 설치하고, 관리자가 별도로 실행할 정확한 명령을 출력합니다.

**권장 분리 방식(Debian/Ubuntu):**

1. **sudo 권한이 있는 관리자 사용자로 한 번만** Chromium에 필요한 시스템 라이브러리를 설치합니다.

   ```bash
   sudo npx playwright install-deps chromium
   ```

   어디에서든 실행할 수 있으며, `npx`가 필요하면 Playwright를 즉시 가져옵니다.

2. **권한 없는 사용자로** 일반 설치 프로그램을 실행합니다. sudo를 사용할 수 없음을 감지해 `--with-deps`는 건너뛰고, Chromium을 사용자의 로컬 Playwright 캐시에 설치합니다.

   ```bash
   curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
   ```

   헤드리스 환경에서 브라우저 자동화가 필요하지 않은 경우처럼 Playwright 단계를 완전히 건너뛰려면 `--skip-browser`를 전달하세요.

   ```bash
   curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-browser
   ```

3. **사용자의 셸에서 `hermes`를 사용할 수 있게 합니다.** 설치 프로그램은 실행 파일을 `~/.local/bin/hermes`에 만듭니다. 최소 PATH에는 `~/.local/bin`이 없을 수 있습니다. 사용자의 환경에 추가하거나 시스템 위치에 심볼릭 링크를 만드세요.

   ```bash
   # 방법 A — 사용자의 프로필에 추가
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

   # 방법 B — 시스템 전체 심볼릭 링크(관리자로 실행)
   sudo ln -s /home/hermes/.hermes/hermes-agent/venv/bin/hermes /usr/local/bin/hermes
   ```

4. **확인:** 이제 `hermes doctor`가 오류 없이 실행되어야 합니다. `ModuleNotFoundError: No module named 'dotenv'`가 나오면 가상 환경 실행 파일(`~/.hermes/hermes-agent/venv/bin/hermes`)이 아니라 시스템 Python으로 저장소의 `hermes` 파일(`~/.hermes/hermes-agent/hermes`)을 실행한 것입니다. 3단계를 수정하세요.

이 방식은 Arch에서도 작동합니다. 설치 프로그램은 같은 sudo 감지 로직으로 pacman을 사용합니다. Fedora/RHEL 및 openSUSE는 `--with-deps` 자체를 지원하지 않으므로 관리자가 항상 시스템 라이브러리를 따로 설치해야 합니다. 필요한 `dnf` 또는 `zypper` 명령은 설치 프로그램이 출력합니다.

---

## 문제 해결

| 문제 | 해결 방법 |
| --- | --- |
| `hermes: command not found` | 셸 설정을 다시 불러오거나(`source ~/.bashrc`) PATH를 확인하세요. |
| `API key not set` | `hermes model`로 제공자를 구성하거나 `hermes config set OPENROUTER_API_KEY your_key`를 실행하세요. |
| 업데이트 후 구성이 누락됨 | `hermes config check`를 실행한 다음 `hermes config migrate`를 실행하세요. |

더 자세한 진단은 `hermes doctor`를 실행하세요. 빠진 항목과 해결 방법을 정확히 알려 줍니다.

## 설치 방식 자동 감지

Hermes는 git 설치 프로그램, Docker, NixOS 중 어떤 방식으로 설치되었는지 자동으로 감지합니다. 이 감지는 설치 방식에 맞는 업데이트 명령을 안내하는 데 사용됩니다. 별도로 설정할 환경 변수는 없습니다. 감지는 설치 레이아웃(`~/.hermes/hermes-agent/` 체크아웃, Docker 이미지 스탬프 또는 Nix store 경로)을 기준으로 합니다. `hermes doctor`의 환경 요약에서도 감지된 방식을 확인할 수 있습니다.

## 공식 원문

- [Installation](https://hermes-agent.nousresearch.com/docs/getting-started/installation)

_공식 원문 확인일: 2026-07-23_
