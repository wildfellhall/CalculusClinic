# Calculus Clinic

A local, student-facing AP Calculus ontology, dependency map and practice bank.

Run with Node.js 20 or later:

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. Install the pinned math-rendering dependency once with `npm ci`; no API key, account or database is required. `PORT=3001 npm run dev` selects another port. The development server serves `dist`; run `npm run build` after source edits and refresh the page.

## Content

- **127 concept groups:** every one of the 111 AP Calculus BC topic references, plus 16 prerequisite groups.
- **297 typed relationships:** directed instructional prerequisites and separately identified mathematical connections.
- **1,270 original questions:** ten three-option questions per concept, with stable IDs, answer keys and explanations.
- Shared AB/BC and BC-only topic labels; all prerequisites of the AB view stay within shared content or foundations.
- Objectives, subskills, mathematical conditions, misconceptions, concrete first steps, representation tags and instructional support notes.

Alignment uses College Board's current [Course and Exam Description](https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf), checked October 11, 2026, including the [fall 2026 clarifications](https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-bc-course-and-exam-description-clarifications.pdf). Topic descriptions and assessment items are original. Prerequisite edges are authored teaching judgments, not College Board-mandated dependencies.

The granularity is **topic-level concept groups with explicit subskills**, not one node per atomic skill. Ten questions sample each group; they do not exhaust every subskill, provide psychometric calibration, or reproduce AP free-response assessment. Other first-year calculus curricula can differ from AP BC. Potential friction and support fields describe task design; they do not diagnose a learner's emotion or ability.

## Views

- **Explore:** a focused home page with search, a unit picker, and three starting points or recently practiced concepts. The top navigation keeps Explore, Graph, Practice, Progress and Settings available on desktop and mobile.
- **Graph:** a dedicated workspace in the top navigation, with a concept picker and immediate-neighborhood, unit, or whole-curriculum views. Selecting nodes keeps you in the workspace; the selected concept’s notes and practice are available below the canvas. The whole-curriculum view retains pan/zoom when a node is selected.
- **Concept map:** open a concept from Explore to see its immediate neighborhood. Map options expose the selected unit with its external prerequisites, the entire curriculum, other mathematical connections and SVG export. Pan, zoom, fit and keyboard selection remain available. Concept notes have their own view; additional concepts in the unit are collapsed by default.
- **Concept table:** search all concepts and inspect objectives, scope, prerequisite IDs and first-attempt accuracy.
- **Practice:** ten questions per concept with explanations, an active-time counter, no time limit, unattempted items first, and a review at the end. Progress and session counts are derived from the bank rather than fixed at five.
- **Progress:** per-concept and per-question accuracy, with separate first, latest and all-attempt metrics. Practiced concepts appear by default; filters also show passed checks, concepts to review, checks in progress, all concepts, or those not yet tried.
- **Settings:** export/import progress backups, download accuracy CSVs and curriculum artifacts, and delete saved practice data.
- **Sources & how this works:** schema, relationship semantics, scope, data behavior and sources, accessible in the footer.

### Practice mastery on the graph

Every graph view shades nodes from pale mint to deeper green using **latest correct answers ÷ all available questions for that concept**, with the small timing adjustment below. For example, three latest correct answers in a ten-question concept produce 30% before that adjustment, even if only three questions have been tried. Unpracticed concepts have a separate neutral fill; a practiced 0% is distinct. Each node also shows its percentage and question coverage, with a color legend and an explanation available on the map. Selection uses an outline and leaves the mastery color intact.

Saved attempts remain the source of truth. Mastery is derived from those records on load and after answers, retries, imports, and changes in another tab; no independent cached score can become stale. Retrying the same question does not add duplicate credit, and a later incorrect answer can lower the score. Backups preserve the underlying records, including older backups. Deleting practice data resets all node shading. Live graphs retain their pan/zoom when progress arrives from another tab.

The concept progress CSV includes `masteryScore` (0–1, blank if unpracticed), `correctnessScore` before timing, and `timingAdjustment` (the difference, also a 0–1 proportion). **Map options → Download this map** includes the current personal shading, node labels, and legend in the SVG. The public curriculum SVG stays neutral. This practice indicator describes performance on the question bank, not a validated measure of overall understanding.

### Question timing

Each question has a quiet count-up timer, with no countdown, deadline, color warning, or automatic submission. It runs only while the unanswered question is displayed in Practice and its document/window is visible and focused. Leaving Practice or switching tabs/windows pauses it; returning to the same in-memory question resumes it. **Check answer** freezes the measured time, excluding explanation reading. The next question and an explicit new practice attempt start at zero. The timer does not announce every tick to screen readers.

Submitted durations are stored as optional nonnegative integer `durationMs` values on attempts. They appear in the set review and question history, survive reloads and backup imports, and are included in attempt CSVs. Question CSVs include latest/average durations and timed-attempt counts; concept CSVs include the average and count. Unknown legacy durations are shown as **Not recorded**, excluded from time averages, and have no effect on existing mastery. Deleting practice data clears recorded durations and the active clock. An unsubmitted clock lives only in the current page session: reloading or starting a new set begins a new attempt rather than saving an unfinished timer.

`src/timing.mjs` defines a deliberately small, uniform practice heuristic:

- Incorrect and unanswered questions earn no credit, regardless of speed.
- A correct latest answer within **2 minutes** earns full credit. Faster responses earn no extra bonus.
- Between **2 and 5 minutes**, correct-answer credit decreases linearly from 1 to 0.97.
- At **5 minutes or longer**, correct-answer credit stays at **0.97**.
- Missing response time receives neutral full credit for a correct answer.

Concept mastery is the sum of these latest-answer credits divided by all questions available. Timing therefore changes mastery by **at most 3 percentage points**: ten slow correct answers yield 97%; eight slow correct answers yield 77.6%. These time ranges are transparent initial defaults, not calibrated question-difficulty benchmarks. First/latest/all-attempt accuracy remains based solely on correctness, and the diagnostic still passes eight correct out of ten with all ten tried, regardless of time. Timing does not change diagnostic routing or the choice of prerequisites to check.

### Diagnostic next checks

A concept passes when **all ten questions have been tried and at least eight latest answers are correct**. `src/diagnostic.mjs` derives four states from saved answers: `unseen`, `partial`, `passed`, and `review`. Repeated answers do not count as new questions, and a later wrong answer can revoke a pass. Passing a node does not award credit to untested prerequisites or dependents.

The next check uses actual prerequisite edges and recent answer timestamps:

- Resume the most recently started incomplete concept before branching. **Continue check** presents only its unanswered questions; a regular practice set still offers all ten.
- After a pass, recommend an unfinished dependent of the most recently passed concept. Search through already-passed dependents when needed. Prefer returning to a recorded dependent gap when its prerequisite has just passed.
- After a completed result below 8/10, check an unresolved prerequisite. Follow known prerequisite gaps backward until reaching an untested or partial concept, or a gap with no further unresolved prerequisites.
- If a gap is isolated at the end of a prerequisite chain, keep its review status and sample another unfinished branch instead of forcing immediate repeated checks. When a passed branch has no unfinished dependents, explore a nearby unfinished concept.
- Respect the chosen AB/BC course, ignore non-prerequisite relationship types for routing, and stop recommending new checks when every eligible concept has passed.

One recommendation appears after a check, in Practice, on the graph, and on Explore after practice has begun. It includes a reason, a button to start or continue, and **Show on graph**. A purple **Next check** label marks the target without changing its mastery fill. Diagnostic status labels appear on nodes and in Progress; the concept progress CSV includes `diagnosticStatus`. Students can choose any other concept at any time.

For example: passing 1.11 (continuity at a point) leads to 1.12 (continuity on an interval). A lower complete result on 1.12 leads to checking 1.5 (limit laws) if that prerequisite is untested. Passing 1.5 brings the recommendation back to the recorded gap at 1.12. This is an explicit practice-routing heuristic, not a calibrated adaptive assessment.

Recommendations and statuses are reconstructed from saved attempts after reload, import, or another tab's updates. Existing backups work without migration, and deleting history clears the diagnostic. No separate route cache or additional personal data is stored.

## Data files

The build writes these reproducible artifacts:

| File | Contents |
| --- | --- |
| `dist/data/concepts.csv` | Concept IDs, units, scope, objectives, subskills, rules, prerequisites, dependents, support and source references |
| `dist/data/relationships.csv` | Source, target, relationship type, rationale and provenance |
| `dist/data/questions.csv` | Question and concept IDs, version, prompt, option IDs/text, correct option and explanation |
| `dist/data/coverage.csv` | All official topic references and associated question counts |
| `dist/data/ontology.json` | Complete structured ontology, bank and metadata |
| `dist/data/concept-map.svg` | Standalone vector graph with every node and relationship |

Concept IDs match topic references (`1.11`, `10.15`) or foundation identifiers (`F01`). Question IDs add a stable suffix, such as `1.11-Q1`; option IDs remain stable when display order changes. List-valued CSV fields use semicolons. CSV uses quoted UTF-8 fields and a BOM for spreadsheet compatibility. Formula-like leading text is escaped with an apostrophe for safe spreadsheet import; JSON preserves original mathematical text without that escaping.

Bank release **1.1.0** adds Q6–Q10 for every group in the six `data/questions-*-extra.mjs` files. Original Q1–Q5 records retain item version 1.0.0 and unchanged prompts, choices, answer keys and IDs. New items use version 1.1.0. Existing stored attempts and older backups remain valid; new unanswered questions expand coverage without lowering first/latest accuracy. A snapshot check protects all 635 original records.

Edit the authored curriculum in `data/curriculum.mjs` and questions in the grouped `data/questions-*.mjs` files. `data/questions.mjs` parses the source and rotates option positions reproducibly. Do not recycle existing question IDs for different questions without a bank-version change and a progress migration plan.

## Progress storage and accuracy

Attempts live in this browser's `localStorage` under `calculus-clinic-progress-v1`, scoped to the current origin. `localhost`, `127.0.0.1` and a future hosted URL each have separate storage. There is no network submission or cross-device synchronization. Export/import a backup to move records.

Each attempt records `id`, `questionId`, `conceptId`, `bankVersion`, `choiceId`, `correct`, `answeredAt` (UTC ISO timestamp), `sessionId`, and optional `durationMs` (active response time). The attempt field `bankVersion` retains the version of the individual question. An answer is recorded once when **Check answer** is pressed; reopening a question creates a review attempt. Existing schema-version-1 backups without durations remain compatible; invalid negative, fractional, nonnumeric, or unsafe durations are rejected before import.

- **First-attempt accuracy:** first correct answers / distinct questions attempted.
- **Latest accuracy:** latest correct answers / distinct questions attempted.
- **All-attempt accuracy:** all correct attempts / all attempts, including retries.
- No attempts produces an unscored value, not 0%.
- Accuracy exports use proportions from 0 to 1. A blank represents no attempts.

The UI exports concept accuracy, question accuracy, every attempt, or a JSON backup. Imports accept compatible version-1.0 and version-1.1 backups, validate question/option IDs and item versions, recalculate correctness from the current answer key, and merge by attempt ID. Invalid backups leave existing progress untouched. Browser storage failures produce a visible message and preserve current-session attempts for export.

**Settings → Delete my practice data** opens a confirmation dialog. Confirming removes only the app's storage key, clears its in-memory attempts and current practice set, and resets accuracy to unscored. Other tabs on the same origin also clear their history and active practice. Cancel or Escape keeps everything. Deletion also handles unreadable saved data; if browser storage refuses deletion, the history remains available and an error is shown. A pending backup import cannot restore records after deletion. Downloaded backups and records on other origins/devices are unaffected; importing a backup later can restore its attempts.

## Validation

```sh
npm run check
```

This builds all artifacts and runs 114 tests covering curriculum completeness, ten-item coverage, original-question compatibility, graph integrity, AB prerequisite closure, SVG generation, CSV escaping, accuracy and mastery semantics, backup validation/merging and independent numerical spot checks. Mastery checks include coverage, retries, legacy backups, color lightness, text contrast, selection, exports, and card layout. Diagnostic checks cover the pass threshold, incomplete evidence, chronological anchors, forward routing, prerequisite tracing, branch changes, pass revocation, course scope, persistence, and completion. Timing checks cover the small bounded adjustment, rounding, neutral legacy data, validation/round trips, unchanged passing, time summaries, and monotonic pause/resume/reset behavior. Math checks cover grouping, fractions with function denominators, roots, powers, integral and sum bounds, one-sided limits, vectors, prose boundaries, accessibility markup, escaping, and strict compilation of every authored math field.

`scripts/browser-check.mjs` is an additional local Chrome integration test. It expects the server on port 3000 and an **isolated** headless Chrome profile on debugging port 9224. It checks desktop/mobile rendering, top navigation, dedicated graph navigation and selection, viewport preservation, search, filtering, concept notes, all map scopes, ten-question completion, quiz feedback, retries, persistence, legacy-backup import, backup round trips and artifact downloads. Mastery checks cover distinct shades, actual answers, coverage, reloads, personal SVG exports, mobile label bounds, and cross-tab retries while a practice set is paused behind the graph. Deletion checks cover confirmation, cancellation, Escape, focus, storage failures, unrelated-data preservation, cross-tab reset, reload, pending imports and corrupt records. Never point it at a personal Chrome profile: the test clears the app's storage in its test page. Screenshots go to ignored `test-results/`.

`scripts/browser-diagnostic-check.mjs` uses the same isolated setup and exercises an actual diagnostic journey: partial completion and reload, answering only the remaining questions, passing and advancing, finding a gap and testing its prerequisite, returning to the gap, status filters, CSV/backup exports, cross-tab pass revocation, deletion, backup restoration, and mobile layout.

`scripts/browser-timing-check.mjs` verifies real ticking, pausing outside Practice and in another browser tab, stopping on submission, new-question/retry resets, absence of a deadline, time history, CSV and backup round trips, time-adjusted graph shading, unchanged accuracy/passing, invalid-time rejection, neutral legacy imports, deletion, and mobile layout. It advances a test-only monotonic clock to cover long answers without waiting minutes. Run the browser scripts sequentially on the isolated profile.

`scripts/browser-math-check.mjs` typesets every authored math field in a narrow browser fixture and checks actual practice, completion review, notes, history and graph screens. It verifies MathML, local fonts, desktop/mobile layout, keyboard access to long formulas, and saved answers. It uses the same isolated browser setup.

## Future deployment

`vercel.json` is included for a future static deployment: `npm run build` produces `dist`. This task does not deploy anything to Vercel or Sites. Hosting does not create shared storage; a future authenticated backend would be a separate feature. Font assets and their OFL licenses are local in `public/fonts`, so the application works without third-party font requests.

## Implementation

Vanilla JavaScript modules, CSS and SVG, with locally served [KaTeX](https://katex.org/docs/api.html) for mathematics. A mint (`#DDFEEA`) and pastel palette, locally hosted Fraunces/Nunito fonts, even-width rounded borders, dashed decorative trim and a small mathematical curve illustration. No raised borders, shadows, gradients or icon libraries.

### Math formatting

`scripts/math-format.mjs` converts the bank's plain-text notation into display segments during the build and validates every formula with strict KaTeX parsing. It recognizes the notation used in this bank, including fractions, radicals, absolute values, powers and indices, derivative primes, definite integrals, limit directions, indexed sums, vectors and intervals. It is a display parser, not a symbolic algebra system. Future content can use explicit `$...$` LaTeX for notation outside its supported grammar; add a grouping regression test when extending the grammar.

`src/math.mjs` typesets visible segments with cached HTML and semantic MathML; prose keeps the site's display/body fonts. Questions, choices, feedback, concept notes, completed-set reviews and question history share the renderer. Long formulas scroll inside their line and become keyboard focusable when necessary. Graph SVG labels and native select options keep compact plain-text labels. Raw question records, IDs, versions, answer keys and CSV/JSON exports remain unchanged, preserving existing saved attempts.

The build copies the pinned KaTeX module, CSS, fonts and MIT license into `dist/vendor/katex/`; there are no CDN requests or rendering-service calls. KaTeX runs with `trust: false`, and prose is HTML escaped.
