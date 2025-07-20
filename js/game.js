// Tic Tac Toe with Vibe - Game Logic

/**
 * Game class that handles the core game logic
 */
class Game {
  /**
   * Initialize a new game
   */
  constructor() {
    this.resetGame();
  }
  
  /**
   * Reset the game to its initial state
   */
  resetGame() {
    // Create an empty 3x3 board (represented as a flat array)
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameOver = false;
    this.winningCombination = null;
  }
  
  /**
   * Make a move at the specified index
   * @param {number} index - The index on the board (0-8)
   * @returns {boolean} - Whether the move was successful
   */
  makeMove(index) {
    // Check if the move is valid
    if (this.gameOver || index < 0 || index > 8 || this.board[index] !== null) {
      return false;
    }
    
    // Make the move
    this.board[index] = this.currentPlayer;
    
    // Check for a winner
    const winner = this.checkWinner();
    if (winner) {
      this.gameOver = true;
      return true;
    }
    
    // Check for a draw
    if (this.checkDraw()) {
      this.gameOver = true;
      return true;
    }
    
    // Switch players
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    return true;
  }
  
  /**
   * Check if there's a winner
   * @returns {string|null} - The winning player ('X' or 'O') or null if no winner
   */
  checkWinner() {
    // Define all possible winning combinations
    const winPatterns = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal top-left to bottom-right
      [2, 4, 6]  // diagonal top-right to bottom-left
    ];
    
    // Check each winning pattern
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] && 
        this.board[a] === this.board[b] && 
        this.board[a] === this.board[c]
      ) {
        this.winningCombination = pattern;
        return this.board[a]; // Return the winning player
      }
    }
    
    return null; // No winner
  }
  
  /**
   * Check if the game is a draw
   * @returns {boolean} - Whether the game is a draw
   */
  checkDraw() {
    // If there's a winner, it's not a draw
    if (this.checkWinner()) {
      return false;
    }
    
    // If any cell is empty, it's not a draw
    return !this.board.includes(null);
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
      winner: this.checkWinner(),
      isDraw: this.checkDraw(),
      winningCombination: this.winningCombination
    };
  }
}

// Export the Game class if we're in a module environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Game };
}