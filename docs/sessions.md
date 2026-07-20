---
title: 세션 보관·재개·정리
---

# 세션 보관·재개·정리

Hermes는 CLI, 메시지 gateway, cron 등에서 나눈 모든 대화를 **세션**으로 자동 저장합니다. 세션은 이전 작업을 이어가기 위한 자산이지만, 메시지와 도구 결과가 들어 있으므로 백업·공유·삭제를 운영 절차로 다뤄야 합니다.

## 세션은 어디에 저장되나

정식 저장소는 `~/.hermes/state.db` SQLite 데이터베이스입니다. 여기에는 메시지 이력, 도구 호출·결과, 모델 정보, 토큰 수, 제목과 시간이 저장되고 FTS5 검색이 제공됩니다.

`~/.hermes/sessions/sessions.json`은 gateway의 **라우팅 인덱스**일 뿐 전체 세션 목록이 아닙니다. CLI 세션이 그 파일에 보이지 않아도 정상입니다. 전체 목록은 `hermes sessions list` 또는 Dashboard에서 확인하세요.

> 세션에는 민감한 입력이나 도구 출력이 포함될 수 있습니다. 데이터베이스·내보낸 파일을 일반 로그나 공개 저장소처럼 취급하지 마세요.

## 이어서 작업하기

```bash
# 가장 최근 CLI 세션 이어서 열기
hermes --continue

# 제목으로 가장 최근 계보를 재개
hermes --resume "배포 점검"

# 목록 확인
hermes sessions list
hermes sessions list --source cron --limit 50
```

대화 중에는 `/title 배포 점검`으로 찾기 쉬운 제목을 지정할 수 있습니다. `/compress`는 활성 문맥을 줄이고 이어지는 새 세션을 만들 수 있으며, 같은 제목에는 `#2`, `#3`처럼 계보가 붙습니다. 압축은 개인정보 삭제가 아닙니다.

## 긴 대화의 문맥 관리

세션 이력이 존재한다고 해서 모든 과거 내용이 매번 모델에 다시 전달되지는 않습니다. 하지만 긴 로그, 전체 diff, 반복 상태 보고처럼 장황한 텍스트는 현재 문맥을 빠르게 키웁니다.

- 긴 출력은 파일 경로·요약·필요한 발췌로 대체합니다.
- 작업 주제가 바뀌면 `/new`로 새 스레드를 시작합니다.
- 문맥이 길어지면 `/compress`를 사용합니다.
- 대화 자체를 찾을 때는 `hermes sessions list` 또는 세션 검색을 사용합니다.

## 안전한 백업과 정리

공유하거나 장기 보관할 세션은 내보낼 때 항상 비밀값 제거를 요청하세요.

```bash
# 내보낼 대상을 먼저 확인하고, 비밀값을 제거해 백업
hermes sessions export sessions-backup.jsonl --redact

# 삭제 후보만 미리 보기
hermes sessions prune --older-than 90 --dry-run

# 검토 뒤 오래된 종료 세션 삭제
hermes sessions prune --older-than 90
```

`prune`은 종료된 세션만 대상으로 하며 기본값은 90일보다 오래된 세션입니다. 필터를 하나라도 추가하면 기본 90일 제한이 사라질 수 있으므로 `--source` 같은 필터를 쓸 때도 기간을 함께 지정하는 습관이 안전합니다. 자동 정리는 기본적으로 꺼져 있습니다.

```yaml
sessions:
  auto_prune: true
  retention_days: 90
  vacuum_after_prune: true
  min_interval_hours: 24
```

자동 정리는 실행량이 큰 gateway·cron 환경에서만 보존 정책을 합의한 뒤 켜세요. 활성 세션은 자동 정리 대상이 아닙니다.

## 공식 원문

- [Sessions](https://hermes-agent.nousresearch.com/docs/user-guide/sessions)

_공식 문서 확인일: 2026-07-21_
