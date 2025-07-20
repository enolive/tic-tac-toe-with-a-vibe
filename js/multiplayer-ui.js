// Tic Tac Toe with Vibe - Multiplayer UI Components

/**
 * MultiplayerUI class that handles the multiplayer user interface
 */
class MultiplayerUI {
  /**
   * Initialize the UI
   * @param {MultiplayerGame} game - The multiplayer game instance
   */
  constructor(game) {
    this.game = game;
    this.boardElement = document.getElementById('game-board');
    this.statusElement = document.getElementById('game-status');
    this.resetButton = document.getElementById('reset-button');
    this.lobbyElement = document.getElementById('lobby');
    this.gameElement = document.getElementById('game-container');
    
    // Set up event handlers for the game
    this.setupGameEventHandlers();
    
    // Add event listener to reset button
    this.resetButton.addEventListener('click', () => {
      this.resetGame();
    });
  }

  /**
   * Set up event handlers for the multiplayer game
   */
  setupGameEventHandlers() {
    // Game is ready to start (both players joined)
    this.game.onGameReady = (data) => {
      this.showGame();
      this.updateUI();
      this.showNotification('Game started! You are playing as ' + this.game.player.symbol);
    };

    // Waiting for an opponent
    this.game.onWaitingForOpponent = (data) => {
      this.showWaitingScreen(data.roomId);
    };

    // Game state updated (after a move)
    this.game.onGameUpdate = (data) => {
      this.updateUI();
    };

    // Game over (win or draw)
    this.game.onGameOver = (data) => {
      this.updateUI();
      
      if (data.winner) {
        const isYouWinner = data.winner === this.game.player.symbol;
        this.showNotification(isYouWinner ? 'You won!' : 'You lost!');
      } else if (data.draw) {
        this.showNotification('Game ended in a draw!');
      }
    };

    // Game restarted
    this.game.onGameRestart = (data) => {
      this.updateUI();
      this.showNotification('Game restarted!');
    };

    // Opponent left the game
    this.game.onOpponentLeft = () => {
      this.showNotification('Your opponent left the game.');
      this.showLobby();
    };

    // Error handling
    this.game.onError = (data) => {
      this.showNotification('Error: ' + data.message, 'error');
    };
  }

  /**
   * Create the game board in the DOM
   */
  createBoard() {
    this.boardElement.innerHTML = '';

    // Create cells for the board
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;

      // Add click event listener to each cell
      cell.addEventListener('click', () => {
        this.handleCellClick(i);
      });

      this.boardElement.appendChild(cell);
    }

    // Update the UI with initial game state
    this.updateUI();
  }

  /**
   * Handle a click on a cell
   * @param {number} index - The index of the clicked cell
   */
  handleCellClick(index) {
    // Make a move in the game
    const moveSuccessful = this.game.makeMove(index);

    // Play click sound if the move was successful
    if (moveSuccessful && window.playSound) {
      window.playSound('click');
    }
  }

  /**
   * Update the UI based on the current game state
   */
  updateUI() {
    const state = this.game.getGameState();
    const cells = this.boardElement.querySelectorAll('.cell');

    // Update each cell
    cells.forEach((cell, index) => {
      const value = state.board[index];
      cell.textContent = value || '';

      // Remove previous classes
      cell.classList.remove('x', 'o', 'win');

      // Add appropriate class based on cell value
      if (value) {
        cell.classList.add(value.toLowerCase());
      }

      // Highlight winning cells
      if (state.winningCombination && state.winningCombination.includes(index)) {
        cell.classList.add('win');
      }
    });

    // Update game status
    if (state.winner) {
      const winnerName = state.players.find(p => p.symbol === state.winner)?.name || state.winner;
      this.statusElement.textContent = `Player ${winnerName} wins!`;
      
      // Play win sound
      if (state.gameOver && window.playSound) {
        window.playSound('win');
      }
    } else if (state.isDraw) {
      this.statusElement.textContent = 'Game ended in a draw!';
      
      // Play draw sound
      if (state.gameOver && window.playSound) {
        window.playSound('draw');
      }
    } else {
      const currentPlayerName = state.players.find(p => p.symbol === state.currentPlayer)?.name || state.currentPlayer;
      const isYourTurn = state.isYourTurn;
      
      this.statusElement.textContent = isYourTurn 
        ? 'Your turn' 
        : `Waiting for ${currentPlayerName}`;
    }

    // Add vibe effects based on game state
    this.addVibeEffects(state);
  }

  /**
   * Add vibe effects based on the game state
   * @param {Object} state - The current game state
   */
  addVibeEffects(state) {
    // Remove previous vibe classes
    document.body.classList.remove('vibe-win-x', 'vibe-win-o', 'vibe-draw');

    // Add appropriate vibe class
    if (state.winner === 'X') {
      document.body.classList.add('vibe-win-x');
    } else if (state.winner === 'O') {
      document.body.classList.add('vibe-win-o');
    } else if (state.isDraw) {
      document.body.classList.add('vibe-draw');
    }
  }

  /**
   * Reset the game
   */
  resetGame() {
    // Play click sound for reset button
    if (window.playSound) {
      window.playSound('click');
    }

    this.game.restartGame();
    
    // Remove vibe effects
    document.body.classList.remove('vibe-win-x', 'vibe-win-o', 'vibe-draw');
  }

  /**
   * Show the lobby screen
   */
  showLobby() {
    this.lobbyElement.style.display = 'block';
    this.gameElement.style.display = 'none';
  }

  /**
   * Show the game screen
   */
  showGame() {
    this.lobbyElement.style.display = 'none';
    this.gameElement.style.display = 'block';
    this.createBoard();
  }

  /**
   * Show the waiting for opponent screen
   * @param {string} roomId - The room ID to share
   */
  showWaitingScreen(roomId) {
    const waitingElement = document.getElementById('waiting-screen');
    const roomLinkElement = document.getElementById('room-link');
    
    // Set the room link
    const roomUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    roomLinkElement.textContent = roomUrl;
    roomLinkElement.href = roomUrl;
    
    // Show the waiting screen
    waitingElement.style.display = 'block';
    this.lobbyElement.style.display = 'none';
    this.gameElement.style.display = 'none';
  }

  /**
   * Show a notification message
   * @param {string} message - The message to show
   * @param {string} type - The type of notification (info, error)
   */
  showNotification(message, type = 'info') {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    notificationElement.style.display = 'block';
    
    // Hide the notification after 3 seconds
    setTimeout(() => {
      notificationElement.style.display = 'none';
    }, 3000);
  }

  /**
   * Initialize the lobby UI
   */
  initLobby() {
    const createGameForm = document.getElementById('create-game-form');
    const joinGameForm = document.getElementById('join-game-form');
    
    // Handle create game form submission
    createGameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const playerName = document.getElementById('create-player-name').value.trim();
      
      if (playerName) {
        this.game.joinGame(playerName);
      }
    });
    
    // Handle join game form submission
    joinGameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const playerName = document.getElementById('join-player-name').value.trim();
      const roomId = document.getElementById('room-id').value.trim();
      
      if (playerName && roomId) {
        this.game.joinGame(playerName, roomId);
      }
    });
    
    // Check if there's a room ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    
    if (roomId) {
      document.getElementById('room-id').value = roomId;
      document.getElementById('join-game-tab').click();
    }
  }
}

// Export the MultiplayerUI class if we're in a module environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MultiplayerUI };
}