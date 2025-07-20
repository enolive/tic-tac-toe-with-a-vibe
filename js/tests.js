// Tic Tac Toe with Vibe - Tests
// Simple test framework for TDD approach

// Test suite for game logic
const runTests = () => {
  console.log('Running Tic Tac Toe tests...');
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Helper function to assert equality
  const assertEqual = (actual, expected, testName) => {
    totalTests++;
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      console.log(`✅ PASSED: ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ FAILED: ${testName}`);
      console.error(`   Expected: ${JSON.stringify(expected)}`);
      console.error(`   Actual: ${JSON.stringify(actual)}`);
    }
  };
  
  // Test: Initial board should be empty
  (() => {
    const game = new Game();
    assertEqual(game.board, [null, null, null, null, null, null, null, null, null], 
      'Initial board should be empty');
  })();
  
  // Test: First player should be X
  (() => {
    const game = new Game();
    assertEqual(game.currentPlayer, 'X', 'First player should be X');
  })();
  
  // Test: Making a move should update the board
  (() => {
    const game = new Game();
    game.makeMove(0);
    assertEqual(game.board[0], 'X', 'Making a move should update the board');
  })();
  
  // Test: Making a move should switch players
  (() => {
    const game = new Game();
    game.makeMove(0);
    assertEqual(game.currentPlayer, 'O', 'Making a move should switch players');
  })();
  
  // Test: Cannot make a move on an occupied cell
  (() => {
    const game = new Game();
    game.makeMove(0);
    const result = game.makeMove(0);
    assertEqual(result, false, 'Cannot make a move on an occupied cell');
  })();
  
  // Test: Horizontal win condition
  (() => {
    const game = new Game();
    game.makeMove(0); // X
    game.makeMove(3); // O
    game.makeMove(1); // X
    game.makeMove(4); // O
    game.makeMove(2); // X
    assertEqual(game.checkWinner(), 'X', 'Horizontal win condition should be detected');
  })();
  
  // Test: Vertical win condition
  (() => {
    const game = new Game();
    game.makeMove(0); // X
    game.makeMove(1); // O
    game.makeMove(3); // X
    game.makeMove(2); // O
    game.makeMove(6); // X
    assertEqual(game.checkWinner(), 'X', 'Vertical win condition should be detected');
  })();
  
  // Test: Diagonal win condition
  (() => {
    const game = new Game();
    game.makeMove(0); // X
    game.makeMove(1); // O
    game.makeMove(4); // X
    game.makeMove(2); // O
    game.makeMove(8); // X
    assertEqual(game.checkWinner(), 'X', 'Diagonal win condition should be detected');
  })();
  
  // Test: Draw condition
  (() => {
    const game = new Game();
    // X | O | X
    // X | O | O
    // O | X | X
    game.board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    game.currentPlayer = 'X'; // Doesn't matter for this test
    assertEqual(game.checkDraw(), true, 'Draw condition should be detected');
  })();
  
  // Test: Game should not be a draw if there's a winner
  (() => {
    const game = new Game();
    game.board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
    game.currentPlayer = 'O';
    assertEqual(game.checkDraw(), false, 'Game should not be a draw if there\'s a winner');
  })();
  
  // Test: Reset game should clear the board and set player to X
  (() => {
    const game = new Game();
    game.makeMove(0);
    game.makeMove(1);
    game.resetGame();
    assertEqual(game.board, [null, null, null, null, null, null, null, null, null], 
      'Reset game should clear the board');
    assertEqual(game.currentPlayer, 'X', 'Reset game should set player to X');
  })();
  
  // Summary
  console.log(`Tests completed: ${passedTests} passed out of ${totalTests} total tests.`);
  return passedTests === totalTests;
};

// Run tests when this file is loaded directly
if (typeof window !== 'undefined' && window.location.pathname.includes('tests.html')) {
  window.onload = runTests;
}