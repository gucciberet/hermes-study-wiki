---
sidebar_position: 3
title: '학습 경로'
description: '경험 수준과 목표에 따라 Hermes Agent 문서를 학습하는 경로를 선택하세요.'
---

# 학습 경로

Hermes Agent는 CLI 어시스턴트, Telegram/Discord 봇, 작업 자동화, RL 훈련 등 많은 일을 할 수 있습니다. 이 페이지는 경험 수준과 달성하려는 목표에 따라 어디서 시작하고 무엇을 읽어야 할지 파악하는 데 도움이 됩니다.

:::tip 여기서 시작하세요
아직 Hermes Agent를 설치하지 않았다면 [설치 가이드](/getting-started/installation)부터 시작한 다음 [빠른 시작](/getting-started/quickstart)을 진행하세요. 아래의 모든 내용은 설치가 정상적으로 완료되었음을 전제로 합니다.
:::

:::tip 최초 제공자 설정
최초 사용자는 거의 항상 `hermes setup --portal`을 원합니다. 하나의 OAuth로 모델과 네 가지 Tool Gateway 도구(검색/이미지/TTS/브라우저)를 이용할 수 있습니다. [Nous Portal](/integrations/nous-portal)을 참조하세요.
:::

## 이 페이지 사용 방법

- **수준을 알고 있나요?** [경험 수준 표](#경험-수준별)로 이동하여 자신의 단계에 맞는 읽기 순서를 따르세요.
- **구체적인 목표가 있나요?** [사용 사례별](#사용-사례별)로 건너뛰어 일치하는 시나리오를 찾으세요.
- **그냥 둘러보고 있나요?** Hermes Agent가 할 수 있는 모든 기능의 간략한 개요는 [주요 기능](#주요-기능-한눈에-보기) 표에서 확인하세요.

## 경험 수준별

| 수준 | 목표 | 권장 읽기 자료 | 예상 소요 시간 |
|---|---|---|---|
| **초급** | 실행을 시작하고, 기본 대화를 나누며, 내장 도구 사용하기 | [설치](/getting-started/installation) → [빠른 시작](/getting-started/quickstart) → [CLI 사용법](/user-guide/cli) → [구성](/user-guide/configuration) | 약 1시간 |
| **중급** | 메시징 봇을 설정하고, 메모리, cron 작업, 스킬과 같은 고급 기능 사용하기 | [세션](/user-guide/sessions) → [메시징](/user-guide/messaging) → [도구](/user-guide/features/tools) → [스킬](/user-guide/features/skills) → [메모리](/user-guide/features/memory) → [Cron](/user-guide/features/cron) | 약 2–3시간 |
| **고급** | 사용자 지정 도구를 만들고, 스킬을 생성하고, RL로 모델을 훈련하고, 프로젝트에 기여하기 | [아키텍처](/developer-guide/architecture) → [도구 추가](/developer-guide/adding-tools) → [스킬 생성](/developer-guide/creating-skills) → [기여하기](/developer-guide/contributing) | 약 4–6시간 |

## 사용 사례별

하고 싶은 일에 맞는 시나리오를 선택하세요. 각 항목은 읽어야 할 순서대로 관련 문서로 연결됩니다.

### "CLI 코딩 어시스턴트를 사용하고 싶습니다"

Hermes Agent를 코드 작성, 검토, 실행을 위한 대화형 터미널 어시스턴트로 사용하세요.

1. [설치](/getting-started/installation)
2. [빠른 시작](/getting-started/quickstart)
3. [CLI 사용법](/user-guide/cli)
4. [코드 실행](/user-guide/features/code-execution)
5. [컨텍스트 파일](/user-guide/features/context-files)
6. [팁과 요령](/guides/tips)

:::tip
컨텍스트 파일로 파일을 대화에 직접 전달하세요. Hermes Agent는 프로젝트의 코드를 읽고, 편집하고, 실행할 수 있습니다.
:::

### "Telegram/Discord 봇을 사용하고 싶습니다"

즐겨 사용하는 메시징 플랫폼에 Hermes Agent를 봇으로 배포하세요.

1. [설치](/getting-started/installation)
2. [구성](/user-guide/configuration)
3. [메시징 개요](/user-guide/messaging)
4. [Telegram 설정](/user-guide/messaging/telegram)
5. [Discord 설정](/user-guide/messaging/discord)
6. [음성 모드](/user-guide/features/voice-mode)
7. [Hermes에서 음성 모드 사용](/guides/use-voice-mode-with-hermes)
8. [보안](/user-guide/security)

전체 프로젝트 예시는 다음을 참조하세요:
- [일일 브리핑 봇](/guides/daily-briefing-bot)
- [팀 Telegram 어시스턴트](/guides/team-telegram-assistant)

### "작업을 자동화하고 싶습니다"

반복 작업을 예약하고, 배치 작업을 실행하거나, 에이전트 작업을 함께 연결하세요.

1. [빠른 시작](/getting-started/quickstart)
2. [Cron 예약](/user-guide/features/cron)
3. [배치 처리](/user-guide/features/batch-processing)
4. [위임](/user-guide/features/delegation)
5. [훅](/user-guide/features/hooks)

:::tip
Cron 작업으로 Hermes Agent가 사용자가 없어도 일정에 따라 일일 요약, 정기 점검, 자동 보고서와 같은 작업을 실행할 수 있습니다.
:::

### "사용자 지정 도구/스킬을 만들고 싶습니다"

자신의 도구와 재사용 가능한 스킬 패키지로 Hermes Agent를 확장하세요.

1. [플러그인](/user-guide/features/plugins)
2. [Hermes 플러그인 만들기](/developer-guide/plugins)
3. [도구 개요](/user-guide/features/tools)
4. [스킬 개요](/user-guide/features/skills)
5. [MCP (Model Context Protocol)](/user-guide/features/mcp)
6. [아키텍처](/developer-guide/architecture)
7. [도구 추가](/developer-guide/adding-tools)
8. [스킬 생성](/developer-guide/creating-skills)

:::tip
대부분의 사용자 지정 도구 생성은 플러그인부터 시작하세요. [도구 추가](/developer-guide/adding-tools) 페이지는 일반적인 사용자/사용자 지정 도구 경로가 아닌, 내장 Hermes 코어 개발을 위한 페이지입니다.
:::

### "모델을 훈련하고 싶습니다"

Hermes Agent의 RL 훈련 파이프라인([Atropos](https://github.com/NousResearch/atropos) 기반)을 사용하여 강화 학습으로 모델 동작을 미세 조정하세요.

1. [빠른 시작](/getting-started/quickstart)
2. [구성](/user-guide/configuration)
3. [Atropos RL 환경](https://github.com/NousResearch/atropos) (외부)
4. [제공자 라우팅](/user-guide/features/provider-routing)
5. [아키텍처](/developer-guide/architecture)

:::tip
Hermes Agent가 대화와 도구 호출을 처리하는 방식의 기본을 이미 이해하고 있을 때 RL 훈련이 가장 잘 작동합니다. 처음이라면 먼저 초급 경로를 진행하세요.
:::

### "Python 라이브러리로 사용하고 싶습니다"

Hermes Agent를 자체 Python 애플리케이션에 프로그래밍 방식으로 통합하세요.

1. [설치](/getting-started/installation)
2. [빠른 시작](/getting-started/quickstart)
3. [Python 라이브러리 가이드](/guides/python-library)
4. [아키텍처](/developer-guide/architecture)
5. [도구](/user-guide/features/tools)
6. [세션](/user-guide/sessions)

## 주요 기능 한눈에 보기

무엇을 사용할 수 있는지 확실하지 않나요? 주요 기능의 빠른 디렉터리는 다음과 같습니다:

| 기능 | 하는 일 | 링크 |
|---|---|---|
| **도구** | 에이전트가 호출할 수 있는 내장 도구(파일 I/O, 검색, 셸 등) | [도구](/user-guide/features/tools) |
| **스킬** | 새 기능을 추가하는 설치 가능한 플러그인 패키지 | [스킬](/user-guide/features/skills) |
| **메모리** | 세션 전반에 걸친 영구 메모리 | [메모리](/user-guide/features/memory) |
| **컨텍스트 파일** | 파일과 디렉터리를 대화에 전달 | [컨텍스트 파일](/user-guide/features/context-files) |
| **MCP** | Model Context Protocol을 통해 외부 도구 서버에 연결 | [MCP](/user-guide/features/mcp) |
| **Cron** | 반복 에이전트 작업 예약 | [Cron](/user-guide/features/cron) |
| **위임** | 병렬 작업을 위해 하위 에이전트 생성 | [위임](/user-guide/features/delegation) |
| **코드 실행** | Hermes 도구를 프로그래밍 방식으로 호출하는 Python 스크립트 실행 | [코드 실행](/user-guide/features/code-execution) |
| **브라우저** | 웹 탐색 및 스크래핑 | [브라우저](/user-guide/features/browser) |
| **훅** | 이벤트 기반 콜백 및 미들웨어 | [훅](/user-guide/features/hooks) |
| **배치 처리** | 여러 입력을 대량으로 처리 | [배치 처리](/user-guide/features/batch-processing) |
| **제공자 라우팅** | 여러 LLM 제공자에 걸쳐 요청 라우팅 | [제공자 라우팅](/user-guide/features/provider-routing) |

## 다음에 읽을 내용

현재 위치에 따라 다음을 선택하세요:

- **방금 설치를 마쳤나요?** → 첫 대화를 실행하려면 [빠른 시작](/getting-started/quickstart)으로 이동하세요.
- **빠른 시작을 완료했나요?** → 설정을 사용자 지정하려면 [CLI 사용법](/user-guide/cli)과 [구성](/user-guide/configuration)을 읽으세요.
- **기본 사항이 익숙한가요?** → 에이전트의 모든 기능을 활용하려면 [도구](/user-guide/features/tools), [스킬](/user-guide/features/skills), [메모리](/user-guide/features/memory)를 살펴보세요.
- **팀을 위해 설정하고 있나요?** → 접근 제어와 대화 관리를 이해하려면 [보안](/user-guide/security)과 [세션](/user-guide/sessions)을 읽으세요.
- **만들 준비가 되었나요?** → 내부 구조를 이해하고 기여를 시작하려면 [개발자 가이드](/developer-guide/architecture)로 이동하세요.
- **실용적인 예시가 필요하신가요?** → 실제 프로젝트와 팁은 [가이드](/guides/tips) 섹션을 확인하세요.

:::tip
모든 것을 읽을 필요는 없습니다. 목표에 맞는 경로를 선택하고, 링크를 순서대로 따라가면 빠르게 생산성을 높일 수 있습니다. 언제든 이 페이지로 돌아와 다음 단계를 찾을 수 있습니다.
:::
