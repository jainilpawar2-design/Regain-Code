# Regain Code Timer

Regain Code Timer is an offline-first coding session tracker built with plain HTML, CSS, and JavaScript. It lets users run a simple coding stopwatch, save sessions locally in the browser, maintain streaks, unlock badges, and review top sessions and top coding days without needing a backend.

## Features

- Start, pause, reset, and log coding sessions
- Save session history in `localStorage`
- Track total coding time
- Maintain current and best daily streaks
- Unlock milestone badges based on activity
- View top sessions and top coding days
- Works offline after the first load with a service worker
- Installable as a lightweight Progressive Web App

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Service Worker
- Web App Manifest
- Browser `localStorage`

## Project Structure

```text
.
|-- index.html
|-- style.css
|-- app.js
|-- sw.js
|-- manifest.webmanifest
|-- icon.svg
```

## How It Works

The app runs entirely on the client side. Session data, streak progress, and leaderboard entries are stored in the browser, so no account or server setup is required. Once the app is opened and the service worker is registered, core assets can be cached for offline usage.

## Getting Started
 Open Directly

Open `index.html` in a browser to use the timer UI.


## Usage

1. Enter your name.
2. Click `Start` to begin a coding session.
3. Click `Pause` if needed.
4. Click `Reset` to clear the current timer.
5. Click `Stop & Log` to save the session.
6. Review streaks, badges, recent sessions, and leaderboard stats.

## Data Storage

All data is stored locally in the browser using `localStorage`. No session data is sent to a server.

## Ideal Use Cases

- Personal coding habit tracking
- Daily focus challenges
- Offline productivity tools
- Beginner PWA demonstration projects


