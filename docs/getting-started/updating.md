---
sidebar_position: 3
title: "업데이트 및 제거"
description: "Hermes 에이전트를 최신 버전으로 업데이트하거나 제거하는 방법"
---

# 업데이트 및 제거

## 업데이트 중

단일 명령으로 Update를 최신 버전으로 업그레이드합니다.

```bash
hermes update
```

이렇게 하면 `main`에서 최신 코드를 가져오고 종속성을 업데이트하며 마지막 업데이트 이후 추가된 새 옵션을 구성하라는 메시지가 표시됩니다.

:::tip
`hermes update`는 새 구성 옵션을 자동으로 감지하고 이를 추가하라는 메시지를 표시합니다. 해당 프롬프트를 건너뛴 경우 `hermes config check`를 수동으로 실행하여 누락된 옵션을 확인한 다음 `hermes config migrate`를 대화식으로 추가할 수 있습니다.
:::

### 업데이트 중에 발생하는 일

`hermes update`를 실행하면 다음 단계가 발생합니다.

1. **업데이트 전 스냅샷** — 경량 상태 스냅샷이 기본적으로 저장됩니다(페어링 데이터, 크론 작업, `config.yaml`, `.env`, `auth.json` 및 런타임 시 수정되는 기타 상태 파일 포함, 1GiB가 넘는 개별 파일은 건너뛰므로 대규모 세션 DB로 인해 업데이트 속도가 느려지지 않습니다). `updates.pre_update_backup`에 의해 제어됩니다(기본적으로 `quick`, 모든 `HERMES_HOME`의 zip인 경우 `full`, 비활성화하려면 `off`). [Snapshots and rollback](../user-guide/checkpoints-and-rollback.md)에 설명된 스냅샷 복원 흐름을 통해 복구할 수 있습니다.
2. **Git pull** — `main` 브랜치에서 최신 코드를 가져와서 하위 모듈을 업데이트합니다.
3. **풀 후 구문 검증 + 자동 롤백** — 풀 후 Hermes는 시작 시 `hermes` 호출이 가져올 때마다 9개의 중요한 파일을 컴파일합니다. 구문 분석에 실패한 경우(예: 고아 병합 충돌 마커, 실수로 잘린 파일) Hermes는 `git reset --hard <pre-pull-sha>`를 실행하여 설치를 롤백하므로 쉘이 부팅 가능한 상태로 유지됩니다. 업스트림 수정 사항이 적용되면 `hermes update`를 다시 실행하세요.
4. **종속성 설치** — `uv pip install -e ".[all]"`를 실행하여 새롭거나 변경된 종속성을 선택합니다.
5. **구성 마이그레이션** — 버전 이후 추가된 새로운 구성 옵션을 감지하고 이를 설정하라는 메시지를 표시합니다.
6. **Gateway 자동 다시 시작** — 업데이트가 완료된 후 실행 중인 게이트웨이가 새로 고쳐지므로 새 코드가 즉시 적용됩니다. 서비스 관리형 게이트웨이(Linux에서 시스템화되고 macOS에서 실행됨)는 서비스 관리자를 통해 다시 시작됩니다. Hermes가 실행 중인 PID를 프로필에 다시 매핑할 수 있으면 수동 게이트웨이가 자동으로 다시 시작됩니다.

### 기본이 아닌 분기에 대한 업데이트: `--branch`

기본적으로 `hermes update`는 `origin/main`를 추적합니다. `--branch <name>`를 전달하여 다른 분기에 대해 업데이트합니다. QA 채널, 기능 분기 또는 릴리스 후보 테스트에 유용합니다.

```bash
hermes update --branch release-candidate
hermes update --check --branch experimental   # preview behindness only
```

로컬 체크아웃이 다른 분기에 있는 경우 Hermes는 커밋되지 않은 작업을 자동으로 숨기고 HEAD를 대상 분기로 전환한 다음 가져옵니다. 로컬에 존재하지 않는 분기는 `origin/<name>`(`git checkout -B <name> origin/<name>`)에서 자동 추적됩니다. 어디에도 존재하지 않는 브랜치는 완전히 실패합니다. 숨겨진 변경 사항은 종료 전에 복원되므로 이상한 상태에 빠지는 일이 없습니다. `main` 전용 포크 업스트림 동기화 논리는 `main`가 아닌 분기에서 자동으로 건너뜁니다.

### 비대화형 업데이트의 로컬 변경 사항

터미널에서 `hermes update`를 실행하면 Hermes는 커밋되지 않은 소스 트리 변경 사항을 모두 숨기고 끌어온 다음 항상 그랬던 것처럼 복원할지 **묻습니다**. 대화형 업데이트에는 아무런 변화가 없습니다.

데스크톱/채팅 앱의 "Update" 버튼 또는 게이트웨이 트리거 업데이트를 통해 **터미널 없이** 업데이트가 실행되는 경우 응답할 메시지가 없습니다. `updates.non_interactive_local_changes` 설정은 숨겨진 변경 사항에 어떤 일이 발생하는지 결정합니다.

```yaml
# ~/.hermes/config.yaml
updates:
  non_interactive_local_changes: stash   # default: keep + auto-restore
  # non_interactive_local_changes: discard  # throw local source edits away
```

- `stash`(기본값) — 업데이트된 코드 위에 변경 사항을 자동 숨기고 끌어온 다음 자동 복원합니다. 아무것도 잃지 않습니다. 복원 시 충돌이 발생하면 수동 복구를 위해 git 은신처에 보존됩니다.
- `discard` — 자동으로 숨기고 끌어온 후 숨김을 삭제하므로 업데이트가 항상 깨끗한 트리에 놓입니다. Hermes 소스에 대한 로컬 편집 내용을 유지하지 않으려는 시스템에서만 이 기능을 사용하십시오. `git reset --hard` + `git clean -fd`가 아닌 숨김 삭제이므로 `node_modules`, `venv` 및 빌드 출력과 같은 무시된 경로는 절대 건드리지 않습니다.

데스크톱 앱에서는 **Settings → Advanced → In-App Update 로컬 변경**입니다.

### 미리보기 전용: `hermes update --check`

가져오기 전에 업데이트가 있는지 알고 싶으십니까? `hermes update --check`를 실행합니다. `origin/main`에 대해 커밋을 가져와 비교합니다. 파일이 수정되지 않으며 게이트웨이가 다시 시작되지 않습니다. "업데이트가 있습니까?"를 확인하는 스크립트 및 크론 작업에 유용합니다.

### 전체 업데이트 전 백업: `--backup`

높은 가치의 프로필(프로덕션 게이트웨이, 공유 팀 설치)의 경우 `HERMES_HOME`(구성, 인증, 세션, 기술, 페어링)의 전체 사전 풀 백업을 선택할 수 있습니다.

```bash
hermes update --backup
```

또는 모든 실행에 대해 기본값으로 설정합니다.

```yaml
# ~/.hermes/config.yaml
updates:
  pre_update_backup: full
```

`updates.pre_update_backup`는 `quick`(기본값 - 위에 설명된 경량 상태 스냅샷), `full`(빠른 스냅샷과 완전한 `HERMES_HOME` zip 기능이 추가되어 대규모 주택에서는 시간을 추가할 수 있음), `off`(사전 업데이트 백업이 전혀 없음 - `--no-backup`는 단일 실행에 대해 동일함)의 세 가지 모드가 있는 단일 손잡이입니다. 레거시 부울 값은 계속 작동합니다. `true`는 `full`를 의미하고 `false`는 `off`를 의미합니다.

### Windows: 다른 `hermes.exe`가 실행 중입니다.

Windows에서 `hermes update`는 Venv의 진입점 실행 파일이 열려 있는 다른 `hermes.exe` 프로세스를 감지하면 실행을 거부합니다. 가장 일반적으로 Hermes Desktop 앱의 생성된 백엔드, 다른 터미널의 열린 `hermes` REPL 또는 실행 중인 게이트웨이입니다.

```
$ hermes update
✗ Another hermes.exe is running:
    PID 12345  hermes.exe

  Updating now would fail to overwrite ...\venv\Scripts\hermes.exe because
  Windows blocks REPLACE on a running executable.

  Close Hermes Desktop, exit any open `hermes` REPLs, and
  stop the gateway (`hermes gateway stop`) before retrying.
  Override with `hermes update --force` if you've already
  confirmed those processes will not write to the venv.
```

나열된 프로세스를 닫고 다시 실행하십시오. 동시 프로세스가 방해하지 않을 것이라고 확신하는 경우(드물지만 일반적으로 바이러스 백신 shim의 속성이 잘못 지정된 경우에만 유용함) `--force`를 전달하여 검사를 건너뜁니다. 이 경우 업데이트 프로그램은 지수 백오프를 사용하여 `.exe` 이름 바꾸기를 다시 시도하고 완고한 잠금의 경우 업데이트가 완료될 수 있도록 `MoveFileEx(MOVEFILE_DELAY_UNTIL_REBOOT)`를 통해 다음 재부팅에 대한 교체를 예약합니다.

두 번째 별도의 가드는 Python 인터프리터(Desktop 앱의 백엔드, 게이트웨이, Python REPL)에서 프로세스가 실행되는 동안 가상 장치에 접근하는 것을 거부합니다. 이러한 프로세스는 기본 확장 파일(`.pyd`)을 잠긴 상태로 유지하며 액세스 거부 오류로 인해 도중에 종료되는 종속성 동기화로 인해 버전 간 설치가 중단됩니다. 이 가드는 `--force`에 의해 우회되지 **않습니다**. 감지된 보유자가 거짓 긍정이라고 확신하는 경우 명시적인 `hermes update --force-venv`를 사용하세요.

예상 출력은 다음과 같습니다.

```
$ hermes update
Updating Hermes Agent...
📥 Pulling latest code...
Already up to date.  (or: Updating abc1234..def5678)
📦 Updating dependencies...
✅ Dependencies updated
🔍 Checking for new config options...
✅ Config is up to date  (or: Found 2 new options — running migration...)
🔄 Restarting gateways...
✅ Gateway restarted
✅ Hermes Agent updated successfully!
```

### 권장되는 Update 이후 검증

`hermes update`는 기본 업데이트 경로를 처리하지만 빠른 검증을 통해 모든 것이 깔끔하게 도착했음을 확인합니다.

1. `git status --short` — 나무가 예기치 않게 더러워진 경우 계속하기 전에 검사하세요.
2. `hermes doctor` — 구성, 종속성 및 서비스 상태를 확인합니다.
3. `hermes --version` — 예상대로 충돌한 버전을 확인합니다.
4. 게이트웨이를 사용하는 경우: `hermes gateway status`
5. `doctor`가 npm 감사 문제를 보고하는 경우: 플래그가 지정된 디렉터리에서 `npm audit fix`를 실행합니다.

:::warning Dirty working tree after update
`git status --short`가 `hermes update` 이후에 예기치 않은 변경 사항을 표시하는 경우 계속하기 전에 중지하고 검사하세요. 이는 일반적으로 업데이트된 코드 위에 로컬 수정 사항이 다시 적용되었거나 종속성 단계에서 잠금 파일이 새로 고쳐졌음을 의미합니다.
:::

### 업데이트 도중 단말기 연결이 끊어지는 경우

`hermes update`는 우발적인 단자 손실로부터 스스로를 보호합니다.

- 업데이트는 `SIGHUP`를 무시하므로 SSH 세션이나 터미널 창을 닫아도 더 이상 설치 중에 종료되지 않습니다. `pip` 및 `git` 하위 프로세스는 이 보호를 상속하므로 연결이 끊어져 Python 환경이 절반 설치된 상태로 남아 있을 수 없습니다.
- 업데이트가 실행되는 동안 모든 출력은 `~/.hermes/logs/update.log`로 미러링됩니다. 터미널이 사라지면 다시 연결하고 로그를 검사하여 업데이트가 완료되었는지, 게이트웨이 다시 시작이 성공했는지 확인하세요.

```bash
tail -f ~/.hermes/logs/update.log
```

- `Ctrl-C`(SIGINT) 및 시스템 종료(SIGTERM)는 여전히 인정됩니다. 이는 사고가 아닌 고의적인 취소입니다.

터미널 드롭에서 살아남기 위해 더 이상 `hermes update`를 `screen` 또는 `tmux`로 래핑할 필요가 없습니다.

### 현재 버전 확인 중

```bash
hermes version
```

[GitHub releases page](https://github.com/NousResearch/hermes-agent/releases)의 최신 릴리스와 비교해 보세요.

### 메시징 플랫폼에서 업데이트

다음을 전송하여 Telegram, Discord, Slack, WhatsApp 또는 Teams에서 직접 업데이트할 수도 있습니다.

```
/update
```

이렇게 하면 최신 코드를 가져오고, 종속성을 업데이트하고, 실행 중인 게이트웨이를 다시 시작합니다. 봇은 다시 시작하는 동안 잠시(일반적으로 5~15초) 오프라인 상태가 된 후 다시 시작됩니다.

### 수동 Update

빠른 설치 프로그램을 통하지 않고 수동으로 설치한 경우:

```bash
cd /path/to/hermes-agent
# Activate the venv you created during install (outside the source tree)
export VIRTUAL_ENV="$HOME/.hermes/venvs/hermes-dev"
export PATH="$VIRTUAL_ENV/bin:$PATH"

# Pull latest code
git pull origin main

# Reinstall (picks up new dependencies)
uv pip install -e ".[all]"

# Check for new config options
hermes config check
hermes config migrate   # Interactively add any missing options
```

### 롤백 지침

업데이트로 인해 문제가 발생하는 경우 이전 버전으로 롤백할 수 있습니다.

```bash
cd /path/to/hermes-agent

# List recent versions
git log --oneline -10

# Roll back to a specific commit
git checkout <commit-hash>
uv pip install -e ".[all]"

# Restart the gateway if running
hermes gateway restart
```

특정 릴리스 태그로 롤백하려면(이전 태그 대체(예: `v2026.5.16`와 같은 최신 릴리스 또는 `git tag --sort=-version:refname`의 이전 태그)):

```bash
git checkout vX.Y.Z
uv pip install -e ".[all]"
```

:::warning
새 옵션이 추가된 경우 롤백하면 구성 비호환성이 발생할 수 있습니다. 롤백한 후 `hermes config check`를 실행하고 오류가 발생하면 `config.yaml`에서 인식할 수 없는 옵션을 제거하세요.
:::

### Nix 사용자를 위한 참고사항

Nix는 더 이상 명시적으로 지원되는 설치 경로가 아닙니다(최선의 노력만 해당). [Nix Setup](./nix-setup.md)를 참조하세요. Nix 플레이크를 통해 설치한 경우 업데이트는 Nix 패키지 관리자를 통해 관리됩니다.

```bash
# Update the flake input
nix flake update hermes-agent

# Or rebuild with the latest
nix profile upgrade hermes-agent
```

Nix 설치는 변경할 수 없습니다. 롤백은 Nix의 생성 시스템에서 처리됩니다.

```bash
nix profile rollback
```

자세한 내용은 [Nix Setup](./nix-setup.md)를 참조하세요.

---

## 제거 중

```bash
hermes uninstall
```

제거 프로그램은 향후 재설치를 위해 구성 파일(`~/.hermes/`)을 유지하는 옵션을 제공합니다.

### 수동 제거

```bash
rm -f ~/.local/bin/hermes
rm -rf /path/to/hermes-agent
rm -rf ~/.hermes            # Optional — keep if you plan to reinstall
```

:::info
게이트웨이를 시스템 서비스로 설치한 경우 먼저 이를 중지하고 비활성화합니다.
```bash
hermes gateway stop
# Linux: systemctl --user disable hermes-gateway
# macOS: launchctl remove ai.hermes.gateway
```
:::
