---
sidebar_position: 3
title: "Nix 및 NixOS 설정"
description: "빠른 `nix run`부터 컨테이너 모드가 포함된 완전히 선언적인 NixOS 모듈까지 Nix가 포함된 Hermes 에이전트 설치 및 배포"
---

# Nix 및 NixOS 설정

:::warning 계층 2 플랫폼
Nix와 NixOS는 [Tier 2 플랫폼](./platform-support.md#tier-2)입니다. 여기에 설명된 플레이크 및 NixOS 모듈은 최선을 다해 유지 관리됩니다. `main`에 대한 커밋으로 인해 언제든지 이러한 패키지가 중단될 수 있습니다.

지원되는 설정의 경우 표준 [installation](./installation.md) 경로(Docker 또는 FHS 환경) 중 하나를 사용하십시오.
:::

Hermes Agent는 Nix 플레이크 및 NixOS 모듈을 배송합니다.

| 레벨 | 누구를 위한 것인가 | 당신이 얻는 것 |
|-------|-------------|--------------|
| **`nix run` / `nix profile install`** | 모든 Nix 사용자(macOS, Linux) | 모든 Deps가 포함된 사전 빌드된 바이너리 — 그런 다음 표준 CLI 워크플로 사용 |
| **NixOS 모듈(네이티브)** | NixOS 서버 배포 | 선언적 구성, 강화된 시스템 서비스, 관리되는 비밀 |
| **NixOS 모듈(컨테이너)** | 자체 수정이 필요한 에이전트 | 위의 모든 항목과 에이전트가 `apt`/`pip`/`npm install` |

:::info 표준 설치와 다른 점
`curl | bash` 설치 프로그램은 Python, Node 및 종속성 자체를 관리합니다. Nix 플레이크는 이 모든 것을 대체합니다. 모든 Python 종속성은 [uv2nix](https://github.com/pyproject-nix/uv2nix)에 의해 구축된 Nix 파생물이며 런타임 도구(Node.js, git, ripgrep, ffmpeg)는 바이너리의 PATH에 래핑됩니다. 런타임 pip, venv 활성화, `npm install`이 없습니다.

**NixOS가 아닌 사용자**의 경우 설치 단계만 변경됩니다. 이후의 모든 작업(`hermes setup`, `hermes gateway install`, 구성 편집)은 표준 설치와 동일하게 작동합니다.

**NixOS 모듈 사용자**의 경우 전체 수명 주기가 다릅니다. 구성은 `configuration.nix`에 있고, 비밀은 sops-nix/agenix를 통과하고, 서비스는 systemd 단위이며, CLI 구성 명령은 차단됩니다. hermes는 다른 NixOS 서비스를 관리하는 것과 동일한 방식으로 관리됩니다.
:::

## 전제조건

- **플레이크가 활성화된 Nix** — [Nix 결정](https://install.determinate.systems) 권장(기본적으로 플레이크 활성화)
- 사용하려는 서비스에 대한 **API 키**(최소: OpenRouter 또는 Anthropic 키)

---

## 빠른 시작(모든 Nix 사용자) {#quick-start-any-nix-user}

클론이 필요하지 않습니다. Nix는 모든 것을 가져오고, 빌드하고, 실행합니다.

```bash
# Run the desktop app
nix run github:NousResearch/hermes-agent#desktop

# Or install persistently
nix profile install github:NousResearch/hermes-agent#desktop

# run the tui
nix run github:NousResearch/hermes-agent -- setup
nix run github:NousResearch/hermes-agent -- --tui

# or install it in your profile
nix profile install github:NousResearch/hermes-agent
hermes setup
hermes --tui
```

`nix profile install`, `hermes`, `hermes-agent` 및 `hermes-acp`이(가) 경로에 있으면 됩니다. 여기에서 워크플로는 [표준 설치](./installation.md)과 동일합니다. `hermes setup`는 공급자 선택을 안내하고, `hermes gateway install`는 launchd(macOS) 또는 systemd 사용자 서비스를 설정하고, 구성은 `~/.hermes/`에 있습니다.

:::warning 메시징 플랫폼(Discord, Telegram, Slack)
기본 패키지에는 hermes-agent에 필요할 수 있는 모든 라이브러리가 포함되어 있습니다. 더 작은 변형을 원한다면 다른 플레이크 출력을 확인하세요.

`default` 패키지는 클로저에 ~700MB를 추가합니다. 메시징 플랫폼만 필요한 경우 `#messaging`는 ~33MB만 추가합니다.

:::

<details>
<summary><strong>로컬 클론에서 실행</strong></summary>

```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
nix develop
hermes setup
```

</details>

---

## NixOS 모듈

이 플레이크는 사용자 생성, 디렉터리, 구성 생성, 비밀, 문서 및 서비스 수명 주기를 선언적으로 관리하는 전체 NixOS 서비스 모듈인 `nixosModules.default`을 내보냅니다.

:::note
이 모듈에는 NixOS가 필요합니다. NixOS가 아닌 시스템(macOS, 기타 Linux 배포판)의 경우 `nix profile install` 및 위의 표준 CLI 워크플로를 사용하세요.
:::

### 플레이크 입력 추가

```nix
# /etc/nixos/flake.nix (or your system flake)
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    hermes-agent.url = "github:NousResearch/hermes-agent";
  };

  outputs = { nixpkgs, hermes-agent, ... }: {
    nixosConfigurations.your-host = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        hermes-agent.nixosModules.default
        ./configuration.nix
      ];
    };
  };
}
```

### 최소 구성

```nix
# configuration.nix
{ config, ... }: {
  services.hermes-agent = {
    enable = true;
    settings.model.default = "anthropic/claude-sonnet-4";
    environmentFiles = [ config.sops.secrets."hermes-env".path ];
    addToSystemPackages = true;
  };
}
```

그게 다야. `nixos-rebuild switch`은 `hermes` 사용자를 생성하고, `config.yaml`를 생성하고, 비밀을 연결하고, 에이전트를 메시징 플랫폼(Telegram, Discord 등)에 연결하고 들어오는 메시지를 수신하는 장기 실행 서비스인 게이트웨이를 시작합니다.

:::warning 비밀번호는 필수 항목입니다.
위의 `environmentFiles` 줄에서는 [sops-nix](https://github.com/Mic92/sops-nix) 또는 [agenix](https://github.com/ryantm/agenix)이 구성되어 있다고 가정합니다. 파일에는 하나 이상의 LLM 공급자 키(예: `OPENROUTER_API_KEY=sk-or-...`)가 포함되어 있어야 합니다. 전체 설정은 [비밀 관리](#secrets-management)를 참조하세요. 아직 비밀 관리자가 없다면 일반 파일을 시작점으로 사용할 수 있습니다. 단, 누구나 읽을 수 없는 파일인지 확인하세요.

```bash
echo "OPENROUTER_API_KEY=sk-or-your-key" | sudo install -m 0600 -o hermes /dev/stdin /var/lib/hermes/env
```

```nix
services.hermes-agent.environmentFiles = [ "/var/lib/hermes/env" ];
```
:::

:::tip addToSystemPackages
`addToSystemPackages = true`을 설정하면 두 가지 작업이 수행됩니다. 시스템 PATH에 `hermes` CLI를 배치하고** `HERMES_HOME`를 시스템 전체에 설정하여 대화형 CLI가 게이트웨이 서비스와 상태(세션, 기술, cron)를 공유하도록 합니다. 이것이 없으면 셸에서 `hermes`을 실행하면 별도의 `~/.hermes/` 디렉터리가 생성됩니다.
:::

### 컨테이너 인식 CLI

:::info
`container.enable = true` 및 `addToSystemPackages = true`인 경우 호스트의 **모든** `hermes` 명령은 자동으로 관리형 컨테이너로 라우팅됩니다. 이는 대화형 CLI 세션이 게이트웨이 서비스와 동일한 환경 내에서 실행되며 컨테이너에 설치된 모든 패키지 및 도구에 액세스할 수 있음을 의미합니다.

- 라우팅은 투명합니다. `hermes chat`, `hermes sessions list`, `hermes version` 등은 모두 후드 아래 컨테이너에 실행됩니다.
- 모든 CLI 플래그는 있는 그대로 전달됩니다.
- 컨테이너가 실행되고 있지 않으면 CLI가 잠시 재시도한 후(대화형 사용의 경우 스피너를 사용하여 5초, 스크립트의 경우 자동으로 10초) 명확한 오류와 함께 실패합니다. 자동 폴백이 없습니다.
- hermes 코드베이스 작업을 하는 개발자의 경우 컨테이너 라우팅을 우회하고 로컬 체크아웃을 직접 실행하도록 `HERMES_DEV=1`을 설정하세요.

`container.hostUsers`을 설정하여 서비스 상태 디렉터리에 대한 `~/.hermes` 심볼릭 링크를 생성합니다. 그러면 호스트 CLI와 컨테이너가 세션, 구성 및 메모리를 공유합니다.

```nix
services.hermes-agent = {
  container.enable = true;
  container.hostUsers = [ "your-username" ];
  addToSystemPackages = true;
};
```

`hostUsers`에 나열된 사용자는 파일 권한 액세스를 위해 `hermes` 그룹에 자동으로 추가됩니다.

**Podman 사용자:** NixOS 서비스는 컨테이너를 루트로 실행합니다. Docker 사용자는 `docker` 그룹 소켓을 통해 액세스할 수 있지만 Podman의 루트풀 컨테이너에는 sudo가 필요합니다. 컨테이너 런타임에 비밀번호 없는 sudo를 부여합니다.

```nix
security.sudo.extraRules = [{
  users = [ "your-username" ];
  commands = [{
    command = "/run/current-system/sw/bin/podman";
    options = [ "NOPASSWD" ];
  }];
}];
```

CLI는 sudo가 필요한 시기를 자동으로 감지하고 이를 투명하게 사용합니다. 이것이 없으면 `sudo hermes chat`을 수동으로 실행해야 합니다.
:::

### 작동하는지 확인하세요

`nixos-rebuild switch` 이후 서비스가 실행 중인지 확인합니다.

```bash
# Check service status
systemctl status hermes-agent

# Watch logs (Ctrl+C to stop)
journalctl -u hermes-agent -f

# If addToSystemPackages is true, test the CLI
hermes version
hermes config       # shows the generated config
```

### 배포 모드 선택

모듈은 `container.enable`에 의해 제어되는 두 가지 모드를 지원합니다.

| | **네이티브**(기본값) | **컨테이너** |
|---|---|---|
| 실행 방법 | 호스트의 강화된 systemd 서비스 | `/nix/store` 바인드 마운트된 영구 Ubuntu 컨테이너 |
| 보안 | `NoNewPrivileges`, `ProtectSystem=strict`, `PrivateTmp` | 컨테이너 격리, 내부에서 권한 없는 사용자로 실행 |
| 에이전트는 패키지를 자체 설치할 수 있습니다 | 아니요 - Nix 제공 PATH | 예 — `apt`, `pip`, `npm` 설치는 다시 시작해도 유지됩니다. |
| 구성 표면 | 같은 | 같은 |
| 선택 시기 | 표준 배포, 최대 보안, 재현성 | 에이전트에는 런타임 패키지 설치, 변경 가능한 환경, 실험 도구가 필요합니다 |

컨테이너 모드를 활성화하려면 다음 한 줄을 추가하세요.

```nix
{
  services.hermes-agent = {
    enable = true;
    container.enable = true;
    # ... rest of config is identical
  };
}
```

:::info
컨테이너 모드는 `mkDefault`을(를) 통해 `virtualisation.docker.enable`을(를) 자동으로 활성화합니다. 대신 Podman을 사용하는 경우 `container.backend = "podman"` 및 `virtualisation.docker.enable = false`을 설정하세요.
:::

---

## 구성

### 선언적 설정

`settings` 옵션은 `config.yaml`로 렌더링되는 임의의 속성 집합을 허용합니다. `lib.recursiveUpdate`를 통해 여러 모듈 정의에 걸쳐 심층 병합을 지원하므로 파일 간에 구성을 분할할 수 있습니다.

```nix
# base.nix
services.hermes-agent.settings = {
  model.default = "anthropic/claude-sonnet-4";
  toolsets = [ "all" ];
  terminal = { backend = "local"; timeout = 180; };
};

# personality.nix
services.hermes-agent.settings = {
  display = { compact = false; personality = "kawaii"; };
  memory = { memory_enabled = true; user_profile_enabled = true; };
};
```

둘 다 평가 시 심층 병합됩니다. Nix가 선언한 키는 항상 디스크에 있는 기존 `config.yaml`의 키보다 우선하지만 **Nix가 건드리지 않는 사용자 추가 키는 보존됩니다**. 즉, 에이전트나 수동 편집으로 `skills.disabled` 또는 `streaming.enabled`와 같은 키를 추가하면 해당 키는 `nixos-rebuild switch` 후에도 유지됩니다.

:::note 모델 명명
`settings.model.default`은 공급자가 기대하는 모델 식별자를 사용합니다. [OpenRouter](https://openrouter.ai)(기본값)을 사용하면 `"anthropic/claude-sonnet-4"` 또는 `"google/gemini-3-flash"`처럼 보입니다. 공급자(Anthropic, OpenAI)를 직접 사용하는 경우 해당 API를 가리키도록 `settings.model.base_url`을 설정하고 기본 모델 ID(예: `"claude-sonnet-4-20250514"`)를 사용하세요. `base_url`가 설정되지 않은 경우 Hermes는 기본적으로 OpenRouter를 사용합니다.
:::

:::tip 사용 가능한 구성 키 검색
`nix build .#configKeys && cat result`을 실행하여 Python의 `DEFAULT_CONFIG`에서 추출된 모든 리프 구성 키를 확인하세요. 기존 `config.yaml`를 `settings` 속성 ​​집합에 붙여 넣을 수 있습니다. 구조는 1:1로 매핑됩니다.
:::

<details>
<summary><strong>전체 예: 일반적으로 사용자 정의되는 모든 설정</strong></summary>

```nix
{ config, ... }: {
  services.hermes-agent = {
    enable = true;
    container.enable = true;

    # ── Model ──────────────────────────────────────────────────────────
    settings = {
      model = {
        base_url = "https://openrouter.ai/api/v1";
        default = "anthropic/claude-opus-4.6";
      };
      toolsets = [ "all" ];
      max_turns = 100;
      terminal = { backend = "local"; cwd = "."; timeout = 180; };
      compression = {
        enabled = true;
        threshold = 0.85;
        summary_model = "google/gemini-3-flash-preview";
      };
      memory = { memory_enabled = true; user_profile_enabled = true; };
      display = { compact = false; personality = "kawaii"; };
      agent = { max_turns = 60; verbose = false; };
    };

    # ── Secrets ────────────────────────────────────────────────────────
    environmentFiles = [ config.sops.secrets."hermes-env".path ];

    # ── Documents ──────────────────────────────────────────────────────
    documents = {
      "USER.md" = ./documents/USER.md;
    };

    # ── MCP Servers ────────────────────────────────────────────────────
    mcpServers.filesystem = {
      command = "npx";
      args = [ "-y" "@modelcontextprotocol/server-filesystem" "/data/workspace" ];
    };

    # ── Container options ──────────────────────────────────────────────
    container = {
      image = "ubuntu:24.04";
      backend = "docker";
      hostUsers = [ "your-username" ];
      extraVolumes = [ "/home/user/projects:/projects:rw" ];
      extraOptions = [ "--gpus" "all" ];
    };

    # ── Service tuning ─────────────────────────────────────────────────
    addToSystemPackages = true;
    extraArgs = [ "--verbose" ];
    restart = "always";
    restartSec = 5;
  };
}
```

</details>

### 탈출구: 나만의 구성 가져오기

Nix 외부에서 `config.yaml`을 완전히 관리하려면 `configFile`을 사용하세요.

```nix
services.hermes-agent.configFile = /etc/hermes/config.yaml;
```

이는 `settings`을 완전히 우회합니다. 병합이나 생성이 없습니다. 파일은 활성화될 때마다 `$HERMES_HOME/config.yaml`에 있는 그대로 복사됩니다.

### 사용자 정의 치트시트

Nix 사용자가 사용자 정의하려는 가장 일반적인 사항에 대한 빠른 참조:

| 나는... | 옵션 | 예 |
|---|---|---|
| LLM 모델 변경 | `settings.model.default` | `"anthropic/claude-sonnet-4"` |
| 다른 제공자 엔드포인트 사용 | `settings.model.base_url` | `"https://openrouter.ai/api/v1"` |
| API 키 추가 | `environmentFiles` | `[ config.sops.secrets."hermes-env".path ]` |
| 상담원에게 개성을 부여하세요 | `${services.hermes-agent.stateDir}/.hermes/SOUL.md` | 파일을 직접 관리 |
| MCP 도구 서버 추가 | `mcpServers.<name>` | [MCP 서버](#mcp-servers) |
| Discord/Telegram/Slack 활성화 | `extraDependencyGroups` | `[ "messaging" ]` |
| 호스트 디렉터리를 컨테이너에 마운트 | `container.extraVolumes` | `[ "/data:/data:rw" ]` |
| GPU 액세스를 컨테이너에 전달 | `container.extraOptions` | `[ "--gpus" "all" ]` |
| Docker 대신 Podman 사용 | `container.backend` | `"podman"` |
| 호스트 CLI와 컨테이너 간 상태 공유 | `container.hostUsers` | `[ "sidbin" ]` |
| 상담원이 사용할 수 있는 추가 도구 제공 | `extraPackages` | `[ pkgs.pandoc pkgs.imagemagick ]` |
| 사용자 정의 기본 이미지 사용 | `container.image` | `"ubuntu:24.04"` |
| 헤르메스 패키지 재정의 | `package` | `inputs.hermes-agent.packages.${system}.default.override { ... }` |
| 상태 디렉토리 변경 | `stateDir` | `"/opt/hermes"` |
| 에이전트의 작업 디렉터리 설정 | `workingDirectory` | `"/home/user/projects"` |

---

## 비밀 관리 {#secrets-management}

:::danger `settings` 또는 `environment`에 API 키를 넣지 마십시오.
Nix 표현식의 값은 누구나 읽을 수 있는 `/nix/store`로 끝납니다. 항상 비밀 관리자와 함께 `environmentFiles`을(를) 사용하세요.
:::

`environment`(비밀 변수) 및 `environmentFiles`(비밀 파일)은 모두 활성화 시(`nixos-rebuild switch`) `$HERMES_HOME/.env`에 병합됩니다. Hermes는 시작할 때마다 이 파일을 읽으므로 변경 사항은 `systemctl restart hermes-agent`를 통해 적용됩니다. 컨테이너를 다시 생성할 필요가 없습니다.

### sops-nix

```nix
{
  sops = {
    defaultSopsFile = ./secrets/hermes.yaml;
    age.keyFile = "/home/user/.config/sops/age/keys.txt";
    secrets."hermes-env" = { format = "yaml"; };
  };

  services.hermes-agent.environmentFiles = [
    config.sops.secrets."hermes-env".path
  ];
}
```

비밀 파일에는 키-값 쌍이 포함되어 있습니다.

```yaml
# secrets/hermes.yaml (encrypted with sops)
hermes-env: |
    OPENROUTER_API_KEY=sk-or-...
    TELEGRAM_BOT_TOKEN=123456:ABC...
    ANTHROPIC_API_KEY=sk-ant-...
```

### 에이지닉스

```nix
{
  age.secrets.hermes-env.file = ./secrets/hermes-env.age;

  services.hermes-agent.environmentFiles = [
    config.age.secrets.hermes-env.path
  ];
}
```

### OAuth/인증 시딩

OAuth가 필요한 플랫폼(예: Discord)의 경우 `authFile`을 사용하여 첫 번째 배포 시 자격 증명을 시드합니다.

```nix
{
  services.hermes-agent = {
    authFile = config.sops.secrets."hermes/auth.json".path;
    # authFileForceOverwrite = true;  # overwrite on every activation
  };
}
```

파일은 `auth.json`이 아직 존재하지 않는 경우에만 복사됩니다(`authFileForceOverwrite = true` 제외). 런타임 OAuth 토큰 새로 고침은 상태 디렉터리에 기록되고 재구축 시에도 보존됩니다.

---

## 서류

`documents` 옵션은 에이전트의 작업 디렉터리(에이전트가 해당 작업 영역으로 읽는 `workingDirectory`)에 파일을 설치합니다. Hermes는 규칙에 따라 특정 파일 이름을 찾습니다.

- **`USER.md`** — 에이전트가 상호작용하는 사용자에 대한 컨텍스트입니다.
- 여기에 배치한 다른 모든 파일은 에이전트에 작업공간 파일로 표시됩니다.

에이전트 ID 파일은 별개입니다. Hermes는 NixOS 모듈에서 `${services.hermes-agent.stateDir}/.hermes/SOUL.md`인 `$HERMES_HOME/SOUL.md`에서 기본 `SOUL.md`을 로드합니다. `documents`에 `SOUL.md`을 넣으면 작업 공간 파일만 생성되고 기본 페르소나 파일은 대체되지 않습니다.

```nix
{
  services.hermes-agent.documents = {
    "USER.md" = ./documents/USER.md;  # path reference, copied from Nix store
  };
}
```

값은 인라인 문자열 또는 경로 참조일 수 있습니다. 파일은 모든 `nixos-rebuild switch`에 설치됩니다.

---

## MCP 서버 {#mcp-servers}

`mcpServers` 옵션은 [MCP(모델 컨텍스트 프로토콜)](https://modelcontextprotocol.io) 서버를 선언적으로 구성합니다. 각 서버는 **stdio**(로컬 명령) 또는 **HTTP**(원격 URL) 전송을 사용합니다.

### Stdio Transport(로컬 서버)

```nix
{
  services.hermes-agent.mcpServers = {
    filesystem = {
      command = "npx";
      args = [ "-y" "@modelcontextprotocol/server-filesystem" "/data/workspace" ];
    };
    github = {
      command = "npx";
      args = [ "-y" "@modelcontextprotocol/server-github" ];
      env.GITHUB_PERSONAL_ACCESS_TOKEN = "\${GITHUB_TOKEN}"; # resolved from .env
    };
  };
}
```

:::tip
`env` 값의 환경 변수는 런타임 시 `$HERMES_HOME/.env`에서 확인됩니다. 비밀을 삽입하려면 `environmentFiles`를 사용하세요. 절대로 Nix 구성에 직접 토큰을 넣지 마세요.
:::

### HTTP 전송(원격 서버)

```nix
{
  services.hermes-agent.mcpServers.remote-api = {
    url = "https://mcp.example.com/v1/mcp";
    headers.Authorization = "Bearer \${MCP_REMOTE_API_KEY}";
    timeout = 180;
  };
}
```

### OAuth를 사용한 HTTP 전송

OAuth 2.1을 사용하는 서버에 대해 `auth = "oauth"`을 설정합니다. Hermes는 메타데이터 검색, 동적 클라이언트 등록, 토큰 교환 및 자동 새로 고침 등 전체 PKCE 흐름을 구현합니다.

```nix
{
  services.hermes-agent.mcpServers.my-oauth-server = {
    url = "https://mcp.example.com/mcp";
    auth = "oauth";
  };
}
```

토큰은 `$HERMES_HOME/mcp-tokens/<server-name>.json`에 저장되며 다시 시작하고 다시 빌드해도 지속됩니다.

<details>
<summary><strong>헤드리스 서버의 초기 OAuth 인증</strong></summary>

첫 번째 OAuth 승인에는 브라우저 기반 동의 흐름이 필요합니다. 헤드리스 배포에서 Hermes는 브라우저를 여는 대신 인증 URL을 stdout/logs에 인쇄합니다.

**옵션 A: 대화형 부트스트랩** — `docker exec`(컨테이너) 또는 `sudo -u hermes`(네이티브)을 통해 흐름을 한 번 실행합니다.

```bash
# Container mode
docker exec -it hermes-agent \
  hermes mcp add my-oauth-server --url https://mcp.example.com/mcp --auth oauth

# Native mode
sudo -u hermes HERMES_HOME=/var/lib/hermes/.hermes \
  hermes mcp add my-oauth-server --url https://mcp.example.com/mcp --auth oauth
```

컨테이너는 `--network=host`을 사용하므로 호스트 브라우저에서 `127.0.0.1`의 OAuth 콜백 리스너에 연결할 수 있습니다.

**옵션 B: 사전 시드 토큰** — 워크스테이션에서 흐름을 완료한 후 토큰을 복사합니다.

```bash
hermes mcp add my-oauth-server --url https://mcp.example.com/mcp --auth oauth
scp ~/.hermes/mcp-tokens/my-oauth-server{,.client}.json \
    server:/var/lib/hermes/.hermes/mcp-tokens/
# Ensure: chown hermes:hermes, chmod 0600
```

</details>

### 샘플링(서버에서 시작된 LLM 요청)

일부 MCP 서버는 에이전트로부터 LLM 완료를 요청할 수 있습니다.

```nix
{
  services.hermes-agent.mcpServers.analysis = {
    command = "npx";
    args = [ "-y" "analysis-server" ];
    sampling = {
      enabled = true;
      model = "google/gemini-3-flash";
      max_tokens_cap = 4096;
      timeout = 30;
      max_rpm = 10;
    };
  };
}
```

---

## 관리 모드

hermes가 NixOS 모듈을 통해 실행되면 다음 CLI 명령이 **차단**되며 `configuration.nix`을 가리키는 설명 오류가 표시됩니다.

| 차단된 명령 | 왜 |
|---|---|
| `hermes setup` | 구성은 선언적입니다. Nix 구성 |
| `hermes config edit` | 구성은 `settings` |
| `hermes config set <key> <value>` | 구성은 `settings` |
| `hermes gateway install` | systemd 서비스는 NixOS |
| `hermes gateway uninstall` | systemd 서비스는 NixOS |

이는 Nix가 선언한 내용과 디스크에 있는 내용 사이의 드리프트를 방지합니다. 감지에는 두 가지 신호가 사용됩니다.

1. **`HERMES_MANAGED=true`** 환경 변수 — systemd 서비스에 의해 설정되며 게이트웨이 프로세스에 표시됩니다.
2. **`.managed` 마커 파일** `HERMES_HOME` — 활성화 스크립트에 의해 설정되며 대화형 셸에 표시됩니다(예: `docker exec -it hermes-agent hermes config set ...`도 차단됨)

구성을 변경하려면 Nix 구성을 편집하고 `sudo nixos-rebuild switch`을 실행하세요.

---

## 컨테이너 아키텍처

:::info
이 섹션은 `container.enable = true`을 사용하는 경우에만 관련됩니다. 기본 모드 배포의 경우 건너뜁니다.
:::

컨테이너 모드가 활성화되면 hermes는 호스트에서 읽기 전용으로 탑재된 Nix 빌드 바이너리를 사용하여 영구 Ubuntu 컨테이너 내에서 실행됩니다.

```
Host                                    Container
────                                    ─────────
/nix/store/...-hermes-agent-0.1.0  ──►  /nix/store/... (ro)
~/.hermes -> /var/lib/hermes/.hermes       (symlink bridge, per hostUsers)
/var/lib/hermes/                    ──►  /data/          (rw)
  ├── current-package -> /nix/store/...    (symlink, updated each rebuild)
  ├── .gc-root -> /nix/store/...           (prevents nix-collect-garbage)
  ├── .container-identity                  (sha256 hash, triggers recreation)
  ├── .hermes/                             (HERMES_HOME)
  │   ├── .env                             (merged from environment + environmentFiles)
  │   ├── config.yaml                      (Nix-generated, deep-merged by activation)
  │   ├── .managed                         (marker file)
  │   ├── .container-mode                  (routing metadata: backend, exec_user, etc.)
  │   ├── state.db, sessions/, memories/   (runtime state)
  │   └── mcp-tokens/                      (OAuth tokens for MCP servers)
  ├── home/                                ──►  /home/hermes    (rw)
  └── workspace/                           (agent working directory)
      ├── SOUL.md                          (from documents option)
      └── (agent-created files)

Container writable layer (apt/pip/npm):   /usr, /usr/local, /tmp
```

Nix 빌드 바이너리는 `/nix/store`이 바인드 마운트되어 있기 때문에 Ubuntu 컨테이너 내에서 작동합니다. 자체 인터프리터와 모든 종속성을 가져오므로 컨테이너의 시스템 라이브러리에 의존하지 않습니다. 컨테이너 진입점은 `current-package` 심볼릭 링크(`/data/current-package/bin/hermes gateway run --replace`)를 통해 확인됩니다. `nixos-rebuild switch`에서는 심볼릭 링크만 업데이트되며 컨테이너는 계속 실행됩니다.

### 무엇이 지속되는지

| 이벤트 | 컨테이너가 다시 생성되었나요? | `/data`(상태) | `/home/hermes` | 쓰기 가능한 레이어(`apt`/`pip`/`npm`) |
|---|---|---|---|---|
| `systemctl restart hermes-agent` | 아니요 | 지속 | 지속 | 지속 |
| `nixos-rebuild switch`(코드 변경) | 아니요(심볼릭 링크 업데이트됨) | 지속 | 지속 | 지속 |
| 호스트 재부팅 | 아니요 | 지속 | 지속 | 지속 |
| `nix-collect-garbage` | 아니요(GC 루트) | 지속 | 지속 | 지속 |
| 이미지 변경(`container.image`) | **예** | 지속 | 지속 | **잃어버린** |
| 볼륨/옵션 변경 | **예** | 지속 | 지속 | **잃어버린** |
| `environment`/`environmentFiles` 변경 | 아니요 | 지속 | 지속 | 지속 |

컨테이너는 **ID 해시**가 변경될 때만 다시 생성됩니다. 해시에는 스키마 버전, 이미지, `extraVolumes`, `extraOptions` 및 진입점 스크립트가 포함됩니다. 환경 변수, 설정, 문서 또는 hermes 패키지 자체에 대한 변경 사항은 재생성을 트리거하지 **않습니다**.

:::warning 쓰기 가능한 레이어 손실
ID 해시가 변경되면(이미지 업그레이드, 새 볼륨, 새 컨테이너 옵션) 컨테이너가 삭제되고 `container.image`의 새로운 풀에서 다시 생성됩니다. 쓰기 가능한 레이어의 모든 `apt install`, `pip install` 또는 `npm install` 패키지는 손실됩니다. `/data` 및 `/home/hermes`의 상태는 유지됩니다(바인드 마운트).

에이전트가 특정 패키지에 의존하는 경우 해당 패키지를 사용자 정의 이미지(`container.image = "my-registry/hermes-base:latest"`)로 베이킹하거나 에이전트의 SOUL.md에 설치를 스크립팅하는 것을 고려하세요.
:::

### GC 루트 보호

`preStart` 스크립트는 현재 hermes 패키지를 가리키는 `${stateDir}/.gc-root`에 GC 루트를 생성합니다. 이렇게 하면 `nix-collect-garbage`가 실행 중인 바이너리를 제거하는 것을 방지할 수 있습니다. GC 루트가 손상된 경우 서비스를 다시 시작하면 다시 생성됩니다.

---

## 플러그인

NixOS 모듈은 선언적 플러그인 설치를 지원하므로 필수 `hermes plugins install`이 필요하지 않습니다.

### 디렉터리 플러그인(`extraPlugins`)

`plugin.yaml` + `__init__.py`이 포함된 소스 트리인 플러그인의 경우(예: [hermes-lcm](https://github.com/stephenschoettler/hermes-lcm)):

```nix
services.hermes-agent.extraPlugins = [
  (pkgs.fetchFromGitHub {
    owner = "stephenschoettler";
    repo = "hermes-lcm";
    rev = "v0.7.0";
    hash = "sha256-...";
  })
];
```

플러그인은 활성화 시 `$HERMES_HOME/plugins/`에 심볼릭 링크됩니다. Hermes는 일반 디렉토리 검색을 통해 이를 발견합니다. 목록에서 플러그인을 제거하고 `nixos-rebuild switch`을 실행하면 심볼릭 링크가 제거됩니다.

### 진입점 플러그인(`extraPythonPackages`)

`[project.entry-points."hermes_agent.plugins"]`(예: [rtk-hermes](https://github.com/ogallotti/rtk-hermes))을 통해 등록하는 pip 패키지 플러그인의 경우:

```nix
services.hermes-agent.extraPythonPackages = [
  (pkgs.python312Packages.buildPythonPackage {
    pname = "rtk-hermes";
    version = "1.0.0";
    src = pkgs.fetchFromGitHub {
      owner = "ogallotti";
      repo = "rtk-hermes";
      rev = "v1.0.0";
      hash = "sha256-...";
    };
    format = "pyproject";
    build-system = [ pkgs.python312Packages.setuptools ];
  })
];
```

패키지의 `site-packages`이 hermes 래퍼의 PYTHONPATH에 추가됩니다. `importlib.metadata`은 세션 시작 시 진입점을 검색합니다.

### 선택적 종속성 그룹(`extraDependencyGroups`)

hermes-agent의 `pyproject.toml`에 선언된 선택적 추가 항목의 경우 `extraDependencyGroups`을 사용하여 빌드 시 봉인된 venv에 포함합니다. 이는 기본 `[all]` 세트에 없는 추가 항목에 필요합니다. Nix에서는 읽기 전용 저장소에 런타임을 설치할 수 없습니다.

```nix
# Enable Discord, Telegram, Slack
services.hermes-agent.extraDependencyGroups = [ "messaging" ];
```

```nix
# Enable a memory provider
services.hermes-agent = {
  extraDependencyGroups = [ "hindsight" ];
  settings.memory.provider = "hindsight";
};
```

이는 핵심 종속성과 함께 uv에 의해 해결됩니다. PYTHONPATH 패치가 없고 충돌 위험이 없습니다. 사용 가능한 그룹:

| 그룹 | 그것이 가능하게 하는 것 |
|-------|-----------------|
| `messaging` | 디스코드, 텔레그램, 슬랙 |
| `matrix` | 매트릭스/요소(암호화된 mautrix, Linux에만 해당) |
| `dingtalk` | 딩톡 |
| `feishu` | 페이슈/종달새 |
| `voice` | 로컬 음성-텍스트 변환(더 빠른 속삭임) |
| `edge-tts` | 엣지 TTS 제공자 |
| `tts-premium` | 일레븐랩스 TTS |
| `anthropic` | Native Anthropic SDK(OpenRouter를 통해 필요하지 않음) |
| `bedrock` | AWS 기반암(boto3) |
| `azure-identity` | Azure Entra ID 인증 |
| `honcho` | 혼초 메모리 공급자 |
| `hindsight` | 돌이켜보면 기억 제공자 |
| `modal` | 모달 터미널 백엔드 |
| `daytona` | 데이토나 터미널 백엔드 |
| `exa` | 엑사 웹 검색 |
| `firecrawl` | Firecrawl 웹 검색 |
| `fal` | FAL 이미지 생성 |

또는 추가 구성 대신 사전 구축된 `#messaging` 또는 `#full` 플레이크 패키지를 사용하세요([빠른 시작](#quick-start-any-nix-user) 참조).

**사용 시기:**

| 필요 | 옵션 |
|------|--------|
| pyproject.toml 선택적 추가 활성화 | `extraDependencyGroups` |
| pyproject.toml에 없는 외부 Python 플러그인 추가 | `extraPythonPackages` |
| 시스템 바이너리(pandoc, jq 등) 추가 | `extraPackages` |
| 디렉터리 기반 플러그인 소스 트리 추가 | `extraPlugins` |

### 둘 다 결합

타사 Python 종속성이 있는 디렉터리 플러그인에는 두 가지 옵션이 모두 필요합니다.

```nix
services.hermes-agent = {
  extraPlugins = [ my-plugin-src ];          # plugin source
  extraPythonPackages = [ pkgs.python312Packages.redis ];  # its Python dep
  extraPackages = [ pkgs.redis ];            # system binary it needs
};
```

### 오버레이 사용

외부 플레이크는 패키지를 직접 재정의할 수 있습니다.

```nix
{
  inputs.hermes-agent.url = "github:NousResearch/hermes-agent";
  outputs = { hermes-agent, nixpkgs, ... }: {
    nixpkgs.overlays = [ hermes-agent.overlays.default ];
    # Then:
    #   pkgs.hermes-agent.override { extraPythonPackages = [...]; }
    #   pkgs.hermes-agent.override { extraDependencyGroups = [ "hindsight" ]; }
  };
}
```

### 플러그인 구성

`config.yaml`에서 플러그인을 활성화해야 합니다. 선언적 설정을 통해 추가하십시오.

```nix
services.hermes-agent.settings.plugins.enabled = [
  "hermes-lcm"
  "rtk-rewrite"
];
```

:::note
빌드 시간 충돌 검사는 플러그인 패키지가 핵심 hermes 종속성을 숨기는 것을 방지합니다. 플러그인이 봉인된 Venv에 이미 패키지를 제공하는 경우 `nixos-rebuild`은 명확한 오류와 함께 실패합니다.
:::

---

## 개발

### 개발 셸

플레이크는 Python 3.12, uv, Node.js 및 모든 런타임 도구가 포함된 개발 셸을 제공합니다.

```bash
cd hermes-agent
nix develop

# Shell provides:
#   - Python 3.12 + uv (deps installed into .venv on first entry)
#   - Node.js 26, ripgrep, git, openssh, ffmpeg on PATH
#   - Stamp-file optimization: re-entry is near-instant if deps haven't changed

hermes setup
hermes chat
```

### direnv (권장)

포함된 `.envrc`은 dev 셸을 자동으로 활성화합니다.

```bash
cd hermes-agent
direnv allow    # one-time
# Subsequent entries are near-instant (stamp file skips dep install)
```

### 플레이크 수표

플레이크에는 CI 및 로컬에서 실행되는 빌드 시간 확인이 포함되어 있습니다.

```bash
# Run all checks
nix flake check

# Individual checks
nix build .#checks.x86_64-linux.package-contents   # binaries exist + version
nix build .#checks.x86_64-linux.entry-points-sync  # pyproject.toml ↔ Nix package sync
nix build .#checks.x86_64-linux.cli-commands        # gateway/config subcommands
nix build .#checks.x86_64-linux.managed-guard       # HERMES_MANAGED blocks mutation
nix build .#checks.x86_64-linux.bundled-skills      # skills present in package
nix build .#checks.x86_64-linux.config-roundtrip    # merge script preserves user keys
```

<details>
<summary><strong>각 확인 사항</strong></summary>

| 확인 | 테스트 대상 |
|---|---|
| `package-contents` | `hermes` 및 `hermes-agent` 바이너리가 존재하며 `hermes version`이 실행됩니다. |
| `entry-points-sync` | `pyproject.toml`의 모든 `[project.scripts]` 항목에는 Nix 패키지 |
| `cli-commands` | `hermes --help`은 `gateway` 및 `config` 하위 명령을 노출합니다 |
| `managed-guard` | `HERMES_MANAGED=true hermes config set ...`은 NixOS 오류를 인쇄합니다 |
| `bundled-skills` | Skills 디렉터리가 존재하고 SKILL.md 파일이 포함되어 있으며 `HERMES_BUNDLED_SKILLS`이 래퍼에 설정되어 있습니다 |
| `config-roundtrip` | 7가지 병합 시나리오: 새로 설치, Nix 재정의, 사용자 키 보존, 혼합 병합, MCP 추가 병합, 중첩된 깊은 병합, 멱등성 |

</details>

---

## 옵션 참조

### 핵심

| 옵션 | 유형 | 기본값 | 설명 |
|---|---|---|---|
| `enable` | `bool` | `false` | hermes-agent 서비스 활성화 |
| `package` | `package` | `hermes-agent` | 사용할 hermes-agent 패키지 |
| `user` | `str` | `"hermes"` | 시스템 사용자 |
| `group` | `str` | `"hermes"` | 시스템 그룹 |
| `createUser` | `bool` | `true` | 사용자/그룹 자동 생성 |
| `stateDir` | `str` | `"/var/lib/hermes"` | 상태 디렉터리(`HERMES_HOME` 상위) |
| `workingDirectory` | `str` | `"${stateDir}/workspace"` | 에이전트 작업 디렉터리 |
| `addToSystemPackages` | `bool` | `false` | `hermes` CLI를 시스템 PATH에 추가하고 `HERMES_HOME` 시스템 전체 설정 |

### 구성

| 옵션 | 유형 | 기본값 | 설명 |
|---|---|---|---|
| `settings` | `attrs`(깊은 병합) | `{}` | `config.yaml`로 렌더링된 선언적 구성입니다. 임의 중첩을 지원합니다. 여러 정의는 `lib.recursiveUpdate`를 통해 병합됩니다 |
| `configFile` | `null` 또는 `path` | `null` | 기존 `config.yaml`의 경로입니다. 설정된 경우 `settings`를 완전히 재정의합니다 |

### 비밀 및 환경

| 옵션 | 유형 | 기본값 | 설명 |
|---|---|---|---|
| `environmentFiles` | `listOf str` | `[]` | 비밀이 포함된 env 파일의 경로입니다. 활성화 시 `$HERMES_HOME/.env`에 병합됨 |
| `environment` | `attrsOf str` | `{}` | 비밀이 아닌 환경 변수. **Nix 스토어에 표시됨** — 여기에 비밀을 입력하지 마세요 |
| `authFile` | `null` 또는 `path` | `null` | OAuth 자격 증명 시드. 처음 배포 시에만 복사됨 |
| `authFileForceOverwrite` | `bool` | `false` | 활성화 시 항상 `authFile`의 `auth.json`을 덮어쓰세요 |

### 서류

| 옵션 | 유형 | 기본값 | 설명 |
|---|---|---|---|
| `documents` | `attrsOf (either str path)` | `{}` | 작업공간 파일. 키는 파일 이름이고 값은 인라인 문자열 또는 경로입니다. 활성화 시 `workingDirectory`에 설치됨 |

### MCP 서버

| 옵션 | 유형 | 기본값 | 설명 |
|---|---|---|---|
| `mcpServers` | `attrsOf submodule` | `{}` | `settings.mcp_servers`에 병합된 MCP 서버 정의 |
| `mcpServers.<name>.command` | `null` 또는 `str` | `null` | 서버 명령(stdio 전송) |
| `mcpServers.<name>.args` | `listOf str` | `[]` | 명령 인수 |
| `mcpServers.<name>.env` | `attrsOf str` | `{}` | 서버 프로세스의 환경 변수 |
| `mcpServers.<name>.url` | `null` 또는 `str` | `null` | 서버 엔드포인트 URL(HTTP/StreamableHTTP 전송) |
| `mcpServers.<name>.headers` | `attrsOf str` | `{}` | HTTP 헤더, 예: `Authorization` |
| `mcpServers.<name>.auth` | `null` 또는 `"oauth"` | `null` | 인증 방법. `"oauth"`는 OAuth 2.1 PKCE를 활성화합니다 |
| `mcpServers.<name>.enabled` | `bool` | `true` | 이 서버 활성화 또는 비활성화 |
| `mcpServers.<name>.timeout` | `null` 또는 `int` | `null` | 도구 호출 시간 초과(초)(기본값: 120) |
| `mcpServers.<name>.connect_timeout` | `null` 또는 `int` | `null` | 연결 시간 초과(초)(기본값: 60) |
| `mcpServers.<name>.tools` | `null` 또는 `submodule` | `null` | 도구 필터링(`include`/`exclude` 목록) |
| `mcpServers.<name>.sampling` | `null` 또는 `submodule` | `null` | 서버에서 시작한 LLM 요청에 대한 샘플링 구성 |

### 서비스 행동

| 옵션 | 유형 | 기본값 | 설명 |
|---|---|---|---|
| `extraArgs` | `listOf str` | `[]` | `hermes gateway`에 대한 추가 인수 |
| `extraPackages` | `listOf package` | `[]` | 에이전트가 사용할 수 있는 추가 패키지입니다. hermes 사용자의 사용자별 프로필에 추가되어 터미널 명령, 기술 및 cron 작업 모두에서 볼 수 있습니다 |
| `extraPlugins` | `listOf package` | `[]` | `$HERMES_HOME/plugins/`에 심볼릭 링크하기 위한 디렉토리 플러그인 패키지입니다. 각각에는 `plugin.yaml` |
| `extraPythonPackages` | `listOf package` | `[]` | 진입점 플러그인 검색을 위해 PYTHONPATH에 Python 패키지가 추가되었습니다. `python312Packages`로 빌드 |
| `extraDependencyGroups` | `listOf str` | `[]` | pyproject.toml 봉인된 venv에 포함할 선택적 추가 항목(예: `["hindsight"]`). uv에 의해 해결 — 충돌 없음 |
| `restart` | `str` | `"always"` | systemd `Restart=` 정책 |
| `restartSec` | `int` | `5` | systemd `RestartSec=` 값 |

### 컨테이너

| 옵션 | 유형 | 기본값 | 설명 |
|---|---|---|---|
| `container.enable` | `bool` | `false` | OCI 컨테이너 모드 활성화 |
| `container.backend` | `enum ["docker" "podman"]` | `"docker"` | 컨테이너 런타임 |
| `container.image` | `str` | `"ubuntu:24.04"` | 기본 이미지(런타임 시 가져옴) |
| `container.extraVolumes` | `listOf str` | `[]` | 추가 볼륨 마운트(`host:container:mode`) |
| `container.extraOptions` | `listOf str` | `[]` | `docker create`에 전달된 추가 인수 |
| `container.hostUsers` | `listOf str` | `[]` | 서비스 stateDir에 대한 `~/.hermes` 심볼릭 링크를 받고 `hermes` 그룹에 자동으로 추가되는 대화형 사용자 |

---

## 디렉토리 레이아웃

### 기본 모드

```
/var/lib/hermes/                     # stateDir (owned by hermes:hermes, 0750)
├── .hermes/                         # HERMES_HOME
│   ├── config.yaml                  # Nix-generated (deep-merged each rebuild)
│   ├── .managed                     # Marker: CLI config mutation blocked
│   ├── .env                         # Merged from environment + environmentFiles
│   ├── auth.json                    # OAuth credentials (seeded, then self-managed)
│   ├── gateway.pid
│   ├── state.db
│   ├── mcp-tokens/                  # OAuth tokens for MCP servers
│   ├── sessions/
│   ├── memories/
│   ├── skills/
│   ├── cron/
│   └── logs/
├── home/                            # Agent HOME
└── workspace/                       # Agent working directory
    ├── SOUL.md                      # From documents option
    └── (agent-created files)
```

### 컨테이너 모드 {#container-mode}

동일한 레이아웃, 컨테이너에 마운트됨:

| 컨테이너 경로 | 호스트 경로 | 모드 | 메모 |
|---|---|---|---|
| `/nix/store` | `/nix/store` | `ro` | 헤르메스 바이너리 + 모든 Nix deps |
| `/data` | `/var/lib/hermes` | `rw` | 모든 상태, 구성, 작업공간 |
| `/home/hermes` | `${stateDir}/home` | `rw` | 영구 에이전트 홈 — `pip install --user`, 도구 캐시 |
| `/usr`, `/usr/local`, `/tmp` | (쓰기 가능한 레이어) | `rw` | `apt`/`pip`/`npm` 설치 — 다시 시작해도 지속되고 재생성 시 손실됨 |

---

## 업데이트 중

```bash
# Update the flake input (run from the directory containing flake.nix)
cd /etc/nixos && nix flake update hermes-agent

# Rebuild
sudo nixos-rebuild switch
```

컨테이너 모드에서는 `current-package` 심볼릭 링크가 업데이트되고 에이전트는 다시 시작할 때 새 바이너리를 선택합니다. 컨테이너 재생성이나 설치된 패키지 손실이 없습니다.

---

## 문제 해결

:::tip 포드맨 사용자
아래의 모든 `docker` 명령은 `podman`과 동일하게 작동합니다. `container.backend = "podman"`를 설정한 경우 이에 따라 대체하세요.
:::

### 서비스 로그

```bash
# Both modes use the same systemd unit
journalctl -u hermes-agent -f

# Container mode: also available directly
docker logs -f hermes-agent
```

### 컨테이너 검사

```bash
systemctl status hermes-agent
docker ps -a --filter name=hermes-agent
docker inspect hermes-agent --format='{{.State.Status}}'
docker exec -it hermes-agent bash
docker exec hermes-agent readlink /data/current-package
docker exec hermes-agent cat /data/.container-identity
```

### 포스 컨테이너 레크리에이션

쓰기 가능한 레이어를 재설정해야 하는 경우(새로운 Ubuntu):

```bash
sudo systemctl stop hermes-agent
docker rm -f hermes-agent
sudo rm /var/lib/hermes/.container-identity
sudo systemctl start hermes-agent
```

### 비밀이 로드되었는지 확인

에이전트가 시작되지만 LLM 공급자로 인증할 수 없는 경우 `.env` 파일이 올바르게 병합되었는지 확인하세요.

```bash
# Native mode
sudo -u hermes cat /var/lib/hermes/.hermes/.env

# Container mode
docker exec hermes-agent cat /data/.hermes/.env
```

### GC 루트 확인

```bash
nix-store --query --roots $(docker exec hermes-agent readlink /data/current-package)
```

### 일반적인 문제

| 증상 | 원인 | 수정 |
|---|---|---|
| `Cannot save configuration: managed by NixOS` | CLI 가드 활성 | `configuration.nix` 및 `nixos-rebuild switch` 편집 |
| `No adapter available for discord` (또는 텔레그램/슬랙) | 봉인된 Nix Venv에서 메시징 저장소가 누락됨 | `#messaging` 변형: `nix profile install ...#messaging`을(를) 설치합니다. NixOS 모듈의 경우: `extraDependencyGroups = [ "messaging" ]`. `FeatureUnavailable`의 경우 `journalctl -u hermes-agent`를 확인하고 기본 오류는 `requirements not met`을 확인하세요. |
| 컨테이너가 예기치 않게 다시 생성됨 | `extraVolumes`, `extraOptions` 또는 `image` 변경됨 | 예상됨 - 쓰기 가능한 레이어 재설정. 패키지 다시 설치 또는 사용자 정의 이미지 사용 |
| `hermes version`은(는) 이전 버전을 표시합니다 | 컨테이너가 다시 시작되지 않음 | `systemctl restart hermes-agent` |
| `/var/lib/hermes`에 대한 권한이 거부되었습니다 | 상태 디렉토리는 `0750 hermes:hermes`입니다 | `docker exec` 또는 `sudo -u hermes` 사용 |
| `nix-collect-garbage`에서 헤르메스를 제거했습니다 | GC 루트 누락 | 서비스 다시 시작(preStart가 GC 루트 다시 생성) |
| `no container with name or ID "hermes-agent"` (팟맨) | 일반 사용자에게 표시되지 않는 Podman 루트풀 컨테이너 | podman에 대한 비밀번호 없는 sudo 추가([컨테이너 모드](#container-mode) 섹션 참조) |
| `unable to find user hermes` | 컨테이너가 여전히 시작 중입니다(진입점이 아직 사용자를 생성하지 않았습니다) | 몇 초 정도 기다렸다가 다시 시도하십시오. CLI가 자동으로 다시 시도합니다 |
| `extraPackages`을 통해 추가된 도구가 터미널에 없습니다 | 사용자별 프로필을 업데이트하려면 `nixos-rebuild switch`이 필요합니다. | 다시 빌드하고 다시 시작하세요. `nixos-rebuild switch && systemctl restart hermes-agent` |
