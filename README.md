# Tic Tac Toe with Vibe!

A stylish, interactive tic-tac-toe game with a vibrant design and engaging features.

## Features

- Pure vanilla JavaScript implementation (no frameworks)
- Responsive web frontend
- Multiplayer support over the internet
- Vibrant, modern UI with animations and effects
- Sound effects for game actions (using local assets)
- Shareholder value metrics for management focus
- Test-driven development approach with included test suite

## How to Play

### Single Player Mode
1. Open `index.html` in your web browser
2. Click on any cell to make a move
3. The game alternates between X and O players
4. The first player to get three in a row (horizontally, vertically, or diagonally) wins
5. If all cells are filled and no player has won, the game ends in a draw
6. Click the "Reset Game" button to start a new game
7. Enjoy the sound effects that enhance the gaming experience!

### Multiplayer Mode
Want to play with friends over the internet? Check out the [Multiplayer Mode](#multiplayer-mode) section below!

## Project Structure

### Single Player
- `index.html` - Main game page (single player)
- `tests.html` - Test suite for game logic
- `sound-test.html` - Test page for sound effects
- `css/styles.css` - Styling for the game
- `js/game.js` - Core game logic
- `js/ui.js` - User interface components
- `js/app.js` - Main application and "vibe" elements
- `js/tests.js` - Test cases for game logic
- `assets/` - Directory containing sound effects and other assets

### Multiplayer
- `multiplayer.html` - Multiplayer game page
- `server.js` - Node.js server for multiplayer functionality
- `package.json` - Node.js dependencies and scripts
- `js/multiplayer-game.js` - Multiplayer game logic
- `js/multiplayer-ui.js` - Multiplayer user interface components
- `start-multiplayer.sh` - Shell script to start the multiplayer game (Linux/macOS/Windows with Bash)
- `start-multiplayer.bat` - Batch file to start the multiplayer game (Windows)
- `.gitignore` - Git configuration to exclude unnecessary files

## Development

This project follows Test-Driven Development (TDD) principles. To run the tests:

1. Open `tests.html` in your web browser
2. View the test results on the page

## Multiplayer Mode

Play Tic Tac Toe with friends over the internet!

### Setting Up the Server

#### Easy Setup
1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Clone this repository
3. Navigate to the project directory in your terminal
4. Run the appropriate start script:

   **For Linux/macOS/Windows with Bash:**
   ```
   bash start-multiplayer.sh
   ```

   **For Windows:**
   ```
   start-multiplayer.bat
   ```

   These scripts will install dependencies, start the server, and open the multiplayer page in your browser.

#### Manual Setup
1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Clone this repository
3. Navigate to the project directory in your terminal
4. Install dependencies:
   ```
   npm install
   ```
5. Start the server:
   ```
   npm start
   ```
6. The server will start on port 3000 (or the port specified in your environment variables)
7. Open `multiplayer.html` in your web browser

### Playing Multiplayer Games

1. Open `multiplayer.html` in your web browser
2. To create a new game:
   - Click the "Create Game" tab
   - Enter your name
   - Click "Create Game"
   - Share the generated game code or link with a friend
3. To join an existing game:
   - Click the "Join Game" tab
   - Enter your name
   - Enter the game code shared with you
   - Click "Join Game"
4. Once both players have joined, the game will start automatically
5. Take turns making moves
6. The game will indicate whose turn it is and notify players of the outcome

## Shareholder Value

This application emphasizes shareholder value by:

- Tracking key performance metrics in real-time
- Providing engaging user experience to maximize retention
- Using modern design principles to appeal to target demographics
- Implementing a scalable architecture for future enhancements
- Supporting multiplayer functionality to increase user engagement and retention
