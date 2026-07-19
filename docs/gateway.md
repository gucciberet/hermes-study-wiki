---
title: 메시지 Gateway 운영
sidebar_position: 10
---

# 메시지 Gateway 운영

Gateway는 Slack, Telegram, Discord 같은 메시지 플랫폼의 입력을 받아 Hermes에 전달하고, 응답을 다시 전송하는 백그라운드 프로세스입니다. 또한 예약 작업 스케줄러와 음성 전달도 gateway에서 함께 동작합니다.

## 시작 전 준비

메시지 봇을 운영하려면 보통 다음이 모두 필요합니다.

- 모델 제공자 설정
- 플랫폼별 봇 자격증명
- 어떤 사용자·채널이 봇과 대화할 수 있는지에 대한 접근 정책
- gateway가 계속 실행될 호스트와 서비스 관리 방식

설정 마법사로 플랫폼 연결을 시작할 수 있습니다.

```bash
hermes gateway setup
```

## 기본 운영 명령

```bash
hermes gateway install   # 사용자 서비스 설치
hermes gateway start     # 시작
hermes gateway stop      # 중지
hermes gateway status    # 상태 확인
hermes gateway           # 포그라운드 실행
```

Linux에서는 시스템 부팅부터 서비스로 운용해야 할 때 `sudo hermes gateway install --system`을 사용할 수 있습니다. 단, 시스템 서비스는 권한과 비밀값의 소유자가 달라질 수 있으므로 개인 사용자 서비스와 혼용하지 않도록 설계하세요.

## 메시지 세션의 특성

플랫폼 어댑터는 채팅마다 세션을 관리합니다. 같은 대화에서는 문맥이 이어지지만, `/new` 또는 `/reset`으로 새 대화를 시작하면 이전 문맥이 사라집니다.

운영 중 유용한 명령:

- `/status`: 현재 세션 정보 확인
- `/stop`: 진행 중인 에이전트 중단
- `/approve`, `/deny`: 위험 명령 승인·거부
- `/compress`: 긴 대화의 문맥 압축
- `/retry`: 직전 요청 재시도

## 재시작과 전달 신뢰성

Gateway는 플랫폼 전송 전후의 응답을 내부 전달 기록에 남깁니다. 전송 중 프로세스가 중단되면 다음 시작 때 응답을 재전달할 수 있습니다. 이는 **최소 한 번(at-least-once)** 전달을 목표로 하므로, 드물게 같은 응답이 다시 보일 가능성도 운영 설계에 포함해야 합니다.

## 여러 프로필을 운영할 때

기본 모델은 프로필마다 별도 gateway 프로세스를 두는 것입니다. 프로필별로 봇 토큰·메모리·장애 범위가 분리됩니다.

프로필 수가 많고 하나의 프로세스로 관리하고 싶다면 기본 프로필의 gateway에서 다중 프로필 multiplexing을 선택할 수 있습니다. 이는 기본값이 아니며, 활성화하면 보조 프로필이 별도 gateway를 시작하면 안 됩니다. HTTP webhook 플랫폼은 경로 구조도 달라지므로 운영 전 공식 문서를 확인하세요.

## 운영 점검표

- `hermes gateway status`가 정상인가?
- 재시작 후 봇이 메시지를 받는가?
- 승인 요청을 처리할 운영자가 있는가?
- 허용되지 않은 DM 또는 채널 접근이 차단되는가?
- 로그에서 반복되는 인증·네트워크 오류가 없는가?

## 공식 원문

- [Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/)
- [Running Many Gateways at Once](https://hermes-agent.nousresearch.com/docs/user-guide/multi-profile-gateways)

_공식 문서 확인일: 2026-07-19_
