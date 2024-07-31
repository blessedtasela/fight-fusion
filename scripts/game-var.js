const $main = $('#main')
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
const $player01 = $('#player01');
const $player01Hit = $('#player01Hit');
const $player01Img = $player01.find('img');
const $player02 = $('#player02');
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
const $endGameImage = $('#end-game-image');
const $endGameDetails = $('#end-game-details');
const $endGameAudio = $('#end-game-audio');
const $roundResult = $('#round-result');
const $closeRoundResult = $('#close-round-result');
const $nextRound = $('#next-round');
const $roundResultDetails = $('#round-result-details');
const $roundEndGame = $('#round-end-game');
const $roundCountDown = $('#round-count-down');
const $countDown = $('#count-down');
const $currentRound = $('#current-round');
const $currentRoundData = $('#current-round-data');
const $preRound = $('#pre-round');
const $preRoundData = $('#pre-round-data');
const $controls = $('.direction-btn, .move-btn');

let player02IntervalId;
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

const initCombo = 0;
const initRoundWon = 0;
const initAttackValue = 0;
const countdownEnd = 0;
const preRoundCountEnd = 0;
const currentRoundTimeout = 2000;
const preRoundInterval = 1000;
const roundInterval = 1000;
const preRoundTimeout = 3000;
const initMaxRound = 3;
const maxCombo = 3;
const maxLife = 15;
const minCombo = 0;
const minLife = 0;
const duration = 500;
const playerWidthOffset = 50;
const playerHeightOffset = 100;
const player02Interval = 2000;
const openStartGameTimeout = 3000;
const fadeOutInterval = 2000;
const roundDuration = 60;
const resetGameInterval = 2000;
const roundResultInterval = 1000;
const singleHit = 1;
const comboHit = 3;
const blockHit = 0;
const parentWidth = $playerArea.width();
const parentHeight = $playerArea.height();
const gameInProgress = 'in-progress';
const gameFinished = 'finished';

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
const player01 = new Player($player01, playerPosition, {}, 'Samson');
const player02 = new Player($player02, computerPosition, {}, 'Computer');