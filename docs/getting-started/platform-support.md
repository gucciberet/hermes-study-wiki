---
sidebar_position: 2.5
title: "플랫폼 지원"
description: "Hermes Agent가 지원하는 운영 체제, 배포 방식 및 기능입니다."
---

# 플랫폼 지원

Hermes Agent는 여러 플랫폼과 배포 방식을 지원하지만, 가능한 모든 설치 방식을 지원할 수는 없습니다.

---

## 티어 1

이들에 대한 설치 및 업데이트가 중단되지 않도록 최선을 다합니다. 티어 1의 이슈 및 회귀는 최우선 과제이며 다른 플랫폼보다 우선합니다.

| OS / 아키텍처                                                               | 설치 방법                                                                                                                     | 참고                                                                                                                                                           |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **macOS** (Apple Silicon)                                                     | [Hermes Desktop](https://hermes-agent.nousresearch.com/), [`install.sh`](./installation.md#linux--macos--wsl2--android-termux) |                                                                                                                                                                |
| [**Windows 10 / 11**](../user-guide/windows-native.md) (x86_64, aarch64)      | [Hermes Desktop](https://hermes-agent.nousresearch.com/), [`install.ps1`](./installation.md#windows-native)                    | 일부 기능은 [사용할 수 없습니다](../user-guide/windows-native.md#feature-matrix).                                                                              |
| **Linux / [WSL2](../user-guide/windows-wsl-quickstart.md)** (x86_64, aarch64) | [`install.sh`](./installation.md#linux--macos--wsl2--android-termux)                                                           | 최신 Ubuntu와 WSL2에서 테스트합니다. 사용 중인 배포판에 glibc와 systemd가 있고 Filesystem Hierarchy Standard를 따르면 상당히 잘 작동할 가능성이 높습니다. |
| [**Docker Container**](../user-guide/docker.md#quick-start) (x86_64, aarch64) | [`docker pull`](../user-guide/docker.md#quick-start)                                                                           | Docker 설치에서는 `hermes update`를 지원하지 않습니다. 새 이미지를 실행하여 업데이트합니다.                                                                      |

---

## 티어 2 {#tier-2}

이 플랫폼들은 리포지토리 내에서 최선의 노력 수준으로만 유지 관리됩니다.
릴리스에서 중단될 수 있으며, 중단되더라도 신속하게 수정할 것을 약속할 수 없습니다.

이와 관련된 이슈를 수정하는 PR은 수락되지만, 티어 1 플랫폼의 문제를 수정하는 것보다 우선순위가 낮습니다.

| OS / 아키텍처                  | 설치 방법                                                               | 참고                                                                      |
| ------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Android (Termux)** (aarch64) | [`install.sh`](./installation.md#linux--macos--wsl2--android-termux) | 일부 기능은 [사용할 수 없습니다](./termux.md#known-limitations-on-phones). |
| **Nix** (MacOS, Linux, NixOS)  | [`install.sh`](./nix-setup.md)                                       | node.js 패키징 문제로 자주 중단됩니다. 행운을 빌어요~! &lt;3             |

## 지원하지 않음

이 플랫폼과 배포 방식은 지원되지 **않습니다**.
지원되는 배포 방식이나 플랫폼으로 전환할 것을 권장합니다.
현재 중단되어 있을 수 있으며, 앞으로 더 중단될 수 있습니다.
이들을 수정하는 PR은 수락되지 않으며, 호환성을 유지하는 모든 코드는 언제든 제거될 수 있습니다.

- AUR을 통한 설치(도움이 된다면 패치를 업스트림에 반영할 수 있습니다 &lt;3)
- x86 (Intel) 프로세서의 macOS
- `pypi`를 통한 설치(예: `uv tool install hermes-agent`, `pip install hermes-agent` 등)
- `brew`를 통한 설치(`brew install hermes-agent`)

지원되지 않는 배포 방식을 사용 중이라면, 지원되는 방식으로 전환하는 방법을 알아보려면 [설치 가이드](./installation.md)를 읽어 보세요.
