---
title: 플랫폼 지원
sidebar_position: 2.5
description: Hermes Agent가 지원하는 운영체제, 배포 방식 및 기능을 안내합니다.
source_path: website/docs/getting-started/platform-support.md
source_url: https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/platform-support.md
source_sha: 1791716717c92e07f449eed99eace2fec2fe5a03
source_checked_at: '2026-07-24'
---

# 플랫폼 지원

Hermes Agent는 여러 플랫폼과 배포 방식을 지원하지만, 가능한 모든 설치 방식을 지원할 수는 없습니다.

---

## Tier 1

이 등급의 설치와 업데이트는 절대 깨지지 않도록 최선을 다합니다. Tier 1의 이슈와 회귀는 최우선으로 처리하며, 다른 플랫폼보다 우선합니다.

| OS / 아키텍처 | 설치 방법 | 참고 |
| --- | --- | --- |
| **macOS**(Apple Silicon) | [Hermes Desktop](https://hermes-agent.nousresearch.com/), [`install.sh`](./installation) | |
| [**Windows 10 / 11**](https://hermes-agent.nousresearch.com/docs/user-guide/windows-native)(x86_64, aarch64) | [Hermes Desktop](https://hermes-agent.nousresearch.com/), [`install.ps1`](./installation) | 일부 기능은 [사용할 수 없습니다](https://hermes-agent.nousresearch.com/docs/user-guide/windows-native#feature-matrix). |
| **Linux / [WSL2](https://hermes-agent.nousresearch.com/docs/user-guide/windows-wsl-quickstart)**(x86_64, aarch64) | [`install.sh`](./installation) | 최신 Ubuntu와 WSL2에서 테스트합니다. 사용하는 배포판에 glibc와 systemd가 있고 Filesystem Hierarchy Standard를 따른다면 대체로 잘 작동할 가능성이 높습니다. |
| [**Docker 컨테이너**](https://hermes-agent.nousresearch.com/docs/user-guide/docker#quick-start)(x86_64, aarch64) | [`docker pull`](https://hermes-agent.nousresearch.com/docs/user-guide/docker#quick-start) | Docker 설치에서는 업데이트 명령을 지원하지 않습니다. 새 이미지를 실행해 업데이트합니다. |

---

## Tier 2

이 플랫폼은 저장소 안에서 최선의 노력(best effort) 수준으로만 관리합니다.

릴리스로 인해 동작하지 않을 수 있으며, 문제가 생겨도 신속하게 수정한다고 보장할 수 없습니다.

관련 문제를 해결하는 PR은 받지만, Tier 1 플랫폼 문제 해결보다 우선순위가 낮습니다.

| OS / 아키텍처 | 설치 방법 | 참고 |
| --- | --- | --- |
| **Android(Termux)**(aarch64) | [`install.sh`](./installation) | 일부 기능은 [사용할 수 없습니다](https://hermes-agent.nousresearch.com/docs/getting-started/termux#known-limitations-on-phones). |
| **Nix**(macOS, Linux, NixOS) | [`install.sh`](https://hermes-agent.nousresearch.com/docs/getting-started/nix-setup) | Node.js 패키징 문제로 자주 깨질 수 있습니다. 행운을 빕니다~! &lt;3 |

## 지원하지 않음

이 플랫폼과 배포 방식은 **지원하지 않습니다**.

지원하는 배포 방식이나 플랫폼으로 옮기는 것을 권장합니다.

현재 동작하지 않을 수 있고, 이후 더 자주 깨질 수도 있습니다.

이를 고치는 PR은 받지 않으며, 호환성을 유지하는 코드는 언제든 제거될 수 있습니다.

- AUR을 통한 설치(도움이 된다면 패치를 업스트림에 반영할 수 있습니다 &lt;3)
- x86(Intel) 프로세서의 macOS
- `pypi`를 통한 설치(예: `uv tool install hermes-agent`, `pip install hermes-agent` 등)
- `brew`를 통한 설치(`brew install hermes-agent`)

지원하지 않는 배포 방식을 사용 중이라면, 지원하는 방식으로 전환하는 방법은 [설치 안내](./installation)에서 확인하세요.

## 공식 원문

- [Platform Support](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support)

_공식 원문 확인일: 2026-07-24_
