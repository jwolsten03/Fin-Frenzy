let activeTouch   = false;   // true while finger is on screen
let touchStartT   = 0;       // timestamp when touch started
const TAP_LIMIT   = 120;     // ms threshold between tap vs hold

const tinyFinLogo = new Image();
tinyFinLogo.src = "assets/tinyfin-logo.png";

let currentProfileTab = "stats"; // "stats" or "achievements"
let currentShopTab = "traditional";

let skinPage = 0;
const skinsPerPage = 3;
let shopPage = 0;
const shopSkinsPerPage = 4;
let achievementPage = 0;
const achievementsPerPage = 2;


// Stats (saved to localStorage)
const savedStats = JSON.parse(localStorage.getItem("finfrenzy_stats")) || {
  totalGames: 0,
  mostCoins: 0,
  totalPowerups: 0
};
let stats = { ...savedStats };
let powerUpsCollectedThisRun = 0;

let currentXP = parseFloat(localStorage.getItem("finfrenzy_xp") || "0");
let currentLevel = parseInt(localStorage.getItem("finfrenzy_level") || "1");
let xpToNextLevel = 100; // base XP required for level 1→2
let lastLevelScore = 0;
let levelUpMessages = [];
let levelUpsThisRun = [];
let lastPowerUpsCollected = 0;
let poisonTimer = 0;
let playerFacing = 1;       // current facing, smoothly animated
let targetFacing = 1;       // target facing, instantly changes
let sharkEventCompleted = false;

let activeCurrent = null; // holds current info or null
let currentSpawnTimer = 0;
let firebaseLeaderboard = null;

const profileBg = new Image();
profileBg.src = "assets/profile-bg.png";
const backgroundImage = new Image();
backgroundImage.src = "assets/underwater-bg3.png";
const shopBg = new Image();
shopBg.src = "assets/shop-bg2.png"; // or just "shop-bg.png" if it's in the same folder
const leaderboardBg = new Image();
leaderboardBg.src = "assets/leaderboard-bg.png"



let boostPressedLastFrame = false;

const backgroundMusic = new Audio("assets/background.wav");
backgroundMusic.loop = true;       // Loop it forever
backgroundMusic.volume = 0.2;      // Set volume (0.0 to 1.0)

const currentImg = new Image();
currentImg.src = "assets/current.png";

const defaultPreview = new Image();
defaultPreview.src = "assets/hero-fish.png";
const redfinPreview = new Image();
redfinPreview.src = "assets/hero-fish-red.png";
const stealthPreview = new Image();
stealthPreview.src = "assets/hero-fish-stealth.png";
const armyfinPreview = new Image();
armyfinPreview.src = "assets/hero-fish-army.png";
const navyfinPreview = new Image();
navyfinPreview.src = "assets/hero-fish-navy.png";
const airforcefinPreview = new Image();
airforcefinPreview.src = "assets/hero-fish-airforce.png";
const marinefinPreview = new Image();
marinefinPreview.src = "assets/hero-fish-marine.png";
const infernofinPreview = new Image();
infernofinPreview.src = "assets/hero-fish-inferno.png"; // adjust filename if needed
const frostbitefinPreview = new Image();
frostbitefinPreview.src = "assets/hero-fish-frostbite.png"; // adjust filename if needed
const fancyfinPreview = new Image();
fancyfinPreview.src = "assets/hero-fish-fancy.png";

const chompSound = new Audio("assets/chomp.wav");
chompSound.volume = 0.5; // adjust if too loud



const skins = [
  { id: "default", name: "Classic Fin", price: 0, unlocked: true, tab: "traditional", description: "The reliable fish you know and love." },
  { id: "redfin", name: "Red Fin", price: 250, unlocked: false, tab: "traditional", description: "A bold red look to stand out in the sea." },
  { id: "stealth", name: "Stealth Fin", price: 500, unlocked: false, tab: "traditional", description: "Silent. Sleek. Deadly." },
  { id: "army", name: "Army Fin", price: 1500, unlocked: false, tab: "themed", description: "Ready for underwater combat." },
  { id: "navy", name: "Navy Fin", price: 1500, unlocked: false, tab: "themed", description: "A true sailor of the deep." },
  { id: "airforce", name: "Air Force Fin", price: 1500, unlocked: false, tab: "themed", description: "Sky’s the limit — even when you're underwater." },
  { id: "marine", name: "Marine Fin", price: 1500, unlocked: false, tab: "themed", description: "First in, last out — even underwater." },
  { id: "inferno", name: "Inferno Fin", price: 5000, unlocked: false, tab: "highlevel", requiredLevel: 50, description: "Blazing through the sea with unmatched fire." },
  { id: "frostbite", name: "Frostbite Fin", price: 5000, unlocked: false, tab: "highlevel", requiredLevel: 50, description: "Colder than the Arctic trench." },
  { id: "goat", name: "Goat Fin", price: 2000, unlocked: false, tab: "themed", description: "Brilliant underwater explorer. Still eats seaweed like it's grass." },
  { id: "cat", name: "Cat Fin", price: 2000, unlocked: false, tab: "themed", description: "This fin hates water but still looks fabulous." },
  { id: "dog", name: "Dog Fin", price: 2000, unlocked: false, tab: "themed", description: "Loyal, playful, and slightly soggy." },
  { id: "fancy", name: "Fancy Fin", price: 3000, unlocked: false, tab: "highlevel", requiredLevel: 25, description: "Formal fish attire for special occasions." },
];

let selectedSkin = localStorage.getItem("finfrenzy_selectedSkin") || "default";
const unlocked = JSON.parse(localStorage.getItem("finfrenzy_unlockedSkins") || '["default"]');
let skinProfileSelection = 0; // which skin the player is viewing in profile > skins
let currentShopSelection = 0; // track selection


// --- Hero fish sprite ---
const heroImg = new Image();
heroImg.src = "assets/hero-fish.png";
const redfinImg = new Image();
redfinImg.src = "assets/hero-fish-red.png";
const stealthfinImg = new Image();
stealthfinImg.src = "assets/hero-fish-stealth.png";

const goatfinPreview = new Image();
goatfinPreview.src = "assets/hero-fish-goat.png";
const catfinPreview = new Image();
catfinPreview.src = "assets/hero-fish-cat.png";
const dogfinPreview = new Image();
dogfinPreview.src = "assets/hero-fish-dog.png";


// --- Coin sprite ---
const coinImg = new Image();
coinImg.src = "assets/coin.png";     // make sure the filename matches


// --- Power‑up sprites ---
const powerImages = {
    shield:       new Image(),
    slowMo:       new Image(),
    doubleScore:  new Image(),
    magnet:       new Image(),
    chomp:        new Image()
  };
  
  powerImages.shield.src       = "assets/powerup-shield.png";
  powerImages.slowMo.src       = "assets/powerup-slowmo.png";
  powerImages.doubleScore.src  = "assets/powerup-doublescore.png";
  powerImages.magnet.src       = "assets/powerup-magnet.png";
  powerImages.chomp.src        = "assets/powerup-chomp.png";
  

const fishImages = {
    bounce: new Image(),
    float: new Image(),
    zigzag: new Image(),
    fall: new Image()
  };
  
  fishImages.bounce.src = "assets/fish-bounce.png";
  fishImages.float.src = "assets/fish-float.png";
  fishImages.zigzag.src = "assets/fish-zigzag.png";
  fishImages.fall.src = "assets/fish-fall.png";
  
let bgX = 0;
let globalSpeedMultiplier = 1;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let buttons = []; // Store button areas for click detection

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (canvas.width / canvas.clientWidth);
  const my = (e.clientY - rect.top) * (canvas.height / canvas.clientHeight);

  for (let b of buttons) {
    if (
      mx >= b.x &&
      mx <= b.x + b.width &&
      my >= b.y &&
      my <= b.y + b.height
    ) {
      b.onClick(); // ✅ Fire the button's associated action
      break;
    }
  }
});

let frameCount = 0;
let damageCooldown = 0;
// let edgeTimer = 0;  // (edge damage disabled; vars kept to avoid breaking old refs)
let health = 150;
const maxHealth = 150;
// let edgeDamageCooldown = 0; // (edge damage disabled; vars kept to avoid breaking old refs)
let damageFlashTimer = 0;
let coins = [];
let coinSpawnTimer = 0;
let coinsCollected = 0;
let powerUps = [];
let powerUpSpawnTimer = 0;
let activePowerUps = {
  shield: false,
  slowMo: false,
  doubleScore: false,
  magnet: false,
  chomp: false
};
let powerUpTimers = {
  slowMo: 0,
  doubleScore: 0,
  magnet: 0,
  chomp: 0
};



// Game states: title → playing → gameover
let state = "splash";
let splashTimer = 180; // 3 seconds at 60 FPS


// Player
let player = {};
let keys = {};

// Obstacles
let obstacles = [];
let obstacleSpawnTimer = 0;
let nextObstacleIn = 45 + Math.floor(Math.random() * 20); // 45–65
function getCurrentSpeed() {
  const baseSpeed = (2.5 + frameCount / 1200) * globalSpeedMultiplier;
  return isSharkEventActive() ? -baseSpeed : baseSpeed;  
  }
   
  

// Score
let score = 0;
let highScore = localStorage.getItem("boostdash_highscore") || 0;
let bestDistance = parseInt(localStorage.getItem("boostdash_bestDistance") || "0");
let totalCoins = parseInt(localStorage.getItem("boostdash_totalCoins") || "0");


// Sounds
const boostSound = new Audio("assets/boost.wav");
const crashSound = new Audio("assets/crash.wav");
const collectSound = new Audio("assets/collect.wav");

// Constants
const gravity = 0.5 * 0.75;
const boostPower = -10 * 0.75;

// ----------------- keyboard controls -----------------
document.addEventListener("keydown", e => {
    keys[e.code] = true;   
    if (state === "leaderboard") {
      if (e.key === "Escape" || e.key === "b") {
        firebaseLeaderboard = null; 
        state = "title";
      }
    }
    if (state === "title" && e.code === "Enter") startGame();
    if (state === "title" && e.code === "KeyS") state = "shop"; // temporary key
    if (state === "shop" && e.code === "Escape") state = "title";
    if (state === "shop") {
      // SKIN SELECTION — still use arrows or A/D
      const displayedSkins = currentShopTab === "traditional"
      ? skins.filter(s => ["default", "redfin", "stealth"].includes(s.id))
      : currentShopTab === "themed"
        ? skins.filter(s => ["army", "navy", "airforce", "marine"].includes(s.id))
        : skins.filter(s => s.tab === "highlevel"); // ← new condition

      // Allow navigating between items on the current page
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        currentShopSelection = (currentShopSelection - 1 + displayedSkins.length) % displayedSkins.length;
      }
      if (e.code === "ArrowDown" || e.code === "KeyS") {
        currentShopSelection = (currentShopSelection + 1) % displayedSkins.length;
      }
      // TAB SWITCHING — use Q and E
      if (e.code === "KeyQ") {
        currentShopTab = "traditional";
        shopPage = 0;
        currentShopSelection = 0; // reset selection
      }
      if (e.code === "KeyE") {
        currentShopTab = "themed";
        currentShopSelection = 0;
      }
      if (e.code === "KeyR") {
        currentShopTab = "highlevel";
        currentShopSelection = 0;
      } 
    
        if (e.code === "ArrowLeft" || e.code === "KeyA") {
          shopPage = Math.max(0, shopPage - 1);
          currentShopSelection = 0; // Reset selection
        }
        if (e.code === "ArrowRight" || e.code === "KeyD") {
          const totalSkins = skins.filter(s => s.tab === currentShopTab).length;
          const totalPages = Math.ceil(totalSkins / shopSkinsPerPage);
          shopPage = Math.min(totalPages - 1, shopPage + 1);
          currentShopSelection = 0;
        }
        
        
    
      if (e.code === "Enter") {
        const allTabSkins = skins.filter(s => s.tab === currentShopTab);
        const skinIndex = shopPage * shopSkinsPerPage + currentShopSelection;
        const skin = allTabSkins[skinIndex];

        const isUnlocked = unlocked.includes(skin.id);
    
        if (isUnlocked) {
          alert("You already own this skin!");
        } else if (skin.requiredLevel && currentLevel < skin.requiredLevel) {
          alert(`Reach level ${skin.requiredLevel} to buy this skin!`);
        } else if (totalCoins >= skin.price) {
          totalCoins -= skin.price;
          localStorage.setItem("boostdash_totalCoins", totalCoins);
          unlockSkin(skin.id);
          alert(`You purchased: ${skin.name}`);
        } else {
          alert("Not enough coins!");
        }
        
      }
    }
    
    
    
    if (state === "gameover" && e.code === "KeyR") state = "title";
    if (state === "title" && e.code === "KeyP") state = "profile";
    if (state === "profile") {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        if (currentProfileTab === "achievements") currentProfileTab = "stats";
        else if (currentProfileTab === "skins") currentProfileTab = "achievements";
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        if (currentProfileTab === "stats") currentProfileTab = "achievements";
        else if (currentProfileTab === "achievements") currentProfileTab = "skins";
      }
      if (e.code === "Escape" || e.code === "KeyB") state = "title";
      if (currentProfileTab === "skins") {
        const unlocked = JSON.parse(localStorage.getItem("finfrenzy_unlockedSkins") || '["default"]');
      
        if (e.code === "ArrowUp" || e.code === "KeyW") {
          skinProfileSelection = (skinProfileSelection - 1 + unlocked.length) % unlocked.length;
        }
      
        if (e.code === "ArrowDown" || e.code === "KeyS") {
          skinProfileSelection = (skinProfileSelection + 1) % unlocked.length;
        }
        skinProfileSelection = Math.max(0, Math.min(unlocked.length - 1, skinProfileSelection));
        if (e.code === "KeyQ") {
          skinPage = Math.max(0, skinPage - 1);
        }
        
        
        if (e.code === "KeyE") {
          const totalPages = Math.ceil(getOwnedSkins().length / skinsPerPage);
          skinPage = Math.min(totalPages - 1, skinPage + 1);
        }
        
        
      
        if (e.code === "Enter") {
          const selectedSkinId = unlocked[skinProfileSelection];
          localStorage.setItem("finfrenzy_equippedSkin", selectedSkinId);
          selectedSkin = selectedSkinId;
          updateHeroSprite(); // ✅ This is the important part
        }
      }
      else if (currentProfileTab === "achievements") {
        if (e.code === "KeyQ") {
          achievementPage = Math.max(0, achievementPage - 1);
        }
        if (e.code === "KeyE") {
          const totalPages = Math.ceil(getAchievements().length / achievementsPerPage);
          achievementPage = Math.min(totalPages - 1, achievementPage + 1);
        }
      }            
    }
    
    if (state === "playing" && e.code === "KeyP") {
      state = "paused";
      backgroundMusic.pause();
    } else if (state === "paused" && e.code === "KeyP") {
      state = "playing";
      backgroundMusic.play();
    } else if (state === "paused" && e.code === "KeyR") {
      state = "title";
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }    
  });
  document.addEventListener("keyup", e => keys[e.code] = false);
  
  // ----------------- touch controls -----------------
  window.addEventListener("contextmenu", e => e.preventDefault());
  
  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    activeTouch = true;
    touchStartT = performance.now();
    player.dy   = boostPower * 0.8;   // instant mini‑boost
  }, { passive: false });
  
  canvas.addEventListener("touchend", e => {
    e.preventDefault();
    activeTouch = false;              // stop boosting; gravity takes over
  }, { passive: false });

function getXPThreshold(level) {
    return Math.floor(100 * Math.pow(1.4, level - 1));
  }
  
  
  function getOwnedSkins() {
    const allSkins = [
      { id: "default", name: "Classic Fin", img: defaultPreview },
      { id: "redfin", name: "Red Fin", img: redfinPreview },
      { id: "stealth", name: "Stealth Fish", img: stealthPreview },
      { id: "army", name: "Army Fin", img: armyfinPreview },
      { id: "navy", name: "Navy Fin", img: navyfinPreview },
      { id: "airforce", name: "Air Force Fin", img: airforcefinPreview },
      { id: "marine", name: "Marine Fin", img: marinefinPreview },
      { id: "goat", name: "Goat Fin", img: goatfinPreview },        
      { id: "cat", name: "Cat Fin", img: catfinPreview },            
      { id: "dog", name: "Dog Fin", img: dogfinPreview },
      { id: "fancy", name: "Fancy Fin", img: fancyfinPreview },
      { id: "inferno", name: "Inferno Fin", img: infernofinPreview },
      { id: "frostbite", name: "Frostbite Fin", img: frostbitefinPreview }
    ];
    
    return allSkins.filter(s => unlocked.includes(s.id));
  }
  
  
/* --- responsive sizing helper --- */
function resizeCanvas() {
  const ratio = 800 / 500;        // game’s internal width / height
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w / h > ratio) w = h * ratio;   // letterbox horizontally
  else               h = w / ratio;   // letterbox vertically
  canvas.style.width  = w + "px";
  canvas.style.height = h + "px";
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
canvas.focus();


/* --- everything else: images, input listeners, gameLoop() --- */

function drawButton(label, x, y, width, height, onClick) {
  // Save button for click detection
  buttons.push({ x, y, width, height, onClick });

  // Draw button background
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  drawRoundedRect(x, y, width, height, 12);
  ctx.fill();

  // Outline
  ctx.strokeStyle = "#00ccff";
  ctx.lineWidth = 2;
  drawRoundedRect(x, y, width, height, 12);
  ctx.stroke();

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + width / 2, y + height / 2);
}

function renderLeaderboardScreen() {
  ctx.fillStyle = "#001";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (leaderboardBg.complete && leaderboardBg.naturalWidth > 0) {
    ctx.drawImage(leaderboardBg, 0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#ffb347");
  gradient.addColorStop(1, "#ff7f00");

  ctx.fillStyle = gradient;
  ctx.font = "bold 40px 'Sigmar One', cursive";
  ctx.textAlign = "center";
  ctx.shadowColor = "#ff7f00";
  ctx.shadowBlur = 12;
  ctx.fillText("Leaderboard", canvas.width / 2, 80);

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  ctx.font = "bold 24px 'Sigmar One', cursive";
  ctx.fillText("Top Scores:", canvas.width / 2, 140);

  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";

  if (firebaseLeaderboard === null) {
    ctx.fillText("Loading leaderboard...", canvas.width / 2, 200);
  } else {
    const textSpacing = 40;
    ctx.font = "bold 22px Arial";
    firebaseLeaderboard.forEach((entry, i) => {
      const text = `${i + 1}. ${entry.name} - ${entry.score}m`;
      ctx.fillText(text, canvas.width / 2, 180 + i * textSpacing);
    });
  }

  ctx.font = "bold 18px 'Sigmar One', cursive";
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "#ffb347";
  ctx.shadowBlur = 8;
  ctx.fillText("Press ESC to return", canvas.width / 2, canvas.height - 40);

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
}

function handleGameOver() {
  stats.totalGames += 1;
      stats.mostCoins = Math.max(stats.mostCoins, coinsCollected);
      stats.totalPowerups += powerUpsCollectedThisRun;
      localStorage.setItem("finfrenzy_stats", JSON.stringify(stats));
      localStorage.setItem("finfrenzy_xp", currentXP);
      localStorage.setItem("finfrenzy_level", currentLevel);

      if (score > highScore) {
        highScore = score;
        localStorage.setItem("boostdash_highscore", highScore);
      }
      if (score > bestDistance) {
        bestDistance = score;
        localStorage.setItem("boostdash_bestDistance", bestDistance);
      }

      totalCoins += coinsCollected;
      localStorage.setItem("boostdash_totalCoins", totalCoins);

      backgroundMusic.pause();

      // Save score to leaderboard
      const playerName = prompt("Enter your name to save your score:");
      saveLeaderboard(playerName, score);
      
      endSharkEvent();
      state = "gameover";
}


function saveLeaderboard(name, score) {
  const entry = {
    name: name || "Player",
    score: score,
    timestamp: Date.now()
  };

  // 🔹 Save locally
  let localBoard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  localBoard.push(entry);
  localBoard.sort((a, b) => b.score - a.score);
  localBoard = localBoard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(localBoard));

  // 🔹 Save globally
  firebase.database().ref("leaderboard").push(entry);
}


// Start or restart the game
function startGame() {
    currentXP = parseFloat(localStorage.getItem("finfrenzy_xp") || "0");
    currentLevel = parseInt(localStorage.getItem("finfrenzy_level") || "1");
    if (backgroundMusic.paused) {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(e => {
          console.warn("Autoplay blocked, will retry on next input.", e);
        });
      }
    endSharkEvent();  // ✅ make sure shark event is reset when starting new game
    player = {
        x: 100,
        y: 200,
        width: 60,   // sprite draw width
        height: 60,  // sprite draw height
        dy: 0
      }; 
    lastLevelScore = 0;
    lastPowerUpsCollected = 0;      
    frameCount = 0;
    globalSpeedMultiplier = 1;
    coinsCollected = 0;
    powerUpsCollectedThisRun = 0; // reset each run
    obstacles = [];
    obstacleSpawnTimer = 0;
    score = 0;
    health = maxHealth;
    edgeTimer = 0;
    damageCooldown = 0;
    state = "playing";
    edgeDamageCooldown = 0;
    damageFlashTimer = 0;
    coins = [];
    coinSpawnTimer = 0;
    coinsCollected = 0;
    poisonTimer = 0;
    powerUps = [];
    powerUpSpawnTimer = 0;
    activePowerUps = {
    shield: false,
    slowMo: false,
    doubleScore: false,
    magnet: false,
    chomp: false
    };
    powerUpTimers = {
    slowMo: 0,
    doubleScore: 0,
    magnet: 0,
    chomp: 0
    };

  }
  
  function unlockSkin(skinId) {
    if (!unlocked.includes(skinId)) {
      unlocked.push(skinId);
      localStorage.setItem("finfrenzy_unlockedSkins", JSON.stringify(unlocked));
    }
  }  
function selectSkin(skinId) {
    if (unlockedSkins.includes(skinId)) {
      selectedSkin = skinId;
      localStorage.setItem("finfrenzy_selectedSkin", skinId);
      heroImg.src = `assets/hero-fish${skinId === "default" ? "" : "-" + skinId}.png`;
    }
  }

function updateHeroSprite() {
    const skinId = selectedSkin;
    switch (skinId) {
      case "default":
        heroImg.src = "assets/hero-fish.png";
        break;
      case "redfin":
        heroImg.src = "assets/hero-fish-red.png";
        break;
      case "stealth":
        heroImg.src = "assets/hero-fish-stealth.png";
        break;
      case "army":
        heroImg.src = "assets/hero-fish-army.png";
        break;
      case "navy":
        heroImg.src = "assets/hero-fish-navy.png";
        break;
      case "airforce":
        heroImg.src = "assets/hero-fish-airforce.png";
        break;
      case "marine":
        heroImg.src = "assets/hero-fish-marine.png";
        break;
      case "inferno":
        heroImg.src = "assets/hero-fish-inferno.png";
        break;
      case "frostbite":
        heroImg.src = "assets/hero-fish-frostbite.png";
        break;
        case "goat":
        heroImg.src = "assets/hero-fish-goat.png";
        break;
      case "cat":
        heroImg.src = "assets/hero-fish-cat.png";
        break;
      case "dog":
        heroImg.src = "assets/hero-fish-dog.png";
        break;
      case "fancy":
        heroImg.src = "assets/hero-fish-fancy.png";
        break; 
    }
  }
  
  

// Check collision between two rectangles
function checkCollision(a, b) {
  const ax = a.x + 10, ay = a.y + 10, aw = a.width - 20, ah = a.height - 20;
  const bx = b.x + 5,  by = b.y + 5,  bw = b.width - 10, bh = b.height - 10;

  return (
    ax < bx + bw &&
    ax + aw > bx &&
    ay < by + bh &&
    ay + ah > by
  );
}
function getAchievements() {
  const unlockedSkins = JSON.parse(localStorage.getItem("finfrenzy_unlockedSkins") || '["default"]');
  const skinsOwned = unlockedSkins.length;

  return [
    {
      icon: "🎮",
      label: "Fin-tastic Frequency",
      description: "Play lots of games to show your commitment to the frenzy.",
      value: stats.totalGames,
      levels: [
        { tier: "Bronze", goal: 10 },
        { tier: "Silver", goal: 25 },
        { tier: "Gold", goal: 50 },
        { tier: "Platinum", goal: 100 }
      ]
    },
    {
      icon: "💰",
      label: "Coin Catcher",
      description: "Snag as many coins as you can in a single run.",
      value: stats.mostCoins,
      levels: [
        { tier: "Bronze", goal: 25 },
        { tier: "Silver", goal: 50 },
        { tier: "Gold", goal: 100 },
        { tier: "Platinum", goal: 200 }
      ]
    },
    {
      icon: "⚡",
      label: "Power-Up Predator",
      description: "Collect power-ups throughout your fishy journey.",
      value: stats.totalPowerups,
      levels: [
        { tier: "Bronze", goal: 10 },
        { tier: "Silver", goal: 25 },
        { tier: "Gold", goal: 50 },
        { tier: "Platinum", goal: 100 }
      ]
    },
    {
      icon: "🐟",
      label: "Fin Collector",
      description: "Unlock more skins to customize your underwater style.",
      value: skinsOwned,
      levels: [
        { tier: "Bronze", goal: 3 },
        { tier: "Silver", goal: 5 },
        { tier: "Gold", goal: 8 },
        { tier: "Platinum", goal: 12 }
      ]
    }
  ];
}


function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
  function drawHealthBar(x, y, width, height, value, maxValue) {
    const percent = Math.max(0, Math.min(1, value / maxValue));
    const barRadius = 10;
  
    // Background panel
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    drawRoundedRect(x, y, width, height, barRadius);
    ctx.fill();
  
    // Bar fill with gradient
    const grad = ctx.createLinearGradient(x, y, x + width, y);
    grad.addColorStop(0, "#00ff66");
    grad.addColorStop(1, "#00ccff");
  
    ctx.fillStyle = grad;
    drawRoundedRect(x, y, width * percent, height, barRadius);
    ctx.fill();
  
    // Bar outline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    drawRoundedRect(x, y, width, height, barRadius);
    ctx.stroke();
  
    // Text label
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Health", x, y - 6);
  }
    
  function drawScoreboard() {
    const pad = 12;
    const panelHeight = 38;
    const corner = 12;
    const spacing = 10;
    const panelY = 20;
  
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
  
    // Enable shadow for better contrast
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  
    // Panel background and text
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    const distText = `🛣️ ${score}m`;
    const coinText = `💰 ${coinsCollected}`;
    const bestText = `⭐ ${highScore}m`;
  
    const distW = ctx.measureText(distText).width;
    const coinW = ctx.measureText(coinText).width;
    const bestW = ctx.measureText(bestText).width;
  
    const panelWidth = distW + coinW + bestW + spacing * 4;
  
    const panelX = 20; // ✅ Aligned to the left edge now
  
    // Rounded panel background
    drawRoundedRect(panelX, panelY, panelWidth, panelHeight, corner);
    ctx.fill();
  
    // Draw the texts
    let x = panelX + spacing;
  
    ctx.fillStyle = "#ffffff";
    ctx.fillText(distText, x, panelY + panelHeight / 2);
    x += distW + spacing;
  
    ctx.fillText(coinText, x, panelY + panelHeight / 2);
    x += coinW + spacing;
  
    ctx.fillText(bestText, x, panelY + panelHeight / 2);
  
    // Disable shadow after draw
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
  
  
  
function getTiltAngle(dy) {
    // dy < 0  → boosting upward  (tilt nose up)
    // dy > 0  → falling downward (tilt nose down)
    const maxDeg = 20;                    // maximum tilt
    const clamped = Math.max(-8, Math.min(8, dy)); // limit effect
    const angleDeg = -(clamped / 8) * maxDeg;      // invert so up‑boost tilts up
    return angleDeg * Math.PI / 180;     // radians
  }
  
// Main update function
function update() {
  if (state === "splash") {
    splashTimer--;
    if (splashTimer <= 0) state = "title";
    return;
  }

  if (state !== "playing") return;

  frameCount++; // Always increment to avoid freeze during edge damage
    // Smoothly update player facing direction
  if (isSharkEventActive()) {
    targetFacing = -1;  // face left (shark event)
  } else {
    targetFacing = 1;   // face right (normal)
  }
  const turnSpeed = 0.1;  // adjust to control smoothness (0.05–0.2 range)
  playerFacing += (targetFacing - playerFacing) * turnSpeed;

  coinSpawnTimer++;
  for (let key in powerUpTimers) {
    if (powerUpTimers[key] > 0) {
      powerUpTimers[key]--;
      if (powerUpTimers[key] === 0) {
        activePowerUps[key] = false;
      }
    }
  }
    // ** Slow Mo Power-up Effect: **
  if (activePowerUps.slowMo) {
    globalSpeedMultiplier = 0.5; // Slow down the game speed by 50% while Slow Mo is active
  } else {
    globalSpeedMultiplier = 1;  // Default speed when slow mo is not active
  }

  // Reset slowMo after its timer expires
  if (activePowerUps.slowMo && powerUpTimers.slowMo <= 0) {
    activePowerUps.slowMo = false;
    globalSpeedMultiplier = 1; // Reset to normal speed
  }

  
  if (poisonTimer > 0) {
    poisonTimer--;
    if (frameCount % 60 === 0) { // 1 damage/sec
      health -= 10;
      damageFlashTimer = 6;
      if (health <= 0) {
        handleGameOver();
      }
    }
  }

  if (coinSpawnTimer >= 70) { // ~every 1–1.5 seconds
    let y = Math.random() * (canvas.height - 20);
    coins.push({
      x: canvas.width,
      y: y,
      width: 30,
      height: 30
    });
    coinSpawnTimer = 0;
  }
  
  powerUpSpawnTimer++;
  if (powerUpSpawnTimer >= 180) { // ~every 3 seconds
    const types = [
      "shield", "shield", "slowMo", "slowMo",
      "doubleScore", "doubleScore", "magnet",
      "shield", "slowMo", "doubleScore", "magnet",
      "shield", "magnet", "slowMo", "doubleScore",
      // only 1 out of 16 options is chomp
      "chomp"
    ];
    const type = types[Math.floor(Math.random() * types.length)];

    let y = Math.random() * (canvas.height - 20);
    const size = type === "chomp" ? 60 : 30; // double size if chomp
    powerUps.push({
      x: canvas.width,
      y: y,
      width: size,
      height: size,
      type: type
    });

    powerUpSpawnTimer = 0;
  }

  currentSpawnTimer++;
  if (!activeCurrent && currentSpawnTimer > 100) { // every 10s or so
    const direction = "up";
    const height = 100;
    const y = Math.random() * (canvas.height - height);
    activeCurrent = {
      x: canvas.width,
      y,
      width: 100,
      height,
      direction,
      duration: 300  // lasts for 5 seconds
    };
    currentSpawnTimer = 0;
  }

  if (activeCurrent) {
    activeCurrent.x -= getCurrentSpeed();

    // Apply push if player is inside current zone
    if (
      player.x + player.width > activeCurrent.x &&
      player.x < activeCurrent.x + activeCurrent.width &&
      player.y + player.height > activeCurrent.y &&
      player.y < activeCurrent.y + activeCurrent.height
    ) {
      player.dy += activeCurrent.direction === "up" ? -0.5 : 0.5;
    }

    // Decrease duration or remove
    activeCurrent.duration--;
    if (activeCurrent.duration <= 0 || activeCurrent.x + activeCurrent.width < 0) {
      activeCurrent = null;
    }
  }

  if (state !== "playing") return;

  // Handle damage cooldown
  if (damageCooldown > 0) damageCooldown--;

  const boostHeld = activeTouch || keys["Space"];  // works on desktop + mobile
  // Boost logic with sound
  if (boostHeld && !boostPressedLastFrame) {
    player.dy = boostPower;
    boostSound.currentTime = 0;
    boostSound.play();
  }
  boostPressedLastFrame = boostHeld;

  const dropPressed = keys["ArrowDown"];             // keep fast‑fall key
  
  if (boostHeld) player.dy = boostPower;
  if (dropPressed) player.dy += gravity * 1.5;

  // Gravity
  player.dy += gravity;
  player.y += player.dy;
  if (isSharkEventActive()) {
    player.x -= 4;  // adjust this speed to match visual feel
    if (player.x < 50) player.x = 50;  // prevent going offscreen left
  }

  // Floor and ceiling limits
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
  }
  if (player.y < 0) {
    player.y = 0;
    player.dy = 0;
  }

  if (edgeDamageCooldown > 0) edgeDamageCooldown--;
  if (damageFlashTimer > 0) damageFlashTimer--;

  // Edge timer + damage
  if (player.y <= 5 || player.y + player.height >= canvas.height - 5) {
    if (health <= 0) {
      handleGameOver();
    }
    if (score > bestDistance) {
      bestDistance = score;
      localStorage.setItem("boostdash_bestDistance", bestDistance);
    }
  }

  // Spawn obstacles
  obstacleSpawnTimer++;
  if (obstacleSpawnTimer >= nextObstacleIn) {
    const height = 60;
    const movementTypes = ["bounce", "float", "fall", "zigzag"];
    const type = movementTypes[Math.floor(Math.random() * movementTypes.length)];

    let y;
    const roll = Math.random();
    if (roll < 0.3) {
      // 20% chance → ceiling
      y = 0;
    } else if (roll < 0.6) {
      // next 20% → floor
      y = canvas.height - height;
    } else {
      // remaining 60% → anywhere in between
      y = Math.random() * (canvas.height - height);
    }

    obstacles.push({
      x: canvas.width,
      y: y,
      width: 60,
      height: height,
      vy: 0.5 + Math.random(),
      dir: Math.random() < 0.5 ? 1 : -1,
      type: type,
      frame: 0,
      isEnemy: Math.random() < 0.1
    });

    obstacleSpawnTimer = 0;
    const speed = getCurrentSpeed();
    const minDelay = Math.max(20, 100 - speed * 8);
    const maxDelay = Math.max(40, 140 - speed * 10);

    nextObstacleIn = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  }

  // Move obstacles and check for collisions
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    if (obs.isEnemy) {
      const dy = player.y - obs.y;
      obs.y += dy * 0.025; // Smooth following
    }
    obs.dy = obs.y - obs.prevY;
    obs.prevY = obs.y;
    obs.x -= getCurrentSpeed();
    obs.frame++;

    switch (obs.type) {
      case "bounce":
        obs.y += obs.vy * obs.dir;
        if (obs.y <= 0) {
          obs.y = 0;
          obs.dir *= -1;
        }
        if (obs.y + obs.height >= canvas.height) {
          obs.y = canvas.height - obs.height;
          obs.dir *= -1;
        }
        break;
      case "float":
        obs.y += Math.sin(obs.frame / 20) * obs.vy;
        break;
      case "fall":
        obs.y += obs.vy;
        if (obs.y + obs.height > canvas.height) obs.y = 0;
        break;
      case "zigzag":
        obs.y += (Math.sin(obs.frame / 10) > 0 ? 1 : -1) * obs.vy * 2;
        if (obs.y <= 0 || obs.y + obs.height >= canvas.height) obs.dir *= -1;
        break;
    }

    if (checkCollision(player, obs) && damageCooldown === 0) {
      crashSound.play();

      if (activePowerUps.chomp) {
        if (obs.type === "fall") {
          poisonTimer = 300; // lasts 5 seconds
        } else {
          coinsCollected += 5;
          totalCoins += 5;
          localStorage.setItem("boostdash_totalCoins", totalCoins);
        }
        obstacles.splice(i, 1);
        i--;
        continue;
      }

      if (activePowerUps.shield) {
        activePowerUps.shield = false;
      } else {
        health -= 50;
        damageFlashTimer = 10;
        if (health <= 0) {
          handleGameOver();
        }
      }

      damageCooldown = 30;
    }

    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < coins.length; i++) {
    let coin = coins[i];
    coin.x -= getCurrentSpeed();

    if (checkCollision(player, coin)) {
      collectSound.play();
      coinsCollected++;
      coins.splice(i, 1);
      i--;
      continue;
    }

    if (coin.x + coin.width < 0) {
      coins.splice(i, 1);
      i--;
    }

    if (activePowerUps.magnet) {
      let dx = player.x - coin.x;
      let dy = player.y - coin.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 250) {
        let pullStrength = Math.max(0.08, (250 - dist) / 250 * 0.2);
        coin.x += dx * pullStrength;
        coin.y += dy * pullStrength;
      }
    }
  }
  updateSharkEvent();
  for (let i = 0; i < powerUps.length; i++) {
    let p = powerUps[i];
    p.x -= getCurrentSpeed();

    if (checkCollision(player, p)) {
      collectSound.play();
      powerUpsCollectedThisRun++;
      switch (p.type) {
        case "shield":
          activePowerUps.shield = true;
          break;
        case "slowMo":
          activePowerUps.slowMo = true;
          powerUpTimers.slowMo = 300; // 5 seconds
          break;
        case "doubleScore":
          activePowerUps.doubleScore = true;
          powerUpTimers.doubleScore = 300;
          break;
        case "magnet":
          activePowerUps.magnet = true;
          powerUpTimers.magnet = 300;
          break;
        case "chomp":
          activePowerUps.chomp = true;
          powerUpTimers.chomp = 900;
          chompSound.currentTime = 0;
          chompSound.play();
          break;
      }

      powerUps.splice(i, 1);
      i--;
      continue;
    }

    if (p.x + p.width < 0) {
      powerUps.splice(i, 1);
      i--;
    }
  }

  // Score increase
  if (frameCount % 6 === 0) {
    if ((score === 1500 || score === 3000 || score === 4500 || score === 6000) && !isSharkEventActive()) {
      startSharkEvent();
      sharkEventCompleted = true;
  }  
    score += activePowerUps.doubleScore ? 2 : 1;

    const newCoins = coinsCollected - lastLevelScore;
    const newPowerUps = powerUpsCollectedThisRun - (lastPowerUpsCollected || 0);

    const gainedXP =
      newCoins * 4.0 +
      newPowerUps * 6.0;

    lastLevelScore = coinsCollected;
    lastPowerUpsCollected = powerUpsCollectedThisRun;

    currentXP += gainedXP;
    lastLevelScore = coinsCollected;

    // Level up if reached XP threshold
    while (currentXP >= getXPThreshold(currentLevel)) {
      currentXP -= getXPThreshold(currentLevel);
      currentLevel++;
      const reward = currentLevel * 25; // reward scales with level
      totalCoins += reward;
      localStorage.setItem("boostdash_totalCoins", totalCoins);
      levelUpMessages.push({ level: currentLevel, coins: reward });
      levelUpsThisRun.push({ level: currentLevel, coins: reward });
    }

    localStorage.setItem("finfrenzy_level", currentLevel);
    localStorage.setItem("finfrenzy_xp", currentXP);
  }
}
  

function drawProfileCard(x, y, width, height) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
  
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    drawRoundedRect(x, y, width, height, 16);
    ctx.fill();
  
    ctx.shadowColor = "transparent";
  }
  
// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const iconSize = 36;
    const iconMargin = 12;
    const hudX = canvas.width - iconSize - 20;
    let hudY = 100;

    // Splash screen
    if (state === "splash") {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        const fade = Math.min(1, splashTimer / 60); // fade effect
        ctx.globalAlpha = fade;
    
        if (tinyFinLogo.complete && tinyFinLogo.naturalWidth > 0) {
        const logoScale = 0.4; // 40% of canvas width
        const logoWidth = canvas.width * logoScale;
        const logoHeight = logoWidth; // square logo            
        ctx.drawImage(
          tinyFinLogo,
          canvas.width / 2 - logoWidth / 2,
          canvas.height / 2 - logoHeight / 2,
          logoWidth,
          logoHeight
        );        
        
        } else {
        // fallback text if logo hasn't loaded yet
        ctx.fillStyle = "#fff";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("TinyFin Studios", canvas.width / 2, canvas.height / 2);
        }
    
        ctx.globalAlpha = 1;
        return; // ⛔ stop drawing anything else
    }
    
    // Only draw the background if it's fully loaded
    if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
      ctx.drawImage(backgroundImage, bgX, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, bgX + canvas.width, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, bgX - canvas.width, 0, canvas.width, canvas.height);
    }
    drawSharkEvent(ctx);
  
      // Draw player sprite with tilt
    if (state !== "title" && heroImg.complete && heroImg.naturalWidth > 0) {
        const cx = player.x + player.width / 2;
        const cy = player.y + player.height / 2;
        const angle = getTiltAngle(player.dy);
      
        ctx.save();
        ctx.translate(cx, cy);        // move to sprite center
        ctx.scale(playerFacing, 1);
        ctx.rotate(angle);            // apply tilt
        // --- Composite glow effect ---
        let glowColors = [];

        if (activePowerUps.chomp)       glowColors.push("lime");
        if (activePowerUps.shield)      glowColors.push("blue");
        if (activePowerUps.slowMo)      glowColors.push("purple");
        if (activePowerUps.doubleScore) glowColors.push("orange");
        if (activePowerUps.magnet)      glowColors.push("white");

        // Combine glows by stacking shadows
        if (glowColors.length > 0) {
          // Optional: stronger glow for multiple effects
          ctx.shadowBlur = 15 + 5 * (glowColors.length - 1);
          ctx.shadowColor = glowColors[0]; // pick first to apply
        }
        // Adjust horizontal offset if flipping
        const offsetX = playerFacing < 0 ? -player.width / 2 : -player.width / 2;
        ctx.drawImage(
            heroImg,
            offsetX,
            -player.height / 2,
            player.width,
            player.height
        );
        // Add secondary glows by overlaying transparent copies
        if (glowColors.length > 1) {
          for (let i = 1; i < glowColors.length; i++) {
            ctx.shadowColor = glowColors[i];
            ctx.drawImage(
              heroImg,
              -player.width / 2,
              -player.height / 2,
              player.width,
              player.height
            );
          }
        }

        ctx.restore();
        ctx.shadowColor = "transparent"; // clean reset
        ctx.shadowBlur = 0;
      }
  
  for (let coin of coins) {
    if (coinImg.complete && coinImg.naturalWidth > 0) {
      ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);
    } else {
      // fallback circle while the PNG loads
      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  

  // Draw obstacles
  ctx.fillStyle = "#ff4444";
  ctx.textAlign = "left";
  ctx.font = "12px Arial";
  
  for (let obs of obstacles) {
    const img = fishImages[obs.type];
    if (img.complete && img.naturalWidth > 0) {
    // ----- tilt based on vertical speed -----
    // Clamp dy so angle stays reasonable
    const clamped = Math.max(-6, Math.min(6, obs.dy));
    const angle = (-clamped / 6) * 25 * Math.PI / 180; // ±25°

    ctx.save();
    ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);
    ctx.rotate(angle);

    // Flip horizontally for fall & zigzag (optional)
    const flip = (obs.type === "fall" || obs.type === "zigzag") ? -1 : 1;
    ctx.scale(flip, 1);

    ctx.drawImage(
        img,
        -obs.width / 2,
        -obs.height / 2,
        obs.width,
        obs.height
    );
    ctx.restore();
    } else {
    // fallback rectangle
    ctx.fillStyle = obs.isEnemy ? "#ff0066" : "#ff4444";
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    if (activeCurrent && currentImg.complete && currentImg.naturalWidth > 0) {
      const { x, y, width, height } = activeCurrent;
      ctx.drawImage(currentImg, x, y, width, height);
    }   
    
    // Optional debug text
    ctx.fillStyle = "#ffffff";
    // ctx.fillText(obs.type, obs.x, obs.y - 5);
    
  }


  // Draw score
  if (state === "playing" || state === "gameover") {
    if (state === "playing") {
      if (isSharkEventActive()) {
        bgX += Math.abs(getCurrentSpeed()) * 0.25;
        if (bgX >= canvas.width) bgX -= canvas.width;  // keep within 0 to canvas.width
    } else {
        bgX -= getCurrentSpeed() * 0.25;
        if (bgX <= -canvas.width) bgX += canvas.width;  // keep within -canvas.width to 0
    }    
      }      
    if (bgX <= -canvas.width) bgX = 0;
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    const barWidth = 200;
    const barHeight = 20;
    const barX = canvas.width - barWidth - 40;
    const barY = 30;
    drawHealthBar(barX, barY, barWidth, barHeight, health, maxHealth);    
    drawScoreboard();

    // Draw XP Bar
    const xpBarX = 20;
    const xpBarY = 70;
    const xpBarW = 200;
    const xpBarH = 16;
    const xpPercent = currentXP / getXPThreshold(currentLevel);

    // Translucent background
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    drawRoundedRect(xpBarX, xpBarY, xpBarW, xpBarH, 10);
    ctx.fill();

    // Sleek gradient fill
    const xpGradient = ctx.createLinearGradient(xpBarX, xpBarY, xpBarX + xpBarW, xpBarY);
    xpGradient.addColorStop(0, "#ffb347"); // light orange
    xpGradient.addColorStop(1, "#ff7f00"); // deep orange

    ctx.fillStyle = xpGradient;
    drawRoundedRect(xpBarX, xpBarY, xpBarW * xpPercent, xpBarH, 10);
    ctx.fill();

    // Border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    drawRoundedRect(xpBarX, xpBarY, xpBarW, xpBarH, 10);
    ctx.stroke();

    // Label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.fillText(`Level ${currentLevel}`, xpBarX, xpBarY - 8);


    for (let p of powerUps) {
      const img = powerImages[p.type];
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, p.x, p.y, p.width, p.height);
      } else {
        // fallback circle while image loads
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(p.x + 10, p.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }

      
  }
  // --- Power-Up HUD ---
  for (let type in activePowerUps) {
    if (activePowerUps[type]) {
      const img = powerImages[type];
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, hudX, hudY, iconSize, iconSize);
      }
  
      if (type !== "shield") {
        const timeLeft = powerUpTimers[type];
        const maxDuration = (type === "chomp") ? 900 : 300;
        const percent = timeLeft / maxDuration;

  
        // Radial countdown overlay
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 4;
        ctx.arc(
          hudX + iconSize / 2,
          hudY + iconSize / 2,
          iconSize / 2 - 2,
          -Math.PI / 2,
          -Math.PI / 2 + 2 * Math.PI * percent
        );
        ctx.stroke();
      }
  
      hudY += iconSize + iconMargin;
    }
  }
  
    if (state === "profile") {
      if (profileBg.complete && profileBg.naturalWidth > 0) {
          ctx.drawImage(profileBg, 0, 0, canvas.width, canvas.height);
      } else {
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Glowing Header Background
      ctx.font = "bold 36px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.shadowColor = "#00ccff";
      ctx.shadowBlur = 12;

      ctx.fillStyle = "#ffffff";
      ctx.fillText("PLAYER PROFILE", canvas.width / 2, 60);

      // Reset shadow after drawing
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;


        // Tabs
        const tabLabels = ["STATS", "ACHIEVEMENTS", "SKINS"];
        const activeTab = currentProfileTab;
        const tabY = 100;
        const tabSpacing = 120; // smaller spacing
        const startX = canvas.width / 2 - tabSpacing;
        
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        
        for (let i = 0; i < tabLabels.length; i++) {
          const label = tabLabels[i];
          const tabKey = label.toLowerCase();
          const isActive = (activeTab === tabKey);
        
          ctx.fillStyle = isActive ? "#00ffff" : "#666";
          ctx.fillText(label, startX + i * tabSpacing, tabY);
        }
        
        
        ctx.textAlign = "left";
        ctx.font = "bold 18px Arial";
      
        if (currentProfileTab === "stats") {
          let totalCoins = parseInt(localStorage.getItem("boostdash_totalCoins") || "0");

          // Draw translucent rounded panel
          drawProfileCard(80, 160, canvas.width - 160, 190);

          // Stats content
          ctx.font = "bold 18px Arial";
          ctx.textAlign = "left";
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;


          // Gradient text fill
          const grad = ctx.createLinearGradient(0, 0, 0, 400);
          grad.addColorStop(0, "#00ffff");  // aqua top
          grad.addColorStop(1, "#ffffff");  // white bottom
          ctx.fillStyle = grad;

          // Draw each stat line
          ctx.fillText(`🏆 Level: ${currentLevel}`, 100, 180);
          // XP Bar next to Level
          const xpBarX = 240;
          const xpBarY = 170;
          const xpBarW = 200;
          const xpBarH = 10;
          const xpPercent = Math.min(1, currentXP / getXPThreshold(currentLevel));

          // Background
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
          drawRoundedRect(xpBarX, xpBarY, xpBarW, xpBarH, 8);
          ctx.fill();

          // Fill
          const xpFill = ctx.createLinearGradient(xpBarX, xpBarY, xpBarX + xpBarW, xpBarY);
          xpFill.addColorStop(0, "#ffb347");
          xpFill.addColorStop(1, "#ff7f00");
          ctx.fillStyle = xpFill;
          drawRoundedRect(xpBarX, xpBarY, xpBarW * xpPercent, xpBarH, 8);
          ctx.fill();

          // Border
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          drawRoundedRect(xpBarX, xpBarY, xpBarW, xpBarH, 8);
          ctx.stroke();

          // XP Text
          ctx.font = "12px Arial";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(`${Math.floor(currentXP)} / ${getXPThreshold(currentLevel)} XP`, xpBarX, xpBarY + xpBarH + 14);

          // Stats content
          ctx.font = "bold 18px Arial";
          ctx.textAlign = "left";
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          // Gradient text fill
          grad.addColorStop(0, "#00ffff");  // aqua top
          grad.addColorStop(1, "#ffffff");  // white bottom
          ctx.fillStyle = grad;
          ctx.fillText(`⭐ Best Distance: ${bestDistance}m`, 100, 210);
          ctx.fillText(`💰 Total Coins: ${totalCoins}`, 100, 240);
          ctx.fillText(`🎮 Total Games: ${stats.totalGames}`, 100, 270);
          ctx.fillText(`🏅 Most Coins in Run: ${stats.mostCoins}`, 100, 300);
          ctx.fillText(`⚡ Power-ups Collected: ${stats.totalPowerups}`, 100, 330);

          // Reset shadow
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

        }
        if (currentProfileTab === "skins") {
          const defaultPreview = new Image();
          defaultPreview.src = "assets/hero-fish.png";
          const redfinPreview = new Image();
          redfinPreview.src = "assets/hero-fish-red.png";
          const stealthPreview = new Image();
          stealthPreview.src = "assets/hero-fish-stealth.png";
          
          const allSkins = [
            { id: "default", name: "Classic Fin", img: defaultPreview },
            { id: "redfin", name: "Red Fin", img: redfinPreview },
            { id: "stealth", name: "Stealth Fish", img: stealthPreview },
            { id: "army", name: "Army Fin", img: armyfinPreview },
            { id: "navy", name: "Navy Fin", img: navyfinPreview },
            { id: "airforce", name: "Air Force Fin", img: airforcefinPreview },
            { id: "marine", name: "Marine Fin", img: marinefinPreview },
            { id: "goat", name: "Goat Fin", img: goatfinPreview },        
            { id: "cat", name: "Cat Fin", img: catfinPreview },            
            { id: "dog", name: "Dog Fin", img: dogfinPreview },
            { id: "fancy", name: "Fancy Fin", img: fancyfinPreview },
            { id: "inferno", name: "Inferno Fin", img: infernofinPreview },
            { id: "frostbite", name: "Frostbite Fin", img: frostbitefinPreview }
          ];          
          const equipped = localStorage.getItem("finfrenzy_equippedSkin") || "default";
          const unlocked = JSON.parse(localStorage.getItem("finfrenzy_unlockedSkins") || '["default"]');
        
          const ownedSkins = allSkins.filter(skin => unlocked.includes(skin.id));
          const totalPages = Math.ceil(ownedSkins.length / skinsPerPage);
          const startIdx = skinPage * skinsPerPage;
          const pagedSkins = ownedSkins.slice(startIdx, startIdx + skinsPerPage);

        
          ctx.font = "18px Arial";
          ctx.textAlign = "left";
        
          let y = 150;
          for (let i = 0; i < pagedSkins.length; i++) {
            const skin = pagedSkins[i];
          
            drawProfileCard(80, y - 20, canvas.width - 160, 70);
          
            ctx.fillStyle = (startIdx + i) === skinProfileSelection ? "#ffff00" : "#fff";
            ctx.fillText(skin.name, 100, y);
          
            ctx.fillStyle = skin.id === equipped ? "#00ff99" : "#00ffff";
            ctx.fillText(skin.id === equipped ? "Equipped" : "Press ENTER to Equip", 100, y + 30);
          
            ctx.drawImage(skin.img, canvas.width - 140, y - 10, 50, 50);
            y += 100;
          }
          
        
          if (ownedSkins.length === 0) {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#aaa";
            ctx.textAlign = "center";
            ctx.fillText("No skins unlocked yet!", canvas.width / 2, canvas.height / 2);
          }
          ctx.font = "14px Arial";
          ctx.fillStyle = "#aaa";
          ctx.textAlign = "center";
          ctx.fillText(`Page ${skinPage + 1} of ${totalPages}`, canvas.width / 2, canvas.height - 60);
          ctx.fillText("Press Q / E to change page", canvas.width / 2, canvas.height - 40);

        }
              
        if (currentProfileTab === "achievements") {
          const achievements = getAchievements();
          const totalPages = Math.ceil(achievements.length / achievementsPerPage);
          achievementPage = Math.max(0, Math.min(achievementPage, totalPages - 1));
          
          const startIdx = achievementPage * achievementsPerPage;
          const pageAchievements = achievements.slice(startIdx, startIdx + achievementsPerPage);
          
          let y = 160;
          const panelWidth = 480; // or adjust as needed
          const xOffset = (canvas.width - panelWidth) / 2;
          for (let a of pageAchievements) {          
            ctx.font = "bold 18px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.fillText(`${a.icon} ${a.label}`, 100, y);
            
            ctx.font = "bold 13px Arial";
            ctx.fillStyle = "#ccc";
            ctx.fillText(a.description, 340, y); // positioned right of label
            
            y += 30; // line break after label + description
            
          
            ctx.font = "14px Arial";
            for (let level of a.levels) {
              const achieved = a.value >= level.goal;
              const text = `${level.tier} — ${level.goal}`;

              // Determine tier color
              let tierColor;
              switch (level.tier) {
                case "Bronze":
                  tierColor = "#cd7f32";
                  break;
                case "Silver":
                  tierColor = "#c0c0c0";
                  break;
                case "Gold":
                  tierColor = "#ffd700";
                  break;
                case "Platinum":
                  tierColor = "#00ffcc"; // bright aqua-green
                  break;
                default:
                  tierColor = "#888";
              }

              // ✔️ Label and checkmark
              ctx.fillStyle = achieved ? tierColor : "#bbb";
              if (achieved) ctx.fillText("✔", xOffset + 100, y);
              ctx.fillText(text, xOffset + 120, y);

              // Progress bar (always shown)
              const barX = xOffset + 120;
              const barY = y + 8;
              const barW = 200;
              const barH = 10;
              const pct = Math.min(1, a.value / level.goal);

              // Background
              ctx.fillStyle = "#333";
              drawRoundedRect(barX, barY, barW, barH, 5);
              ctx.fill();

              // Fill color matches tier
              ctx.fillStyle = tierColor;
              drawRoundedRect(barX, barY, barW * pct, barH, 5);
              ctx.fill();

              // Border
              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 1;
              drawRoundedRect(barX, barY, barW, barH, 5);
              ctx.stroke();

              // Text to the right of the bar
              ctx.font = "12px Arial";
              ctx.fillStyle = "#ffffff";
              ctx.textAlign = "left";
              ctx.fillText(`${a.value} / ${level.goal}`, barX + barW + 10, barY + barH - 1);

              y += 28;
            }

                        
            y += 20;
          }          

          // Pagination UI
          ctx.textAlign = "right";
          ctx.fillStyle = "#aaa";
          ctx.font = "14px Arial";
          ctx.fillText(`Page ${achievementPage + 1} of ${totalPages}`, canvas.width - 40, canvas.height - 80);
          ctx.fillText("Press Q / E to change page", canvas.width - 40, canvas.height - 60);          
        }   

        
      
        ctx.textAlign = "left";
        ctx.fillStyle = "#aaa";
        ctx.font = "14px Arial";
        ctx.fillText("←/→ or A/D to switch tabs | ESC or B to return", 40, canvas.height - 20);        
      
        return; // ⛔ prevent game rendering
      }
      if (state === "leaderboard") {
        if (firebaseLeaderboard === null) {
          firebase.database().ref("leaderboard").once("value").then(snapshot => {
            let scores = [];
            snapshot.forEach(child => {
              scores.push(child.val());
            });
      
            scores.sort((a, b) => b.score - a.score);
            firebaseLeaderboard = scores.slice(0, 5);
          });
        }
      
        renderLeaderboardScreen(); // Always render (shows "Loading..." while waiting)
        return;
      }
      
      
  // Title screen
  if (state === "title") {
    // ✅ Draw scrolling background
    if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
      ctx.drawImage(backgroundImage, bgX, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, bgX + canvas.width, 0, canvas.width, canvas.height);
      bgX -= getCurrentSpeed() * 0.25;
      if (bgX <= -canvas.width) bgX = 0;
    }
  
    // Title text (with shadow effect)
    ctx.fillStyle = "#ffffff";
    ctx.font = "64px 'Sigmar One', cursive";
    ctx.textAlign = "center";
    ctx.shadowColor = "#00ccff"; // Blue shadow
    ctx.shadowBlur = 12;
    ctx.fillText("FIN FRENZY", canvas.width / 2, canvas.height / 2 - 100);
    ctx.shadowColor = "transparent"; // Remove shadow after title

    // Control directions text (beneath the title)
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Sigmar One";
    ctx.textAlign = "center";
    ctx.fillText("HOLD = Boost | TAP = Mini Boost | DOWN = Drop", canvas.width / 2, canvas.height / 2);

    // Button styles
    const btnWidth = 180;
    const btnHeight = 50;
    const btnMargin = 20;
    const startY = canvas.height / 2 + 40; // Slightly lower to account for the directions text

    // Button positions for 2x2 grid
    const startX = (canvas.width - 2 * btnWidth - btnMargin) / 2; // Center the buttons
    const buttonPositions = [
        { x: startX, y: startY },                      // First button
        { x: startX + btnWidth + btnMargin, y: startY }, // Second button
        { x: startX, y: startY + btnHeight + btnMargin }, // Third button
        { x: startX + btnWidth + btnMargin, y: startY + btnHeight + btnMargin } // Fourth button
    ];

    const labels = [
        { text: "Start Game",    action: () => startGame() },
        { text: "Player Profile", action: () => { state = "profile"; } },
        { text: "Shop",          action: () => { state = "shop"; } },
        { text: "Leaderboard",    action: () => { state = "leaderboard"; } }
    ];

    // Draw buttons in a 2x2 grid layout
    for (let i = 0; i < labels.length; i++) {
        const button = buttonPositions[i];
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        drawRoundedRect(button.x, button.y, btnWidth, btnHeight, 12);
        ctx.fill();

        ctx.strokeStyle = "#00ccff"; // Blue outline
        ctx.lineWidth = 2;
        drawRoundedRect(button.x, button.y, btnWidth, btnHeight, 12);
        ctx.stroke();

        // Button text (original font style)
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px Arial"; // Keeping original font
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(labels[i].text, button.x + btnWidth / 2, button.y + btnHeight / 2);

        // Add to buttons list for click detection
        buttons.push({
            x: button.x,
            y: button.y,
            width: btnWidth,
            height: btnHeight,
            onClick: labels[i].action
        });
    }
}

  
  
  if (state === "paused") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width / 2, 100);
  
    // Mid-Run Stats Panel
    drawProfileCard(canvas.width / 2 - 180, 140, 360, 220);
  
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
  
    let x = canvas.width / 2 - 150;
    let y = 170;
    const lineHeight = 36;
  
    ctx.fillText(`🛣️ Distance: ${score}m`, x, y);           y += lineHeight;
    ctx.fillText(`💰 Coins: ${coinsCollected}`, x, y);       y += lineHeight;
    ctx.fillText(`⚡ Power-Ups: ${powerUpsCollectedThisRun}`, x, y); y += lineHeight;
    ctx.fillText(`🏆 Level: ${currentLevel}`, x, y);          y += lineHeight;
  
    // XP Progress Bar
    const xpW = 260, xpH = 14;
    const xpX = canvas.width / 2 - xpW / 2;
    const xpY = y + 12;
    const xpPercent = Math.min(1, currentXP / getXPThreshold(currentLevel));
  
    // Background
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    drawRoundedRect(xpX, xpY, xpW, xpH, 8);
    ctx.fill();
  
    // Fill
    const grad = ctx.createLinearGradient(xpX, xpY, xpX + xpW, xpY);
    grad.addColorStop(0, "#ffb347");
    grad.addColorStop(1, "#ff7f00");
    ctx.fillStyle = grad;
    drawRoundedRect(xpX, xpY, xpW * xpPercent, xpH, 8);
    ctx.fill();
  
    // Border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    drawRoundedRect(xpX, xpY, xpW, xpH, 8);
    ctx.stroke();
  
    // XP text
    ctx.font = "12px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.floor(currentXP)} / ${getXPThreshold(currentLevel)} XP`, canvas.width / 2, xpY + xpH + 14);
  
    // Hint
    ctx.font = "16px Arial";
    ctx.fillStyle = "#aaa";
    ctx.fillText("Press P to Resume or R to Restart", canvas.width / 2, canvas.height - 40);
  }
  
  if (state === "shop") {
    if (shopBg.complete && shopBg.naturalWidth > 0) {
      ctx.drawImage(shopBg, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // 🪙 Coin display in top-right
    const coinDisplay = `💰 ${totalCoins}`;
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "right";
    ctx.fillText(coinDisplay, canvas.width - 30, 40);

    // Dimmed background panel behind items
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    drawRoundedRect(60, 100, canvas.width - 120, canvas.height - 140, 16);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // ✅ 1. FILTER the skins based on current tab
    let allTabSkins = skins.filter(s => s.tab === currentShopTab);
    const totalPages = Math.ceil(allTabSkins.length / shopSkinsPerPage);
    shopPage = Math.max(0, Math.min(shopPage, totalPages - 1)); // Clamp
    
    const startIdx = shopPage * shopSkinsPerPage;
    const displayedSkins = allTabSkins.slice(startIdx, startIdx + shopSkinsPerPage);
    

    // ✅ 2. Draw the shop tabs
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = currentShopTab === "traditional" ? "#00ffff" : "#666";
    ctx.fillText("Traditional", canvas.width / 2 - 150, 80);

    ctx.fillStyle = currentShopTab === "themed" ? "#00ffff" : "#666";
    ctx.fillText("Themed", canvas.width / 2, 80);

    ctx.fillStyle = currentShopTab === "highlevel" ? "#00ffff" : "#666";
    ctx.fillText("High Level", canvas.width / 2 + 150, 80);

    ctx.textAlign = "left";

    // ✅ 3. Draw the skins (if any)
    let y = 130;
    for (let i = 0; i < displayedSkins.length; i++) {
      const skin = displayedSkins[i];
      const isUnlocked = unlocked.includes(skin.id);
      const isSelected = i === currentShopSelection;

      drawProfileCard(80, y - 20, canvas.width - 160, 70);

      ctx.font = "bold 18px Arial";
      ctx.fillStyle = isSelected ? "#ffff00" : (isUnlocked ? "#00ff99" : "#ffffff");
      ctx.fillText(skin.name, 100, y);

      ctx.font = "bold 16px Arial";
      ctx.fillStyle = isUnlocked ? "#00ccff" : "#ffffff";
      ctx.fillText(isUnlocked ? "Unlocked" : `${skin.price} 💰`, 100, y + 24);

      // 🆕 Add this for the description in the center of the card
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "#ccc";
      ctx.textAlign = "center";
      ctx.fillText(skin.description || "", canvas.width / 2, y + 24);

      // Restore left align before next items
      ctx.textAlign = "left";

      // Add level requirement *between* price and preview
      if (!isUnlocked && skin.requiredLevel) {
        const meetsLevel = currentLevel >= skin.requiredLevel;
        ctx.fillStyle = meetsLevel ? "#00ff99" : "#ff4444";
        ctx.fillText(`Requires Lv ${skin.requiredLevel}`, 100, y + 42);
      }
      
      let previewImg;
      if (skin.id === "default") previewImg = defaultPreview;
      else if (skin.id === "redfin") previewImg = redfinPreview;
      else if (skin.id === "stealth") previewImg = stealthPreview;
      else if (skin.id === "army") previewImg = armyfinPreview;
      else if (skin.id === "navy") previewImg = navyfinPreview;
      else if (skin.id === "airforce") previewImg = airforcefinPreview;
      else if (skin.id === "marine") previewImg = marinefinPreview;
      else if (skin.id === "inferno") previewImg = infernofinPreview;
      else if (skin.id === "frostbite") previewImg = frostbitefinPreview;
      else if (skin.id === "goat") previewImg = goatfinPreview;      // ✅ add this
      else if (skin.id === "cat") previewImg = catfinPreview;        // ✅ add this
      else if (skin.id === "dog") previewImg = dogfinPreview;        // ✅ add this
      else if (skin.id === "fancy") previewImg = fancyfinPreview;

      if (previewImg?.complete && previewImg.naturalWidth > 0) {
        ctx.drawImage(previewImg, canvas.width - 140, y - 10, 50, 50);
      }

      y += 90;
    }

    // ✅ 4. If no skins in this tab, show message
    if (displayedSkins.length === 0) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#aaa";
      ctx.textAlign = "center";
      ctx.fillText("No skins available in this category!", canvas.width / 2, canvas.height / 2);
    }

    
    ctx.font = "16px Arial";
    ctx.fillStyle = "#aaa";
    ctx.fillText("Press ESC to return", canvas.width / 2, canvas.height - 30);

    ctx.font = "14px Arial";
    ctx.fillStyle = "#aaa";
    ctx.textAlign = "center";
    ctx.fillText(`Page ${shopPage + 1} of ${totalPages}`, canvas.width / 2, canvas.height - 60);
    ctx.fillText("Press Q / E to change tab | A / D to scroll page", canvas.width / 2, canvas.height - 40);
  
    return;    
  }
  
  // Game over screen
  if (state === "gameover") {
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 20);
  }
  // Flash screen red when damaged
  if (damageFlashTimer > 0) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (poisonTimer > 0) {
    ctx.fillStyle = "rgba(0, 255, 0, 0.15)"; // green transparent overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
