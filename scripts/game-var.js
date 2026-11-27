const $main = $('#main');
const $gameAudio = $('#game-audio');
const $btnUp = $('#btn-up');
const $btnDown = $('#btn-down');
const $btnLeft = $('#btn-left');
const $btnRight = $('#btn-right');
const $btnPunch = $('#btn-punch');
const $btnKick = $('#btn-kick');
const $btnBlock = $('#btn-block');
const $btnCombo = $('#btn-combo');
const $gameData = $('.game-data');
const $players = $('#players');
const $player01Life = $('#player01-life');
const $player01 = $('#player01');
const $player01Audio = $('#player01-audio');
const $player01Hit = $('#player01Hit');
const $player01Img = $player01.find('img');
const $player02Life = $('#player02-life');
const $player02 = $('#player02');
const $player02Audio = $('#player02-audio');
const $player02Hit = $('#player02Hit');
const $player02Img = $player02.find('img');
const $gameHistory = $('#game-history');
const $gameHistoryList = $('#game-history-list');
const $showGameHistory = $('#show-game-history');
const $hideGameHistory = $('#hide-game-history');
const $deleteGame = $('#delete-game');
const $closeDeleteGame = $('#close-delete-game');
const $deleteAllGames = $('#delete-all-games');
const $deleteDeleteAllGames = $('#delete-delete-all-games');
const $cancelDeleteAllGames = $('#cancel-delete-all-games');
const $startGame = $('#start-game');
const $closeStartGame = $('#close-start-game');
const $startNewGame = $('#start-new-game');
const $cancelStartGame = $('#cancel-start-game');
const $resumeGame = $('#resume-game');
const $closeResumeGame = $('#close-resume-game');
const $continueResumeGame = $('#continue-resume-game');
const $startResumeNewGame = $('#start-resume-new-game');
const $endGame = $('#end-game');
const $closeEndGame = $('#close-end-game');
const $endGameNewGame = $('#end-game-new-game');
const $cancelEndGame = $('#cancel-end-game');
const $playerArea = $('.player-area');
const $gameWin = $('#win');
const $gameLose = $('#lose');
const $play = $('#play');
const $exit = $('#exit');
const $exitGame = $('#exit-game');
const $closeExitGame = $('#close-exit-game');
const $finishExitGame = $('#finish-exit-game');
const $cancelExitGame = $('#cancel-exit-game');
const $endGameHeader = $('#end-game-header');
const $roundResultHeader = $('#round-result-header');
const $endGameImage = $('#end-game-image');
const $endGameDetails = $('#end-game-details');
const $endGameAudio = $('#end-game-audio');
const $roundResult = $('#round-result');
const $roundResultImage = $('#round-result-image');
const $roundResultAudio = $('#round-result-audio');
const $closeRoundResult = $('#close-round-result');
const $nextRound = $('#next-round');
const $roundResultDetails = $('#round-result-details');
const $roundEndGame = $('#round-end-game');
const $roundCountDown = $('#round-count-down');
const $roundStartAudio = $('#round-start-audio');
const $countDown = $('#count-down');
const $currentRound = $('#current-round');
const $currentRoundData = $('#current-round-data');
const $preRound = $('#pre-round');
const $preRoundData = $('#pre-round-data');
const $controls = $('.direction-btn, .move-btn');
const $gameInstructions = $('#game-instructions');
const $updatePlayerName = $('#update-player-name');
const $player01Name = $('#player01-name');
const $player02Name = $('#player02-name');
const $pauseBtn = $('#pause-btn');
const $soundBtn = $('#sound-btn');

let player02IntervalId;
let roundIntervalId;
let isMaxWidth = false;
let isCollision = false;
let gameStarted = false;
let isColision = false;
let isStartGameClicked = false;
let attackValue = 0;
let maxRounds = 3;
let currentRound = 0;
let player01Wins = 0;
let player02Wins = 0;
let endingValue = 0;
let preRoundCount = 3;
let isGameEnded = false;
let isRoundEnded = false;
let isWinner;
let roundActive = false;      // true only while a round's clock is running
let roundPaused = false;      // true while the Exit confirmation is open mid-round
let roundRemaining = 0;       // seconds left in the current round
let pendingTimers = [];       // countdown timers, cleared when a game ends
let playerName = 'Player';
let computerName = 'Computer';

const initCombo = 0;
const initRoundWon = 0;
const initAttackValue = 0;
const countdownEnd = 0;
const preRoundCountEnd = 0;
const currentRoundTimeout = 1200; // 'Round N' banner
const preRoundInterval = 700;     // 3-2-1 ticks
const roundInterval = 1000;
const preRoundTimeout = 3000;
const initMaxRound = 3;
const maxCombo = 15;
const maxLife = 100;
const warningLife = 40;
const dangerLife = 20;
const minCombo = 0;
const minLife = 0;
const singleHit = 1;
const comboHit = 3;
const blockHit = 0;
const minRoundsToWIn = 2;
const maxRoundsCap = 5;        // tied after 3 rounds: extra rounds up to this many, then a draw
const blockWindow = 700;      // ms a block protects against the next hit
const attackRange = 30;       // px of reach: fighters this close can hit each other
const duration = 500;
const playerWidthOffset = 50;
const playerHeightOffset = 100;
// Computer opponent: how often it acts, and how often it blocks when in range.
const difficulties = {
    easy: { interval: 900, blockChance: 0.12 },
    normal: { interval: 550, blockChance: 0.25 },
    hard: { interval: 350, blockChance: 0.35 },
};
let difficulty = difficulties[localStorage.getItem('ff-difficulty')] ? localStorage.getItem('ff-difficulty') : 'normal';
let soundOn = localStorage.getItem('ff-sound') !== 'off';
const moveStep = 0.03;        // fraction of the arena width per step
const moveThrottle = 70;      // ms between steps when a key or button is held
const evadeDuration = 450;    // ms a jump or crouch lasts
const openStartGameTimeout = 3000;
const fadeOutInterval = 2000;
const roundDuration = 60;
const resetGameInterval = 2000;
const roundResultInterval = 1000;
const parentWidth = $playerArea.width();
const parentHeight = $playerArea.height();
const gameInProgress = 'in-progress';
const gameFinished = 'finished';
const gameDrawn = 'draw';
const defaultAttack = 'still';
const roundWin = 'wins this round!';
const roundLose = 'lose this round!';
const roundDraw = 'Round is a draw!';
const artPath = `./resources/art/`;
const audioPath = `./resources/audios/`;
const nil = 'NIL';

const playerPosition = {
    top: 0,
    left: 0
};

const computerPosition = {
    top: 0,
    right: 0,
    left: $playerArea.width() - $player02.outerWidth()
};



// Create Player and Computer instances
let player01 = new Player($player01, playerPosition, {}, playerName);
let player02 = new Player($player02, computerPosition, {}, computerName);