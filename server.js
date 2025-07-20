// Tic Tac Toe with Vibe - Server
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// Game rooms storage
const gameRooms = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle player joining a game
  socket.on('joinGame', (data) => {
    const { roomId, playerName } = data;
    let room;

    // If room exists and has only one player, join it
    if (gameRooms.has(roomId) && gameRooms.get(roomId).players.length < 2) {
      room = gameRooms.get(roomId);
      
      // Add player to room
      room.players.push({
        id: socket.id,
        name: playerName,
        symbol: 'O' // Second player is O
      });

      // Join the socket room
      socket.join(roomId);

      // Notify both players that the game is ready
      io.to(roomId).emit('gameReady', {
        roomId,
        players: room.players,
        currentPlayer: room.currentPlayer
      });
    } 
    // If room doesn't exist or is full, create a new one
    else {
      // Generate a new room ID if none provided
      const newRoomId = roomId || Math.random().toString(36).substring(2, 8);
      
      // Create new room
      room = {
        players: [{
          id: socket.id,
          name: playerName,
          symbol: 'X' // First player is X
        }],
        board: Array(9).fill(null),
        currentPlayer: 'X',
        gameOver: false,
        winningCombination: null
      };

      // Store room
      gameRooms.set(newRoomId, room);

      // Join the socket room
      socket.join(newRoomId);

      // Notify player that they're waiting for an opponent
      socket.emit('waitingForOpponent', {
        roomId: newRoomId,
        player: room.players[0]
      });
    }
  });

  // Handle player making a move
  socket.on('makeMove', (data) => {
    const { roomId, index } = data;
    
    // Check if room exists
    if (!gameRooms.has(roomId)) {
      socket.emit('error', { message: 'Game room not found' });
      return;
    }

    const room = gameRooms.get(roomId);
    
    // Find the player
    const player = room.players.find(p => p.id === socket.id);
    if (!player) {
      socket.emit('error', { message: 'Player not found in this game' });
      return;
    }

    // Check if it's the player's turn
    if (player.symbol !== room.currentPlayer) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    // Check if the move is valid
    if (room.gameOver || index < 0 || index > 8 || room.board[index] !== null) {
      socket.emit('error', { message: 'Invalid move' });
      return;
    }

    // Make the move
    room.board[index] = player.symbol;

    // Check for winner
    const winner = checkWinner(room.board);
    if (winner) {
      room.gameOver = true;
      room.winningCombination = getWinningCombination(room.board);
      
      // Notify players of the winner
      io.to(roomId).emit('gameOver', {
        winner,
        winningCombination: room.winningCombination,
        board: room.board
      });
      return;
    }

    // Check for draw
    if (!room.board.includes(null)) {
      room.gameOver = true;
      
      // Notify players of the draw
      io.to(roomId).emit('gameOver', {
        draw: true,
        board: room.board
      });
      return;
    }

    // Switch current player
    room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';

    // Notify players of the updated game state
    io.to(roomId).emit('gameUpdate', {
      board: room.board,
      currentPlayer: room.currentPlayer
    });
  });

  // Handle player requesting to restart the game
  socket.on('restartGame', (data) => {
    const { roomId } = data;
    
    // Check if room exists
    if (!gameRooms.has(roomId)) {
      socket.emit('error', { message: 'Game room not found' });
      return;
    }

    const room = gameRooms.get(roomId);
    
    // Reset the game state
    room.board = Array(9).fill(null);
    room.currentPlayer = 'X';
    room.gameOver = false;
    room.winningCombination = null;

    // Notify players of the game restart
    io.to(roomId).emit('gameRestart', {
      board: room.board,
      currentPlayer: room.currentPlayer
    });
  });

  // Handle player disconnecting
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Find and clean up any rooms the player was in
    for (const [roomId, room] of gameRooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        // Notify other player that their opponent left
        socket.to(roomId).emit('opponentLeft');
        
        // Remove the room if it's not being used
        if (room.players.length <= 1) {
          gameRooms.delete(roomId);
        } else {
          // Remove the player from the room
          room.players.splice(playerIndex, 1);
        }
      }
    }
  });
});

// Helper function to check for a winner
function checkWinner(board) {
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
  
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return the winning player
    }
  }
  
  return null; // No winner
}

// Helper function to get the winning combination
function getWinningCombination(board) {
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
  
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return pattern;
    }
  }
  
  return null;
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});