**Repo context summary (short, agent-friendly)**

Static “poll voting” web app hosted on **GitHub Pages**.
Frontend only — no backend/server code. Votes are stored via **Google Forms**, and live results are read from a **published Google Sheets** responses sheet.

**Architecture**

* `index.html` — single page UI with four head-to-head matches.
* `app.js` — handles voting logic, optimistic UI updates, and live count syncing.
* No build system, frameworks, or dependencies.

**Voting flow**

1. User clicks a candidate button.
2. JS sends a POST request to a Google Form endpoint (`formResponse`) using `fetch` with `no-cors`.
3. Each click creates a new row in the form responses sheet.
4. UI enforces **one selected candidate per match** (in-memory only; resets on reload).
5. Switching choice is allowed and updates counters optimistically.

**Results flow**

* Live counts are loaded from the responses spreadsheet using the Google Visualization API (`gviz`) via JSONP (script injection) to bypass CORS.
* `computeCounts()` aggregates totals by matching sheet column headers to match names.
* Auto-refresh runs every ~10 seconds.

**State model**

* No persistence except Google Forms.
* Client keeps an in-memory map:

  ```
  selectedByEntry[entryId] = choice
  ```
* Counts shown in UI are optimistic until next sync.

**Key constraints**

* Static hosting only (must work on GitHub Pages).
* No authentication or anti-spam.
* Local voting restrictions are UI-only (not enforced server-side).
* Sheet must be **Published to web** for live results to load.

**Main identifiers**

* Google Form entry IDs represent matches (e.g. `entry.1946702419`).
* Button IDs follow `btn-<entryIdWithoutPrefix>-<choice>`.
* Counter spans use IDs like `count-elias`, `count-erik`, etc.
