// Tic Tac Toe with Vibe - UI Components

/**
 * UI class that handles the user interface
 */
class UI {
  /**
   * Initialize the UI
   * @param {Game} game - The game instance
   */
  constructor(game) {
    this.game = game;
    this.boardElement = document.getElementById('game-board');
    this.statusElement = document.getElementById('game-status');
    this.resetButton = document.getElementById('reset-button');

    // Initialize the board
    this.createBoard();

    // Add event listener to reset button
    this.resetButton.addEventListener('click', () => {
      this.resetGame();
    });
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

    // Update the UI if the move was successful
    if (moveSuccessful) {
      // Play click sound
      if (window.playSound) {
        window.playSound('click');
      }
      this.updateUI();
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
      this.statusElement.textContent = `Player ${state.winner} wins!`;
    } else if (state.isDraw) {
      this.statusElement.textContent = 'Game ended in a draw!';
    } else {
      this.statusElement.textContent = `Player ${state.currentPlayer}'s turn`;
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

    // Add appropriate vibe class and play sounds
    if (state.winner === 'X' || state.winner === 'O') {
      // Add visual effect
      document.body.classList.add(state.winner === 'X' ? 'vibe-win-x' : 'vibe-win-o');

      // Play win sound if the game just ended (check if gameOver was just set)
      if (state.gameOver && window.playSound) {
        window.playSound('win');
      }
    } else if (state.isDraw) {
      // Add visual effect
      document.body.classList.add('vibe-draw');

      // Play draw sound if the game just ended
      if (state.gameOver && window.playSound) {
        window.playSound('draw');
      }
    }
  }

  /**
   * Reset the game and update the UI
   */
  resetGame() {
    // Play click sound for reset button
    if (window.playSound) {
      window.playSound('click');
    }

    this.game.resetGame();
    this.updateUI();

    // Remove vibe effects
    document.body.classList.remove('vibe-win-x', 'vibe-win-o', 'vibe-draw');
  }
}

// Export the UI class if we're in a module environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UI };
}
