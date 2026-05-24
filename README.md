# Regain Code Timer

POV: You made a 3 hour project, but you took a whole 12hr sitting to make it!!
I made this project so that i can compare the hackatime.hackclub.com data (which tracks time using keystrokes... I think). Using this, I can check the time it actually took me to  code using hackatime and then compare it to the time i tracked with Regain. This way I can figure out how much time did i waste, and i can improve on it!!Regain Code Timer is an offline-first coding session tracker built with plain HTML, CSS, and JavaScript. It lets users run a simple coding stopwatch, save sessions locally in the browser, maintain streaks, unlock badges, and review top sessions and top coding days without needing a backend.

## Features

- Start, pause, reset, and log coding sessions
- Save session history in `localStorage`
- Track total coding time
- Maintain current and best daily streaks
- Unlock milestone badges based on activity
- View top sessions and top coding day.
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

Open "index.html" in a browser to use the timer UI.


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


