// Tic Tac Toe with Vibe - Main Application

/**
 * Initialize the application when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create a new game instance
  const game = new Game();

  // Create a new UI instance with the game
  const ui = new UI(game);

  // Add vibe elements
  addVibeElements();

  console.log('Tic Tac Toe with Vibe initialized!');
});

/**
 * Add additional vibe elements to the game
 */
function addVibeElements() {
  // Add background particles
  createParticles();

  // Add sound effects
  setupSoundEffects();

  // Add shareholder value metrics
  setupShareholderMetrics();
}

/**
 * Create background particles for visual effect
 */
function createParticles() {
  const container = document.querySelector('.container');
  const particlesContainer = document.createElement('div');
  particlesContainer.classList.add('particles-container');

  // Create particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Random position, size, and animation delay
    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 5}s`;

    particlesContainer.appendChild(particle);
  }

  // Insert particles container before the main container
  document.body.insertBefore(particlesContainer, container);

  // Add CSS for particles
  const style = document.createElement('style');
  style.textContent = `
    .particles-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
    }

    .particle {
      position: absolute;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      animation: float 15s infinite linear;
    }

    @keyframes float {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }

    /* Vibe win effects */
    .vibe-win-x {
      animation: pulse-x 2s infinite;
    }

    .vibe-win-o {
      animation: pulse-o 2s infinite;
    }

    .vibe-draw {
      animation: pulse-draw 2s infinite;
    }

    @keyframes pulse-x {
      0% {
        background: linear-gradient(135deg, var(--dark-color), #1a1e24);
      }
      50% {
        background: linear-gradient(135deg, var(--primary-color), var(--dark-color));
      }
      100% {
        background: linear-gradient(135deg, var(--dark-color), #1a1e24);
      }
    }

    @keyframes pulse-o {
      0% {
        background: linear-gradient(135deg, var(--dark-color), #1a1e24);
      }
      50% {
        background: linear-gradient(135deg, var(--secondary-color), var(--dark-color));
      }
      100% {
        background: linear-gradient(135deg, var(--dark-color), #1a1e24);
      }
    }

    @keyframes pulse-draw {
      0% {
        background: linear-gradient(135deg, var(--dark-color), #1a1e24);
      }
      50% {
        background: linear-gradient(135deg, var(--accent-color), var(--dark-color));
      }
      100% {
        background: linear-gradient(135deg, var(--dark-color), #1a1e24);
      }
    }
  `;

  document.head.appendChild(style);
}

/**
 * Set up sound effects for the game
 */
function setupSoundEffects() {
  // Create audio elements with local assets
  const clickSound = document.createElement('audio');
  clickSound.id = 'click-sound';
  // Using local asset for click sound
  clickSound.src = 'assets/slap-hurt-pain-sound-effect-262618.mp3';
  clickSound.preload = 'auto';

  const winSound = document.createElement('audio');
  winSound.id = 'win-sound';
  // Using local asset for win sound
  winSound.src = 'assets/slap-hurt-pain-sound-effect-262618.mp3';
  winSound.preload = 'auto';

  const drawSound = document.createElement('audio');
  drawSound.id = 'draw-sound';
  // Using local asset for draw sound
  drawSound.src = 'assets/slap-hurt-pain-sound-effect-262618.mp3';
  drawSound.preload = 'auto';

  // Add to document
  document.body.appendChild(clickSound);
  document.body.appendChild(winSound);
  document.body.appendChild(drawSound);

  // Create a global function to play sounds that can be called from UI class
  window.playSound = function(soundType) {
    const sound = document.getElementById(`${soundType}-sound`);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Audio play failed:', e));
    }
  };
}

/**
 * Set up shareholder value metrics for management focus
 */
function setupShareholderMetrics() {
  // Create metrics container
  const metricsContainer = document.createElement('div');
  metricsContainer.classList.add('metrics-container');
  metricsContainer.innerHTML = `
    <h3>Shareholder Value Metrics</h3>
    <div class="metric">
      <span>Player Engagement:</span>
      <div class="progress-bar">
        <div class="progress" id="engagement-progress" style="width: 75%"></div>
      </div>
      <span>75%</span>
    </div>
    <div class="metric">
      <span>Revenue Potential:</span>
      <div class="progress-bar">
        <div class="progress" id="revenue-progress" style="width: 60%"></div>
      </div>
      <span>60%</span>
    </div>
    <div class="metric">
      <span>Market Position:</span>
      <div class="progress-bar">
        <div class="progress" id="market-progress" style="width: 85%"></div>
      </div>
      <span>85%</span>
    </div>
  `;

  // Add to document
  document.querySelector('.container').appendChild(metricsContainer);

  // Add CSS for metrics
  const style = document.createElement('style');
  style.textContent = `
    .metrics-container {
      margin-top: 2rem;
      padding: 1rem;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      text-align: left;
    }

    .metrics-container h3 {
      color: var(--accent-color);
      margin-bottom: 1rem;
      text-align: center;
    }

    .metric {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .metric span {
      flex: 1;
    }

    .progress-bar {
      flex: 2;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      overflow: hidden;
      margin: 0 0.5rem;
    }

    .progress {
      height: 100%;
      background-color: var(--accent-color);
    }

    #engagement-progress {
      background-color: var(--primary-color);
    }

    #revenue-progress {
      background-color: var(--secondary-color);
    }

    #market-progress {
      background-color: var(--accent-color);
    }
  `;

  document.head.appendChild(style);

  // Update metrics randomly to simulate real-time data
  setInterval(() => {
    const engagementProgress = document.getElementById('engagement-progress');
    const revenueProgress = document.getElementById('revenue-progress');
    const marketProgress = document.getElementById('market-progress');

    const randomChange = () => (Math.random() * 10) - 5;

    const updateMetric = (element, value) => {
      const newValue = Math.max(0, Math.min(100, value + randomChange()));
      element.style.width = `${newValue}%`;
      element.parentElement.nextElementSibling.textContent = `${Math.round(newValue)}%`;
      return newValue;
    };

    updateMetric(engagementProgress, parseFloat(engagementProgress.style.width));
    updateMetric(revenueProgress, parseFloat(revenueProgress.style.width));
    updateMetric(marketProgress, parseFloat(marketProgress.style.width));
  }, 5000);
}
