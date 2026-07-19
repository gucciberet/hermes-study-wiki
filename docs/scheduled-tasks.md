---
title: 예약 작업과 cron
sidebar_position: 11
---

# 예약 작업과 cron

cron은 Hermes가 정해진 시간에 작업을 실행하고 결과를 채팅 또는 파일로 보내는 기능입니다. 일일 요약, 상태 점검, RSS 감시, 리마인더처럼 사람이 매번 요청하지 않아도 되는 작업에 적합합니다.

## 중요한 전제: 매 실행은 새 세션

예약 작업은 현재 대화의 문맥을 이어받지 않습니다. 따라서 다음처럼 모호한 지시는 피해야 합니다.

> 아까 이야기한 방식대로 해줘.

대신 목적, 입력, 출력 형식, 결과를 보낼 위치를 프롬프트 안에 모두 씁니다.

> 매일 오전 9시에 GitHub 열린 PR을 확인하고, 실패한 CI와 검토가 필요한 항목만 5개 이내로 요약해 운영 채널에 보낸다.

## 생성 방법

대화에서 `/cron` 명령을 쓰거나 일반 대화로 요청할 수 있습니다. CLI에서는 다음 형태를 사용합니다.

```bash
hermes cron create "every 2h" "Check server status"
hermes cron create "0 9 * * *" "Summarize new items" --name "Morning brief"
```

작업 절차가 이미 스킬로 있다면 연결할 수 있습니다.

```bash
hermes cron create "every 1h" "Check configured feeds and summarize new items" \
  --skill blogwatcher
```

## 프로젝트에서 실행하기

cron은 기본적으로 특정 저장소와 연결되지 않습니다. 프로젝트 규칙 파일과 작업 경로가 필요하면 절대 경로를 명시하세요.

```bash
hermes cron create "every 1d at 09:00" \
  "Audit open PRs and post a short summary" \
  --workdir /home/me/projects/acme
```

`workdir`를 지정한 작업은 같은 tick에서 순차 실행됩니다. 같은 프로젝트 파일을 동시에 수정해 충돌하는 일을 줄이기 위한 동작입니다.

## 모델 비용과 변경 안전성

예약 작업은 만들 때의 모델 제공자와 모델을 스냅샷합니다. 나중에 전역 기본 모델을 바꾸면, 작업이 조용히 새 모델로 비용을 쓰는 대신 실행을 멈추고 알립니다. 알림을 받으면 해당 작업의 모델을 의도적으로 다시 지정해야 합니다.

## 스크립트 전용 작업

추론이 필요 없는 단순 감시는 no-agent 모드가 더 적합할 수 있습니다. 이 모드는 스크립트의 표준 출력만 전달하며 LLM을 호출하지 않습니다.

단, 빈 출력은 아무 메시지도 보내지 않는다는 뜻입니다. 감시 스크립트는 이상이 있을 때만 문장을 출력하도록 설계하면 알림 소음을 줄일 수 있습니다.

## 운영 원칙

- 먼저 수동으로 한 번 실행해 결과 형식을 확인합니다.
- 외부 쓰기·삭제가 있는 자동화에는 특히 좁은 권한을 사용합니다.
- 위험 명령을 cron에서 자동 승인하는 정책은 신중하게 검토합니다.
- 실패 알림을 받을 채널과 담당자를 정해 둡니다.
- 이름을 붙여 작업의 목적과 소유자를 드러냅니다.

## 공식 원문

- [Scheduled Tasks (Cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)

_공식 문서 확인일: 2026-07-19_
