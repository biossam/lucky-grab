# LUCKY GRAB

키보드로 하는 고양이 크레인 뽑기 게임 (1인 · 2인).

- 2인: 파랑 `← →` 이동 · `SPACE` 집기 / 주황 `A D` 이동 · `S` 집기
- 꾹 누르면 더 깊이 내려가고, 20초가 지나면 자동으로 집어요.
- 황금 냥이 공은 3점!
- `M` 소리 · `Q` 화질 · `R` 공 채우기 · `H` 안내 · `F` 전체화면 · `ESC` 처음으로

## 퀴즈 모드

공을 뽑아 통에 넣으면 퀴즈가 나와요. 맞히면 뽑기 기회가 늘어나요. 기회를 다 쓰거나 문제를 다 풀면 결과 화면이 나와요.

`index.html` 아래쪽의 `<script type="application/json" id="quiz-data">` 부분만 바꾸면 새 퀴즈 게임이 돼요.

| 칸 | 뜻 |
|---|---|
| `title` / `subtitle` | 시작 화면 제목 · 설명 |
| `settings.startTries` | 처음 뽑기 기회 (기본 3) |
| `settings.bonusTries` | 맞혔을 때 늘어나는 기회 (기본 2) |
| `settings.goldBonusTries` | 황금 냥이 공 문제를 맞혔을 때 (기본 3) |
| `settings.turnSeconds` | 자동으로 집기까지 시간 (기본 20) |
| `settings.shuffle` | 문제 순서 섞기 (판마다) |
| `settings.shuffleChoices` | 객관식 보기 순서 섞기 (문제마다, OX는 그대로) |

문제 종류: `choice`(객관식, `answer`는 **써 놓은 보기 순서**로 1부터 세는 번호 — 화면에서는 섞여 나와도 정답은 알아서 맞춰져요) · `ox`(`answer`는 `"O"`/`"X"`) · `open`(주관식, 정답을 보여 주고 선생님이 맞음/틀림을 눌러요). `explain`(풀이)과 `image`(그림)는 넣지 않아도 돼요.

`questions`를 비우면(`[]`) 퀴즈 없이 그냥 뽑기 게임이 돼요.
