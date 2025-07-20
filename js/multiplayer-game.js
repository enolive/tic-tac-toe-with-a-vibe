// Tic Tac Toe with Vibe - Multiplayer Game Logic

/**
 * MultiplayerGame class that handles the multiplayer game logic
 */
class MultiplayerGame {
  /**
   * Initialize a new multiplayer game
   * @param {Socket} socket - The Socket.IO socket instance
   */
  constructor(socket) {
    this.socket = socket;
    this.roomId = null;
    this.player = null;
    this.players = [];
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameOver = false;
    this.winningCombination = null;
    this.setupSocketListeners();
  }

  /**
   * Set up Socket.IO event listeners
   */
  setupSocketListeners() {
    // Game is ready to start (both players joined)
    this.socket.on('gameReady', (data) => {
      this.roomId = data.roomId;
      this.players = data.players;
      this.currentPlayer = data.currentPlayer;
      this.board = Array(9).fill(null);
      this.gameOver = false;
      this.winningCombination = null;
      
      // Find this player in the players array
      this.player = this.players.find(p => p.id === this.socket.id);
      
      // Trigger the gameReady event for UI to update
      if (this.onGameReady) {
        this.onGameReady(data);
      }
    });

    // Waiting for an opponent
    this.socket.on('waitingForOpponent', (data) => {
      this.roomId = data.roomId;
      this.player = data.player;
      
      // Trigger the waitingForOpponent event for UI to update
      if (this.onWaitingForOpponent) {
        this.onWaitingForOpponent(data);
      }
    });

    // Game state updated (after a move)
    this.socket.on('gameUpdate', (data) => {
      this.board = data.board;
      this.currentPlayer = data.currentPlayer;
      
      // Trigger the gameUpdate event for UI to update
      if (this.onGameUpdate) {
        this.onGameUpdate(data);
      }
    });

    // Game over (win or draw)
    this.socket.on('gameOver', (data) => {
      this.board = data.board;
      this.gameOver = true;
      
      if (data.winner) {
        this.winningCombination = data.winningCombination;
      }
      
      // Trigger the gameOver event for UI to update
      if (this.onGameOver) {
        this.onGameOver(data);
      }
    });

    // Game restarted
    this.socket.on('gameRestart', (data) => {
      this.board = data.board;
      this.currentPlayer = data.currentPlayer;
      this.gameOver = false;
      this.winningCombination = null;
      
      // Trigger the gameRestart event for UI to update
      if (this.onGameRestart) {
        this.onGameRestart(data);
      }
    });

    // Opponent left the game
    this.socket.on('opponentLeft', () => {
      // Trigger the opponentLeft event for UI to update
      if (this.onOpponentLeft) {
        this.onOpponentLeft();
      }
    });

    // Error handling
    this.socket.on('error', (data) => {
      console.error('Game error:', data.message);
      
      // Trigger the error event for UI to update
      if (this.onError) {
        this.onError(data);
      }
    });
  }

  /**
   * Join a game room
   * @param {string} playerName - The player's name
   * @param {string} roomId - Optional room ID to join a specific game
   */
  joinGame(playerName, roomId = null) {
    this.socket.emit('joinGame', {
      playerName,
      roomId
    });
  }

  /**
   * Make a move at the specified index
   * @param {number} index - The index on the board (0-8)
   * @returns {boolean} - Whether the move request was sent
   */
  makeMove(index) {
    // Check if it's this player's turn
    if (this.gameOver || this.currentPlayer !== this.player.symbol) {
      return false;
    }
    
    // Send the move to the server
    this.socket.emit('makeMove', {
      roomId: this.roomId,
      index
    });
    
    return true;
  }

  /**
   * Request to restart the game
   */
  restartGame() {
    this.socket.emit('restartGame', {
      roomId: this.roomId
    });
  }

  /**
   * Get the current game state
   * @returns {Object} - The current game state
   */
  getGameState() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
      winner: this.getWinner(),
      isDraw: this.isDraw(),
      winningCombination: this.winningCombination,
      player: this.player,
      players: this.players,
      roomId: this.roomId,
      isYourTurn: this.player && this.currentPlayer === this.player.symbol
    };
  }

  /**
   * Get the winner of the game
   * @returns {string|null} - The winning player ('X' or 'O') or null if no winner
   */
  getWinner() {
    if (!this.winningCombination) {
      return null;
    }
    
    const [a] = this.winningCombination;
    return this.board[a];
  }

  /**
   * Check if the game is a draw
   * @returns {boolean} - Whether the game is a draw
   */
  isDraw() {
    return this.gameOver && !this.getWinner() && !this.board.includes(null);
  }
}

// Export the MultiplayerGame class if we're in a module environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MultiplayerGame };
}