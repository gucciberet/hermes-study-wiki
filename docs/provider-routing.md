---
title: LLM 제공자 라우팅 정책
---

# LLM 제공자 라우팅 정책

제공자 라우팅(provider routing)은 **같은 모델을 제공하는 여러 하위 제공자 중 어디로 요청을 보낼지** 정하는 정책입니다. OpenRouter 또는 Nous Portal을 통해 모델을 사용할 때 비용, 최초 응답 지연, 처리량, 데이터 수집 정책을 운영 기준에 맞출 수 있습니다.

이는 기본 모델이 실패할 때 아예 다른 `provider:model`로 전환하는 폴백과 다릅니다. 라우팅은 OpenRouter/Nous Portal 뒤의 하위 제공자 선택이고, 폴백은 주 제공자·모델 실패 시의 장애 전환입니다.

## 적용되는 환경부터 확인

`provider_routing`은 OpenRouter 또는 Nous Portal을 LLM 제공자로 쓸 때만 적용됩니다. Anthropic API처럼 제공자 API에 직접 연결한 구성에는 효과가 없습니다. 설정이 없으면 집계 서비스가 비용과 가용성을 균형 있게 판단하는 기본 라우팅을 사용합니다.

## 실무용 기본 정책

`~/.hermes/config.yaml` 최상위에 `provider_routing`을 둡니다. 아래 예시는 비용 우선이되, 도구 호출 등 요청 파라미터를 모두 지원하는 하위 제공자만 쓰고 데이터 수집을 거부하는 정책입니다.

```yaml
provider_routing:
  sort: "price"
  ignore:
    - "together"
  require_parameters: true
  data_collection: "deny"
```

각 항목의 의미는 다음과 같습니다.

| 키 | 값 | 의미 |
| --- | --- | --- |
| `sort` | `price` | 가장 저렴한 제공자를 먼저 선택 |
| `sort` | `throughput` | 초당 토큰 처리량이 높은 제공자를 먼저 선택 |
| `sort` | `latency` | 첫 토큰까지 지연이 작은 제공자를 먼저 선택 |
| `only` | 제공자 slug 목록 | 목록에 든 제공자만 사용(허용 목록) |
| `ignore` | 제공자 slug 목록 | 목록의 제공자는 절대 사용하지 않음(차단 목록) |
| `order` | 제공자 slug 목록 | 지정 순서를 우선 시도하고, 목록 밖 제공자는 폴백으로 사용 |
| `require_parameters` | `true` | `tools`, `temperature`, `top_p` 등 요청 파라미터를 모두 지원하는 제공자만 선택 |
| `data_collection` | `allow` 또는 `deny` | 프롬프트 학습 활용 허용 여부 |

`only`와 `ignore`에 쓰는 이름은 OpenRouter에 표시되는 소문자 provider slug를 사용해야 합니다.

## 세 가지 운영 패턴

### 대화형 서비스에서 응답 지연 줄이기

```yaml
provider_routing:
  sort: "latency"
  require_parameters: true
```

도구 호출이 필요한 에이전트 서비스에서는 `require_parameters: true`가 중요합니다. 이를 생략하면 제공자가 일부 파라미터를 조용히 누락할 가능성이 있습니다.

### 규정상 허용된 제공자만 사용하기

```yaml
provider_routing:
  only:
    - "anthropic"
    - "google"
  data_collection: "deny"
```

이 구성은 모델명만 고정하는 것보다 강한 제약입니다. 단, 허용 목록의 모든 제공자가 일시적으로 불가하면 집계 서비스에 선택지가 없어 요청이 실패할 수 있으므로 가용성과 계약 범위를 함께 검토하세요.

### 선호 순서는 지키되 장애 여지 남기기

```yaml
provider_routing:
  order:
    - "anthropic"
    - "google"
  require_parameters: true
```

`order`에 없는 제공자는 배제되지 않고 후순위 후보로 남습니다. 완전한 고정이 목적이면 `only`를 사용하고, 우선순위와 가용성을 함께 얻고 싶으면 `order`를 사용합니다.

## 적용과 검증

CLI는 시작할 때, gateway는 gateway 시작 시 `config.yaml`의 라우팅을 읽습니다. 변경 뒤에는 새 Hermes 세션 또는 gateway 재시작으로 적용 범위를 분명히 하세요. 이 설정은 일반 채팅 요청과 반복 제한 요약 요청에 전달됩니다. 압축·제목 생성 같은 보조 작업은 `auxiliary.<task>.extra_body`에서 독립적으로 구성됩니다.

운영 전에는 다음을 확인합니다.

- 현재 LLM 제공자가 OpenRouter 또는 Nous Portal인가?
- 정책 대상 slug가 실제 제공자 카탈로그의 이름과 일치하는가?
- 도구 호출 작업이면 `require_parameters`를 켰는가?
- `only`가 장애 시 허용할 후보 수를 과도하게 줄이지 않았는가?
- 데이터 보존·학습 정책은 제공자 계약과 함께 검토했는가?

## 공식 원문

- [Provider Routing](https://hermes-agent.nousresearch.com/docs/user-guide/features/provider-routing)
- [Fallback Providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/fallback-providers)

_공식 문서 확인일: 2026-07-22_
