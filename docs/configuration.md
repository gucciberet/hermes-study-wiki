---
title: 설정과 업데이트
sidebar_position: 8
---

# 설정과 업데이트

Hermes의 운영 설정은 기본적으로 `~/.hermes/` 아래에 모입니다. 여기에는 설정, 비밀값, 메모리, 스킬, 예약 작업, 세션, 로그가 함께 있지만 역할은 서로 다릅니다.

```text
~/.hermes/
├── config.yaml   # 일반 설정
├── .env          # API 키·토큰 등 비밀값
├── memories/     # 장기 메모리
├── skills/       # 재사용 작업 절차
├── cron/         # 예약 작업
├── sessions/     # 대화 세션
└── logs/         # 오류와 gateway 로그
```

## 안전한 설정 변경 방법

파일을 직접 편집하기보다 먼저 CLI 명령을 사용하면 값이 알맞은 위치에 저장됩니다.

```bash
hermes config                 # 현재 설정 보기
hermes config get model       # 특정 값 확인
hermes config set KEY VALUE   # 값 설정
hermes config unset KEY       # 사용자 설정 제거
hermes config check           # 업데이트 뒤 누락된 옵션 검사
hermes config migrate         # 필요한 새 옵션 추가
```

API 키처럼 민감한 값은 `hermes config set`을 통해 설정해도 `.env`로 분리됩니다. 반대로 모델, 도구, 터미널 백엔드 같은 일반 설정은 `config.yaml`에 둡니다.

## 설정 우선순위

같은 값이 여러 곳에 있으면 다음 순서로 적용됩니다.

1. 실행할 때 지정한 CLI 인자
2. `config.yaml`
3. `.env`
4. Hermes 기본값

운영 중 예상과 다른 모델이나 동작이 보이면, 먼저 일회성 CLI 인자가 있는지와 `config.yaml` 값을 함께 확인하세요.

## 시간 제한과 폴백

외부 모델 제공자는 응답 지연이나 일시적 장애가 생길 수 있습니다. 장시간 실행되는 환경에서는 제공자별 또는 모델별 요청 시간 제한과 폴백 모델 정책을 명시적으로 정하는 것이 좋습니다. 특히 gateway와 cron은 사람이 즉시 터미널을 볼 수 없으므로, 무한 대기보다 실패를 관측 가능한 상태로 남기는 편이 낫습니다.

## 업데이트 전 확인

`hermes update`는 기본적으로 중요한 상태를 빠르게 스냅샷합니다. 업데이트 정책은 다음처럼 관리할 수 있습니다.

```yaml
updates:
  pre_update_backup: quick
  backup_keep: 5
  non_interactive_local_changes: stash
```

- `quick`: 핵심 상태를 스냅샷합니다. 기본값입니다.
- `full`: Hermes 홈 전체의 압축 백업까지 만듭니다. 큰 환경에서는 시간이 더 걸릴 수 있습니다.
- `off`: 자동 백업을 끕니다. 운영 환경에서는 신중하게 선택하세요.
- `stash`: 비대화형 업데이트 시 로컬 소스 변경을 보존하려는 기본적인 선택입니다.

## 운영 팁

- 설정 변경 전에는 `hermes config get`으로 현재 값을 기록합니다.
- 한 번에 여러 정책을 바꾸지 말고, 변경 뒤 gateway 상태와 로그를 확인합니다.
- `.env`, `auth.json`, 봇 토큰은 화면 공유·커밋·문서 예시에 넣지 않습니다.

## 공식 원문

- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)

_공식 문서 확인일: 2026-07-19_
