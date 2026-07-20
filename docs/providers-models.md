---
title: AI 제공자와 모델 운영
---

# AI 제공자와 모델 운영

Hermes는 모델 제공자(provider)를 하나 이상 연결해야 대화와 에이전트 작업을 실행할 수 있습니다. 운영에서는 **어떤 제공자를 쓸지**, **새 모델을 어떻게 안전하게 전환할지**, **장애 때 어느 모델로 넘길지**를 분리해 관리하는 것이 핵심입니다.

## 먼저 구분할 두 명령

| 상황 | 사용할 명령 | 의미 |
| --- | --- | --- |
| 아직 연결하지 않은 제공자를 추가하거나 OAuth·엔드포인트를 설정할 때 | `hermes model` | 제공자 설정 마법사 |
| 이미 설정한 제공자·모델 사이를 대화 중 빠르게 바꿀 때 | `/model` | 현재 세션에서의 빠른 전환 |

`/model`로는 새 제공자의 인증이나 엔드포인트 설정을 끝낼 수 없습니다. 새 제공자가 필요하면 세션을 나와 `hermes model`을 실행하세요.

```bash
# 터미널에서: 제공자 추가와 기본 모델 선택
hermes model

# 채팅 중: 이미 설정한 모델로 전환
/model
```

## 기본 모델을 고정하기

설정 마법사가 일반적으로 가장 안전한 시작점입니다. 운영에서 설정을 코드처럼 검토해야 한다면 기본 제공자와 모델 식별자는 `config.yaml`에 둘 수 있습니다.

```yaml
model:
  provider: "openrouter"
  default: "anthropic/claude-sonnet-4"
```

API 키·OAuth 자격증명 같은 비밀값은 `config.yaml`이나 Git에 쓰지 말고 Hermes의 인증 흐름 또는 `~/.hermes/.env`에서 관리합니다. 모델 ID는 제공자별 카탈로그와 권한에 따라 달라질 수 있으므로, 임의의 이름을 추측하기보다 `hermes model`에서 확인하세요.

## 일시적 전환과 영구 변경

- `hermes chat --provider <제공자> --model <모델>`: 해당 실행에만 적용할 때 유용합니다.
- `model.provider`, `model.default`: 이후 기본값을 바꾸는 운영 변경입니다.
- `/model`: 이미 구성된 후보 안에서 현재 세션을 빠르게 바꿉니다.

새 모델은 먼저 비운영 프로젝트에서 도구 호출, 긴 문맥, 응답 지연을 확인한 뒤 기본값으로 승격하는 편이 좋습니다. 모델마다 지원하는 도구 호출·비전·컨텍스트 길이가 다를 수 있습니다.

## 장애 대비: 폴백 체인

기본 모델이 요청 제한, 인증 오류, 서버 오류로 실패할 때만 백업 제공자를 순서대로 시도하도록 설정할 수 있습니다.

```yaml
fallback_providers:
  - provider: openrouter
    model: anthropic/claude-sonnet-4
  - provider: anthropic
    model: claude-sonnet-4
```

폴백이 시작되면 Hermes는 대화 문맥을 유지한 채 해당 세션 안에서 제공자와 모델을 교체합니다. 체인은 항목 순서대로 시도되고, 세션마다 한 번만 활성화됩니다. 따라서 백업 모델도 실제 권한과 비용 정책을 사전에 점검해야 합니다.

## 운영 점검표

- 기본 모델뿐 아니라 폴백 항목도 실제로 사용할 수 있는가?
- gateway·cron처럼 무인 실행되는 작업에서 비용과 응답 시간이 허용 범위인가?
- 보조 작업(예: 비전·압축)에 별도 auxiliary 모델 정책이 필요한가?
- 모델 변경 뒤 `hermes doctor`와 짧은 도구 호출 테스트를 실행했는가?

## 공식 원문

- [AI Providers](https://hermes-agent.nousresearch.com/docs/integrations/providers)
- [Configuring Models](https://hermes-agent.nousresearch.com/docs/user-guide/configuring-models)
- [Fallback Providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/fallback-providers)

_공식 문서 확인일: 2026-07-21_
