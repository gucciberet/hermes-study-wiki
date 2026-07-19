---
id: install
title: 설치하기
sidebar_position: 2
---

# 설치하기

Hermes는 터미널에서 설치하고 실행합니다.

## 가장 쉬운 설치

Linux 또는 macOS 터미널에서 아래 명령을 실행합니다.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

설치가 끝난 뒤 새 터미널을 열고 다음을 실행합니다.

```bash
hermes
```

## 처음 실행하면

처음에는 사용할 AI 모델과 제공자를 정하는 설정 과정이 나올 수 있습니다. 화면 안내에 따라 진행하면 됩니다.

나중에 다시 설정하려면:

```bash
hermes setup
```

## 설치가 제대로 되었는지 확인

```bash
hermes --version
hermes doctor
```

- `--version`: 설치된 Hermes 버전을 보여줍니다.
- `doctor`: 설정과 필요한 구성 요소를 점검합니다.

> API 키와 인증 정보는 채팅이나 문서에 적지 마세요. Hermes의 인증·설정 화면에서 관리하는 것이 안전합니다.

다음: [빠른 시작](./quick-start)
