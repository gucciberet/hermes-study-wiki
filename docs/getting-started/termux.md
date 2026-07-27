---
sidebar_position: 3
title: "Android / Termux"
description: "Termux를 통해 Android 휴대폰에서 Hermes Agent를 직접 실행합니다"
---

# Termux를 사용하여 Android에서 Hermes 실행하기

:::warning 2등급 플랫폼
Termux(Android)는 [2등급 플랫폼](./platform-support.md#tier-2)입니다. 여기의 설치 프로그램 스크립트와 문서는 최선의 노력 기준으로만 유지 관리됩니다. `main`에 대한 커밋은 언제든지 이 패키지를 중단시킬 수 있습니다.
:::

Hermes Agent는 [Termux](https://termux.dev/)를 통해 Android 휴대폰에서 직접 실행할 수 있습니다.

이를 통해 휴대폰에서 작동하는 로컬 CLI와 현재 Android에서 원활하게 설치되는 것으로 알려진 핵심 추가 기능을 이용할 수 있습니다.

## 검증된 경로에서 지원되는 것은 무엇인가요?

검증된 Termux 번들은 다음을 설치합니다.

- Hermes CLI
- cron 지원
- PTY/백그라운드 터미널 지원
- Telegram 게이트웨이 지원(수동/최선의 노력 기반 백그라운드 실행)
- MCP 지원
- Honcho 메모리 지원
- ACP 지원

구체적으로 다음에 해당합니다.

```bash
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

## 아직 검증된 경로에 포함되지 않은 것은 무엇인가요?

일부 기능은 여전히 Android용으로 배포되지 않은 데스크톱/서버 스타일 종속성이 필요하거나, 아직 휴대폰에서 검증되지 않았습니다.

- 현재 Android에서는 `.[all]`이 지원되지 않습니다.
- `voice` extra는 `faster-whisper -> ctranslate2`에 의해 차단되며, `ctranslate2`는 Android wheel을 배포하지 않습니다.
- Termux 설치 프로그램에서는 자동 브라우저/Playwright 부트스트랩을 건너뜁니다.
- Docker 기반 터미널 격리는 Termux 내에서 사용할 수 없습니다.
- Android가 Termux 백그라운드 작업을 계속 일시 중단할 수 있으므로, 게이트웨이 지속성은 일반적인 관리형 서비스가 아니라 최선의 노력 기준입니다.

그렇다고 Hermes가 휴대폰 네이티브 CLI 에이전트로서 잘 작동하지 못하는 것은 아닙니다. 권장 모바일 설치가 데스크톱/서버 설치보다 의도적으로 더 좁은 범위라는 의미일 뿐입니다.

---

## 옵션 1: 한 줄 설치 프로그램

Hermes는 이제 Termux 인식 설치 경로를 제공합니다.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Termux에서 설치 프로그램은 자동으로 다음을 수행합니다.

- 시스템 패키지에 `pkg` 사용
- `python -m venv`로 venv 생성
- 먼저 광범위한 `.[termux-all]` extra를 시도하고, 더 작은 `.[termux]` extra(그다음 기본 설치)로 대체합니다. curl 설치 프로그램은 이 순서와 자동으로 일치합니다.
- 새 Termux PATH에서도 유지되도록 `hermes`를 `$PREFIX/bin`에 연결
- 검증되지 않은 브라우저/WhatsApp 부트스트랩 건너뛰기

명시적인 명령이 필요하거나 실패한 설치를 디버그해야 한다면 아래의 수동 경로를 사용하세요.

---

## 옵션 2: 수동 설치(완전히 명시적)

### 1. Termux 업데이트 및 시스템 패키지 설치

```bash
pkg update
pkg install -y git python clang rust make pkg-config libffi openssl nodejs ripgrep ffmpeg
```

이 패키지가 필요한 이유는 무엇인가요?

- `python` — 런타임 + venv 지원
- `git` — 저장소 복제/업데이트
- `clang`, `rust`, `make`, `pkg-config`, `libffi`, `openssl` — Android에서 일부 Python 종속성을 빌드하는 데 필요
- `nodejs` — 검증된 핵심 경로를 벗어난 실험을 위한 선택적 Node 런타임
- `ripgrep` — 빠른 파일 검색
- `ffmpeg` — 미디어/TTS 변환

### 2. Hermes 복제

```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
```

### 3. 가상 환경 생성

```bash
python -m venv venv
source venv/bin/activate
export ANDROID_API_LEVEL="$(getprop ro.build.version.sdk)"
python -m pip install --upgrade pip setuptools wheel
```

`ANDROID_API_LEVEL`은 `jiter`와 같은 Rust/maturin 기반 패키지에 중요합니다.

### 4. 검증된 Termux 번들 설치

```bash
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

최소 핵심 에이전트만 원하는 경우 다음도 작동합니다.

```bash
python -m pip install -e '.' -c constraints-termux.txt
```

### 5. Termux PATH에 `hermes` 추가

```bash
ln -sf "$PWD/venv/bin/hermes" "$PREFIX/bin/hermes"
```

`$PREFIX/bin`은 이미 Termux의 PATH에 있으므로, 매번 venv를 다시 활성화하지 않아도 새 셸에서도 `hermes` 명령이 유지됩니다.

### 6. 설치 확인

```bash
hermes version
hermes doctor
```

### 7. Hermes 시작

```bash
hermes
```

---

## 권장 후속 설정

### 모델 구성

```bash
hermes model
```

또는 키를 `~/.hermes/.env`에 직접 설정합니다.

### 나중에 전체 대화형 설정 마법사 다시 실행

```bash
hermes setup
```

### 선택적 Node 종속성 수동 설치

검증된 Termux 경로는 의도적으로 Node/브라우저 부트스트랩을 건너뜁니다. 나중에 브라우저 도구를 실험하려면 다음을 실행하세요.

```bash
pkg install nodejs-lts
npm install
```

브라우저 도구는 PATH 검색에 Termux 디렉터리(`/data/data/com.termux/files/usr/bin`)를 자동으로 포함하므로, 추가 PATH 구성 없이 `agent-browser`와 `npx`를 검색합니다.

달리 문서화될 때까지 Android의 브라우저/WhatsApp 도구는 실험적인 것으로 취급하세요.

---

## 문제 해결

### `.[all]` 설치 시 `No solution found`

대신 검증된 Termux 번들을 사용하세요.

```bash
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

현재 차단 요인은 `voice` extra입니다.

- `voice`는 `faster-whisper`를 가져옵니다.
- `faster-whisper`는 `ctranslate2`에 종속됩니다.
- `ctranslate2`는 Android wheel을 배포하지 않습니다.

### Android에서 `uv pip install` 실패

대신 stdlib venv + `pip`을 사용하는 Termux 경로를 사용하세요.

```bash
python -m venv venv
source venv/bin/activate
export ANDROID_API_LEVEL="$(getprop ro.build.version.sdk)"
python -m pip install --upgrade pip setuptools wheel
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

### `jiter` / `maturin`이 `ANDROID_API_LEVEL`에 대해 불만을 표시함

설치하기 전에 API 수준을 명시적으로 설정하세요.

```bash
export ANDROID_API_LEVEL="$(getprop ro.build.version.sdk)"
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

### `hermes doctor`에서 ripgrep 또는 Node가 없다고 표시됨

Termux 패키지로 설치하세요.

```bash
pkg install ripgrep nodejs
```

### Python 패키지 설치 중 빌드 실패

빌드 도구 체인이 설치되어 있는지 확인하세요.

```bash
pkg install clang rust make pkg-config libffi openssl
```

그런 다음 다시 시도하세요.

```bash
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

---

## 휴대폰에서의 알려진 제한 사항 {#known-limitations-on-phones}

- Docker 백엔드는 사용할 수 없습니다.
- 검증된 경로에서는 `faster-whisper`를 통한 로컬 음성 전사를 사용할 수 없습니다.
- 설치 프로그램은 브라우저 자동화 설정을 의도적으로 건너뜁니다.
- 일부 선택적 extra는 작동할 수 있지만, 현재 검증된 Android 번들로 문서화된 것은 `.[termux]`와 `.[termux-all]`뿐입니다.

새 Android 관련 문제를 발견하면 다음 내용과 함께 GitHub 이슈를 열어 주세요.

- Android 버전
- `termux-info`
- `python --version`
- `hermes doctor`
- 정확한 설치 명령 및 전체 오류 출력
