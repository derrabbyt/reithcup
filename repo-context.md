# Reithcup Project Context

## Overview
This repository contains the source code for the "Reithcup" event website. The project is a static site built with HTML, Tailwind CSS, and Vanilla JavaScript. It combines a modern event promotion landing page with legacy polling functionality.

## Core Files

### 1. `index.html` (Landing Page)
- **Role**: The main entry point for the website.
- **Features**:
  - **Design**: Implements a dark, high-impact aesthetic using Tailwind CSS.
  - **Hero Section**: Displays the main event ("Erik vs Elias"), date/time, and location ("Reith, Austria").
  - **Interactivity**: Includes a live JavaScript countdown timer targeting the event date.
  - **Navigation**: Provides links to the Event details and Polls page, plus a mobile responsiveness menu.

### 2. `event.html` (Event Details)
- **Role**: Displays the full fight card and matchup details.
- **Features**:
  - **Structure**: Divided into "Main Card" and "Prelims" with a sticky sub-navigation bar.
  - **"Tale of the Tape" Expansion**: Fight cards are interactive. Clicking a card triggers a JavaScript-driven transition that fades out the summary view and expands into a detailed stats comparison layout.
  - **Visuals**: Utilizes placeholder images (Full Body) and detailed stats grids (Record, Reach, etc.).
  - **Transitions**: Features deliberate, smooth 500ms fade animations for expanding/collapsing cards.

### 3. `polls.html` (Polling Application)
- **Role**: Handles user voting and matchmaking predictions.
- **History**: Originally the `index.html`, this content was moved to preserve functionality while upgrading the main landing experience.
- **Logic**: Relies on `app.js` for fetching data (Google Sheets integration) and handling form submissions.

### 4. `app.js`
- **Role**: Contains the core logic for the polling functionality in `polls.html`.
- **Functions**: Data fetching, vote subimssion handling, UI updates for poll results.

### 5. `styles.css`
- **Status**: Deprecated.
- **Note**: Original CSS file. Most styling has been migrated to Tailwind utility classes within the HTML files, but this file remains for reference or legacy styles used in `polls.html`.

## Tech Stack
- **Styling**: Tailwind CSS (via CDN).
- **Typography**: Google Fonts (Oswald, Roboto Condensed).
- **Scripting**: Vanilla JavaScript (no framework dependencies).
- **Icons**: SVG icons (Heroicons style).

## Recent Updates
- Migration to Tailwind CSS for `index.html` and `event.html`.
- Implementation of "Tale of the Tape" expandable cards in `event.html`.
- Separation of legacy polling logic to `polls.html`.
