---
title: 프로필과 작업공간 분리
sidebar_position: 9
---

# 프로필과 작업공간 분리

프로필(profile)은 한 컴퓨터에서 목적이 다른 Hermes 에이전트를 분리해 운영하는 방법입니다. 예를 들어 개인 비서, 코드 작업 봇, 리서치 봇을 서로 다른 프로필로 두면 메모리·세션·스킬·API 키·gateway 상태가 섞이지 않습니다.

## 프로필이 분리하는 것

프로필마다 별도의 다음 항목을 가집니다.

- `config.yaml`과 `.env`
- `SOUL.md`
- 메모리와 세션
- 스킬과 cron 작업
- 메시지 플랫폼의 gateway 상태와 봇 토큰

새 프로필을 만들면 그 이름으로 명령 별칭도 생깁니다.

```bash
hermes profile create coder
coder setup
coder chat
```

또는 모든 명령에 프로필을 명시할 수 있습니다.

```bash
hermes -p coder doctor
hermes --profile=coder gateway status
```

## 복제할 때의 차이

```bash
hermes profile create work --clone
hermes profile create backup --clone-all
```

- `--clone`: 설정·비밀값·SOUL·스킬은 복사하지만, 새 세션과 새 메모리에서 시작합니다.
- `--clone-all`: cron·플러그인 등을 포함한 더 넓은 복제입니다. 원본의 실행 이력과 대용량 상태는 별도입니다.

비밀값까지 복사될 수 있으므로, 테스트 프로필을 만들었다면 외부 채널 토큰과 권한이 의도한 대로인지 반드시 확인하세요.

## 프로필은 보안 경계가 아니다

중요한 차이입니다. 프로필은 **Hermes 상태를 분리**하지만, 로컬 터미널 백엔드에서 파일시스템 접근 자체를 차단하지는 않습니다. 로컬 환경에서는 같은 OS 사용자 권한으로 명령이 실행됩니다.

파일·명령을 더 강하게 격리해야 한다면 Docker, Singularity, 원격 SSH 같은 터미널 백엔드와 쓰기 안전 정책을 함께 검토해야 합니다.

## 작업공간과는 다르다

- **프로필**: 에이전트의 기억, 설정, 채널, 자격증명을 나누는 단위
- **작업공간**: 도구가 시작하는 프로젝트 디렉터리
- **샌드박스**: 명령이 접근할 수 있는 실행 환경의 경계

프로필을 만들었다고 특정 프로젝트 폴더만 보게 되는 것은 아닙니다. 작업 시작 위치를 고정하려면 프로필 설정에 절대 경로로 `terminal.cwd`를 지정합니다.

```yaml
terminal:
  backend: local
  cwd: /absolute/path/to/project
```

## 언제 프로필을 나눌까?

- 개인 대화와 회사 업무의 메모리를 섞고 싶지 않을 때
- 테스트 봇과 운영 봇의 토큰·채널을 분리할 때
- 특정 팀 또는 Slack 워크스페이스마다 별도 봇이 필요할 때
- 리서치·개발·알림 자동화의 비용과 권한을 분리할 때

## 공식 원문

- [Profiles: Running Multiple Agents](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)
- [Running Many Gateways at Once](https://hermes-agent.nousresearch.com/docs/user-guide/multi-profile-gateways)

_공식 문서 확인일: 2026-07-19_
