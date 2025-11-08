# AI for Board Games: Tic-Tac-Toe & Connect 4

## Our Team
- Aayush Ojha - 23BCE1795  
- Siddharth Dahiya - 23BCE1757  
- Shivansh Malik - 23BCE1377  

## Project Overview
AI Playmakers is an interactive, web-based platform that unifies Tic-Tac-Toe and Connect 4, enhanced with adaptive AI opponents, persistent user stats, and match replay functionality.

This project blends timeless strategic gameplay with modern AI features. Implemented using HTML, CSS, and pure JavaScript, it emphasizes modular architecture and efficient AI using the Minimax algorithm with Alpha-Beta Pruning.

**Live Demo:** [https://aayush190205.github.io/BOARD_GAMES/](https://aayush190205.github.io/BOARD_GAMES/)

---

## Key Features
1. **Dual Games:** Play both Tic-Tac-Toe and Connect 4 in a single, unified interface.  
2. **Adaptive AI Opponent:** A challenging AI powered by the Minimax algorithm.  
3. **Adjustable Difficulty:**
   - Easy: The AI selects a random, legal move.  
   - Medium: The AI uses a depth-limited Minimax search (depth 3 for Tic-Tac-Toe, depth 4 for Connect 4).  
   - Hard: The AI uses an optimized, deeper search (unbeatable in Tic-Tac-Toe, depth 7 in Connect 4).  
4. **User Authentication:** A persistent login/register system using `localStorage`.  
5. **Persistent Dashboard:** Displays lifetime wins, losses, and draws using Chart.js.  
6. **Match Replay:** Step-by-step replays of past games for analysis.  
7. **Tournament Mode:** Play a “Best-of-3” series against a friend or the AI.  
8. **Timers:** Optional per-move timer.  
9. **Dual Themes:** Includes both "Royal" (dark) and "Light" themes saved to user preference.  

---

## Detailed Feature Breakdown

### 1. Authentication & Persistence
- Users register via `index.js`; credentials `{username, password}` are stored in `gameHubUsers` (in `localStorage`).  
- On login, the `currentUser` key is set.  
- `authCheck()` (in `global.js`) verifies authentication on each page.  
- Each user has dedicated `gameStats` and `gameReplays` entries.

### 2. AI & Difficulty Levels
- The AI is powered by **Minimax with Alpha-Beta Pruning**.  
- **Easy:** Chooses random legal moves.  
- **Medium:** Depth-limited Minimax (depth 3 or 4).  
- **Hard:**
  - Tic-Tac-Toe: Full-depth Minimax (unbeatable).  
  - Connect 4: Depth 7 with heuristic evaluation.  

### 3. Dashboard & Statistics
- `dashboard.js` reads stats from `gameStats` in `localStorage`.  
- Renders pie charts using **Chart.js** to visualize player performance.  

### 4. Match Replay
- After each game, `tictactoe.js` and `connect4.js` save a `moveHistory` array in `gameReplays`.  
- `replay.js` loads the game by ID from URL and replays it using `setInterval`, visually simulating each move.

---

## Technical Deep Dive

### Minimax with Alpha-Beta Pruning
- Recursive, depth-first search algorithm.  
- The AI (maximizer) assumes the human (minimizer) plays optimally.  
- Explores possible moves up to a `depthLimit`.  
- Assigns scores (win/loss/draw) and backtracks the optimal move.  
- Alpha-Beta pruning eliminates unneeded branches, improving efficiency from O(b^d) to O(b^(d/2)) in the best case.

### Connect 4 Heuristic Scoring
Connect 4’s large search space requires a heuristic for intermediate board evaluations:
- +10000: 4 AI pieces (win)  
- +5: 3 AI pieces + 1 empty  
- +2: 2 AI pieces + 2 empty  
- -4: 3 human pieces + 1 empty (threat)  
- Bonus for center control.  

Total heuristic score = sum of all 76 possible 4-cell windows.

---

## Data Model (`localStorage`)
## Data Model (`localStorage`)
All data is stored as JSON in `localStorage`:

```json
{
  "currentUser": "aayush",
  "gameHubUsers": [
    { "username": "aayush", "password": "123" },
    { "username": "shivansh", "password": "abc" }
  ],
  "gameStats": {
    "aayush": {
      "ticTacToe": { "wins": 5, "losses": 2, "draws": 3 },
      "connect4": { "wins": 8, "losses": 10, "draws": 1 }
    },
    "shivansh": {
      "ticTacToe": { "wins": 1, "losses": 1, "draws": 0 },
      "connect4": { "wins": 3, "losses": 0, "draws": 0 }
    }
  },
  "gameReplays": {
    "aayush": [
      {
        "id": 1678886400000,
        "game": "Connect 4",
        "result": "Red Won",
        "opponent": "AI (Hard)",
        "date": "11/8/2025",
        "moves": [
          { "player": "R", "col": 3 },
          { "player": "Y", "col": 2 }
        ]
      }
    ]
  },
  "theme": "royal"
}
```
| File             | Description                                    |
| ---------------- | ---------------------------------------------- |
| `index.html`     | Login and registration page.                   |
| `index.js`       | Handles authentication logic.                  |
| `hub.html`       | Main menu after login.                         |
| `hub.js`         | Greets the user and manages logout.            |
| `tictactoe.html` | Game page for Tic-Tac-Toe.                     |
| `tictactoe.js`   | Core game logic and Minimax AI.                |
| `connect4.html`  | Game page for Connect 4.                       |
| `connect4.js`    | Manages board, gravity, win checks, and AI.    |
| `connect4.css`   | Grid layout and piece animations.              |
| `replay.html`    | Replay viewer page.                            |
| `replay.js`      | Loads and replays saved games.                 |
| `global.js`      | Shared utilities (auth, theme, storage).       |
| `global.css`     | Global styling and themes.                     |
| `dashboard.js`   | Renders user statistics charts using Chart.js. |

Here’s your entire section — perfectly formatted for GitHub Markdown (so it displays exactly right in the preview).
✅ The table, subpoints, and line breaks are all properly aligned.
✅ Works directly if pasted into README.md.

## Project File Overview

| File             | Description                                    |
| ---------------- | ---------------------------------------------- |
| `index.html`     | Login and registration page.                   |
| `index.js`       | Handles authentication logic.                  |
| `hub.html`       | Main menu after login.                         |
| `hub.js`         | Greets the user and manages logout.            |
| `tictactoe.html` | Game page for Tic-Tac-Toe.                     |
| `tictactoe.js`   | Core game logic and Minimax AI.                |
| `connect4.html`  | Game page for Connect 4.                       |
| `connect4.js`    | Manages board, gravity, win checks, and AI.    |
| `connect4.css`   | Grid layout and piece animations.              |
| `replay.html`    | Replay viewer page.                            |
| `replay.js`      | Loads and replays saved games.                 |
| `global.js`      | Shared utilities (auth, theme, storage).       |
| `global.css`     | Global styling and themes.                     |
| `dashboard.js`   | Renders user statistics charts using Chart.js. |

---

### 1. `index.html`
The landing page of the application that allows users to **register or log in**.  
It contains a simple form interface for username and password input and links to the main game hub once a user is authenticated.  
The layout uses reusable styles from `global.css`.

### 2. `index.js`
Handles **authentication logic**:
- `handleRegister()` validates and stores new users in `localStorage` (`gameHubUsers`).
- `handleLogin()` authenticates existing users and initializes their profile data (`gameStats` and `gameReplays`).
- On success, it sets `currentUser` and redirects to `hub.html`.

### 3. `hub.html`
The **main dashboard** after login.  
Displays a welcome message, theme toggle, and game selection options (Tic-Tac-Toe or Connect 4).  
Includes navigation links to stats, replay pages, and logout.

### 4. `hub.js`
Provides **dashboard interactivity**:
- Displays the current user’s name dynamically.
- Implements `handleLogout()` to clear `currentUser`.
- Invokes `applyTheme()` from `global.js` to maintain the saved theme across sessions.

### 5. `tictactoe.html`
Dedicated page for the **Tic-Tac-Toe game**.  
Contains the 3×3 grid, control buttons for difficulty level, timer, and restart, as well as a stats section that updates after every match.

### 6. `tictactoe.js`
Implements the **entire Tic-Tac-Toe game logic**:
- Represents the board as a 9-element array.
- Handles user clicks via `onCellClick()`.
- Checks winning lines using predefined `WIN_LINES`.
- Contains a **Minimax AI** that ensures unbeatable play at hard difficulty.
- Updates `gameStats` and `gameReplays` in `localStorage` upon each completed game.

### 7. `connect4.html`
Hosts the **Connect 4 interface**:  
A 6×7 grid built using CSS Grid Layout.  
Includes a header for game status, difficulty selection, and links back to the hub.  
Each cell is a `.connect4-slot` with `data-row` and `data-col` attributes for mapping JS logic to the DOM.

### 8. `connect4.js`
Contains the **core logic for Connect 4**, including:
- Dynamic 6×7 board initialization.
- `getDropRow()` simulates gravity by finding the lowest empty slot in a column.
- Computer opponent implemented using Minimax with Alpha-Beta Pruning and a heuristic evaluator (`scorePosition()`).
- Win detection checks all 76 possible 4-in-a-row combinations.
- Includes replay saving and timer handling.

### 9. `connect4.css`
Defines the **styling and animations** for Connect 4:
- Uses `display: grid` and `grid-template-columns: repeat(7, ...)`.
- Styles empty slots and colored discs (`.piece.red`, `.piece.yellow`).
- Includes winning animation effects (`.win-pulse`).
- Provides smooth “drop-in” animations via `@keyframes`.

### 10. `replay.html`
Displays the **game replay viewer** interface.  
Allows users to rewatch completed games stored in `localStorage`.  
Loads the correct replay based on the replay ID passed in the URL query string.

### 11. `replay.js`
Implements **replay playback logic**:
- Retrieves replay data from `gameReplays` using the current user ID and replay ID.
- Reconstructs the game step-by-step using `setInterval`.
- For Connect 4, re-simulates gravity to show realistic piece drops.
- Supports play/pause/reset controls.

### 12. `global.js`
Contains **utility functions and shared logic** across all pages:
- `getDb()` and `setDb()` for safe access to `localStorage`.
- `authCheck()` redirects unauthorized users to `index.html`.
- `applyTheme()` applies stored theme preferences.
- Centralizes constants and helper methods for consistency.

### 13. `global.css`
Defines **global styling rules**:
- CSS variables for dark/light themes using `:root` and `.light-theme`.
- Shared styles for buttons, headers, forms, and cards.
- Implements the UI theme switcher and common animations.

### 14. `dashboard.js` (optional)
Responsible for rendering **user performance statistics** on the dashboard.  
Uses **Chart.js** to generate pie charts for Tic-Tac-Toe and Connect 4 results.  
Reads data from the `gameStats` object of the logged-in user.

---

## File Interactions Summary
- `index.html` → `hub.html` (after login)  
- `hub.html` → `tictactoe.html` or `connect4.html` (game selection)  
- `tictactoe.js` and `connect4.js` → update shared data via `global.js`  
- `replay.js` → reads data from `gameReplays` and visualizes past games  
- `global.js` → provides helper functions used across all scripts  

---

## Key Challenges & Solutions

### 1. AI Blocking the UI
**Challenge:** The Minimax search can freeze the browser.  
**Solution:** Wrapped logic in `setTimeout(..., 300)` to allow UI updates before computation, simulating “thinking time”.

### 2. State Management & Immutability
**Challenge:** Passing the board by reference caused unwanted state mutations.  
**Solution:** Implemented `copyBoard()` (`b.map(row => row.slice())`) to ensure isolated simulations.

### 3. Heuristic Tuning
**Challenge:** Balancing weights for Connect 4’s evaluation function.  
**Solution:** Adjusted heuristics iteratively through self-play simulations.

---

## Future Enhancements
- Cloud profiles using Firebase for synced data.  
- Online multiplayer via WebSockets (Socket.io).  
- Smarter opponent using TensorFlow.js (Neural Networks or MCTS).  
- Add more games (Othello, Checkers, Chess).  
- Enhanced animations and sound effects with Howler.js or Lottie.  

---

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript
- **Storage:** Browser localStorage
- **Deployment:** GitHub Pages
  


