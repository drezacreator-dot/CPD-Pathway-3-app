# Year 9 English Revision

A local revision prototype for **Inference** and **Persuasive techniques**. Each topic has five original, fictional demonstration questions. Students choose a topic, answer one question at a time, receive explanations, and review scores and topic performance. Staff should review content before classroom use.

## Install and run

Install Node.js 22.12 or later (Node 24 was used during development), then open a terminal:

```bash
git clone --branch cpd-revision-mvp https://github.com/drezacreator-dot/CPD-Pathway-3-app.git
cd CPD-Pathway-3-app
npm ci
npm start
```

Open the local address printed by Vite (normally http://localhost:5173). Stop with Ctrl+C. There is no backend service to configure. After the pull request is merged, you can clone the default branch instead.

## Checks

```bash
npm test
npm run typecheck
npm run build
```

No lint command is configured. TypeScript checks types; Vitest checks the question schema, answer validation, scoring, topic summaries, and storage including corrupt data and blocked access.

## Main folders and components

| Location | Responsibility |
| --- | --- |
| `src/data/questions.ts` | Question bank and topic list; no interface code. |
| `src/types.ts` | Question and Result data contracts. |
| `src/logic/scoring.ts` | Answer validation, attempt score and topic aggregation. |
| `src/logic/storage.ts` | Validates, loads, saves and clears browser results safely. |
| `src/components/TopicPicker.tsx` | Starts or restarts practice on any topic. |
| `src/components/Attempt.tsx` | Tracks answers and creates one result on completion. |
| `src/components/QuestionCard.tsx` | Presents one question and prevents repeated submission. |
| `src/components/Feedback.tsx` | Gives explanations with words and a correct/incorrect icon. |
| `src/components/Results.tsx` | Displays the completed score and retry actions. |
| `src/components/History.tsx` | Lists saved attempts and offers history clearing. |
| `src/components/PerformanceSummary.tsx` | Shows accuracy calculated from saved results. |
| `src/App.tsx` | Coordinates views, result state and storage warnings. |
| `src/tests/` | Automated tests for the data and core logic. |

## Design decisions and dependencies

React and React DOM provide reusable interface components; Vite serves and builds the app; TypeScript checks data contracts; Vitest runs tests; React type definitions support type checking. No component library, router, backend, AI service, external API, authentication or analytics is used. System fonts avoid external font requests.

Every correct answer earns one mark. Topic accuracy is total marks divided by total questions across completed attempts, rounded to the nearest whole percentage. Unattempted topics show “No attempts yet”, rather than 0%. An abandoned or restarted attempt is not saved. The last explanation appears before the student chooses “See results”.

History uses the single localStorage key `year9-english-revision-history-v1`. Results contain only `id`, `topic`, `score`, `total` and `completedAt`; no names or personal information are requested. History belongs to the browser profile and local origin, and is shared by anyone using that profile. Refresh preserves completed results when storage is available; clearing browser data or private browsing can remove them. Blocked storage shows a warning. Missing data starts empty; malformed data starts empty with a warning and can be reset with Clear history. A successful subsequent save replaces unreadable history. Clear history requires browser confirmation; cancelling keeps results.

Native radio buttons support arrow keys; controls support Tab and Enter/Space. Feedback uses text and icons, with a live status announcement. Focus moves to each new question and to the next-step button after checking an answer.

## Manual user-journey checklist

- [ ] Start with `npm start`; select either topic and confirm five questions.
- [ ] Try checking before selecting an answer: the button is disabled.
- [ ] Submit correct and incorrect answers: check text/icon feedback, explanation and correct answer.
- [ ] Confirm an answer cannot be resubmitted or changed after checking.
- [ ] Complete five answers and confirm the score matches the correct answers.
- [ ] View history and confirm topic, score, total, date and topic accuracy.
- [ ] Complete another topic and confirm summaries remain separate; retry and check aggregation.
- [ ] Refresh the page; confirm completed results remain in History & progress.
- [ ] Start a new topic or restart midway; confirm the unfinished attempt is not recorded.
- [ ] Cancel Clear history, then confirm it; refresh and check that results remain cleared.
- [ ] Use keyboard only: Tab, radio arrow keys, Space and Enter; check visible focus and feedback.
- [ ] Check a narrow window and Chromebook/laptop layout, including the history table.
- [ ] In browser developer tools, set the history key to invalid JSON; refresh and confirm safe recovery and a warning.

The checklist is for staff verification; unchecked items do not claim browser testing has been completed. No deployment or hosting configuration is included.
