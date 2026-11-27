/*
   Popups, round flow, combat, audio, save/resume and game history for Fight Fusion.

   Round flow:
     beginGame -> startRound -> startPreRound (round banner, 3-2-1) -> beginRound (60s clock)
       -> endRound (KO or time) -> showRoundResult -> Next Round -> startRound ...
       -> endGame when someone has won 2 rounds, or after the last round.
   Every countdown timer goes through later()/every() so endGame can cancel them all.
*/

// ── Timers ──────────────────────────────────────────────────────────────────

function later(fn, ms) {
    const id = setTimeout(fn, ms);
    pendingTimers.push(id);
    return id;
}

function every(fn, ms) {
    const id = setInterval(fn, ms);
    pendingTimers.push(id);
    return id;
}

function clearPendingTimers() {
    pendingTimers.forEach(id => { clearTimeout(id); clearInterval(id); });
    pendingTimers = [];
    clearInterval(roundIntervalId);
    clearInterval(player02IntervalId);
}

// ── Small helpers ───────────────────────────────────────────────────────────

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Restart a sound from the beginning, even if the same file just played.
function playSound($audio, name) {
    if (!soundOn) return;
    const el = $audio[0];
    if (!el) return;
    el.src = `${audioPath}${name}.mp3`;
    el.currentTime = 0;
    const playing = el.play();
    if (playing) playing.catch(() => { /* blocked until the user interacts: ignore */ });
}

function showPopup($popup) {
    $popup.css('display', 'block').css('opacity', '1');
}

function hidePopup($popup) {
    $popup.css('display', 'none').css('opacity', '0');
}

// ── Popups ──────────────────────────────────────────────────────────────────

function openExitGame() {
    pauseRound('exit');
    showPopup($exitGame);
    $main.addClass('overlay disabled');
    $gameData.addClass('disabled');
}

function closeExitGame() {
    hidePopup($exitGame);
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    resumeRound('exit');
}

function openResumeGame() {
    showPopup($resumeGame);
    $gameData.addClass('disabled');
    $play.addClass('hide');
    $exit.addClass('hide');
}

function closeResumeGame() {
    hidePopup($resumeGame);
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    $play.removeClass('hide');
    $exit.addClass('hide');
}

function openStartGame() {
    isStartGameClicked = true;
    if (findUnfinishedGame()) {
        openResumeGame();
        return;
    }
    showPopup($startGame);
    $gameData.addClass('disabled');
    $play.addClass('hide');
    $exit.addClass('hide');
}

function closeStartGame() {
    hidePopup($startGame);
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    $play.removeClass('hide');
    $exit.addClass('hide');
}

function closeEndGame() {
    hidePopup($endGame);
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    $play.removeClass('hide');
    $exit.addClass('hide');
}

function closeRoundResult() {
    hidePopup($roundResult);
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
}

function openRoundCountdown() { showPopup($countDown); }
function closeRoundCountdown() { hidePopup($countDown); }
function openCurrentRound() { showPopup($currentRound); }
function closeCurrentRound() { hidePopup($currentRound); }
function openPreRound() { showPopup($preRound); }
function closePreRound() { hidePopup($preRound); }

function openDeleteAllGames() {
    showPopup($deleteAllGames);
    $main.addClass('overlay disabled');
    $gameData.addClass('disabled');
}

function closeDeleteAllGames() {
    hidePopup($deleteAllGames);
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
}

function deleteAllSavedGames() {
    localStorage.removeItem('gameStates');
    closeDeleteAllGames();
    displayGameHistory();
}

function closeAllPopupsExceptRoundResult() {
    [$exitGame, $resumeGame, $startGame, $endGame, $countDown, $currentRound, $preRound, $deleteAllGames].forEach(hidePopup);
}

// ── Game and round flow ─────────────────────────────────────────────────────

// fresh = true starts from round 1; false keeps the rounds restored by continueGame().
function beginGame(fresh) {
    clearPendingTimers();
    if (fresh) {
        discardUnfinishedGame();
        currentRound = 0;
        maxRounds = initMaxRound;
        player01.resetPlayerStats();
        player02.resetPlayerStats();
    }
    gameStarted = true;
    isGameEnded = false;
    isRoundEnded = false;
    closeAllPopupsExceptRoundResult();
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    $exit.removeClass('hide');
    $play.addClass('hide');
    startRound();
}

function startRound() {
    closeRoundResult();
    if (!gameStarted) return;

    currentRound++;
    isRoundEnded = false;
    player01.resetRoundStats();
    player02.resetRoundStats();
    updatePlayersLife();
    updatePlayersPosition();
    startPreRound();
}

// Round banner, then a 3-2-1 countdown, then the round itself.
function startPreRound() {
    startGameAudio();
    displayCurrentRoundInfo();
    later(() => displayPreRoundInfo(preRoundCount), currentRoundTimeout);
}

function displayCurrentRoundInfo() {
    $currentRoundData.text(`Round ${currentRound}`);
    openCurrentRound();
    later(closeCurrentRound, currentRoundTimeout);
}

function displayPreRoundInfo(countdown) {
    $preRoundData.text(`${countdown}`);
    openPreRound();

    const interval = every(() => {
        countdown--;
        $preRoundData.text(`${countdown}`);
        if (countdown <= preRoundCountEnd) {
            clearInterval(interval);
            closePreRound();
            beginRound();
        }
    }, preRoundInterval);
}

function beginRound() {
    if (!gameStarted) return;
    roundActive = true;
    roundPaused = false;
    roundRemaining = roundDuration;
    $pauseBtn.prop('disabled', false).text('Pause');
    enableControls();
    $roundCountDown.text('START!!!');
    playSound($roundStartAudio, 'start');
    openRoundCountdown();
    runRoundClock();
}

function runRoundClock() {
    clearInterval(roundIntervalId);
    roundIntervalId = every(() => {
        roundRemaining--;
        $roundCountDown.text(roundRemaining);
        if (roundRemaining <= countdownEnd || isRoundOver()) {
            endRound();
        }
    }, roundInterval);
}

// The Exit confirmation freezes the round so nobody gets hit while deciding.
let pauseReason = null; // 'button' or 'exit': only what paused the round may resume it

function pauseRound(reason = 'exit') {
    if (!roundActive || roundPaused) return;
    pauseReason = reason;
    roundPaused = true;
    $pauseBtn.text('Resume');
    roundActive = false;
    clearInterval(roundIntervalId);
    disableControls();
}

function resumeRound(reason = 'exit') {
    if (!roundPaused || !gameStarted || reason !== pauseReason) return;
    pauseReason = null;
    roundPaused = false;
    $pauseBtn.text('Pause');
    roundActive = true;
    enableControls();
    runRoundClock();
}

function isRoundOver() {
    return player01.currentLife <= minLife || player02.currentLife <= minLife;
}

// Ends the round exactly once, whether by knockout or by the clock.
function endRound() {
    if (!roundActive) return;
    roundActive = false;
    isRoundEnded = true;
    clearInterval(roundIntervalId);
    disableControls();
    $pauseBtn.prop('disabled', true).text('Pause');
    closeRoundCountdown();
    countPlayerWin();

    const p1 = player01.roundsWon;
    const p2 = player02.roundsWon;
    let finished = false;

    if (p1 >= minRoundsToWIn || p2 >= minRoundsToWIn) {
        finished = true;
    } else if (currentRound >= maxRounds) {
        if (p1 !== p2 || maxRounds >= maxRoundsCap) {
            finished = true;
        } else {
            maxRounds++; // tied: play an extra round
        }
    }

    saveGameState(finished);

    if (finished) {
        endGame(true);
    } else {
        showRoundResult();
    }
}

function countPlayerWin() {
    if (player01.currentLife > player02.currentLife) {
        player01.updateRoundsWon();
    } else if (player02.currentLife > player01.currentLife) {
        player02.updateRoundsWon();
    }
}

function showRoundResult() {
    let text, image, sound;
    if (player01.currentLife > player02.currentLife) {
        text = `${player01.playerName} ${roundWin}`;
        image = 'win';
        sound = 'round-win';
    } else if (player02.currentLife > player01.currentLife) {
        text = `${player02.playerName} ${roundWin}`;
        image = 'lose';
        sound = 'round-lose';
    } else {
        text = roundDraw;
        image = 'draw';
        sound = 'round-draw';
    }

    $roundResultHeader.text(`Round ${currentRound}`);
    $roundResultDetails.text(`${text} Rounds won: ${player01.playerName} ${player01.roundsWon}, ${player02.playerName} ${player02.roundsWon}.`);
    $roundResultImage.attr({ src: `${artPath}${image}.svg`, alt: text });
    playSound($roundResultAudio, sound);
    showPopup($roundResult);
    $main.addClass('overlay disabled');
}

// finished = true when the match was decided; false when the player quit early.
function endGame(finished) {
    if (isGameEnded) {
        closeEndGame();
        return;
    }

    clearPendingTimers();
    stopGameAudio();
    disableControls();
    roundActive = false;
    roundPaused = false;
    pauseReason = null;
    $pauseBtn.prop('disabled', true).text('Pause');
    isRoundEnded = true;
    isGameEnded = true;
    gameStarted = false;
    isStartGameClicked = false;

    const p1 = player01.roundsWon;
    const p2 = player02.roundsWon;
    const name = player01.playerName;
    let title, resultClass, details;

    if (!finished) {
        discardUnfinishedGame();
        title = 'Game ended';
        resultClass = 'draw';
        details = `You left the game after round ${currentRound}. Rounds won: ${name} ${p1}, ${player02.playerName} ${p2}.`;
    } else if (p1 > p2) {
        title = 'Congratulations! You win';
        resultClass = 'success';
        details = `Well fought, ${name}! You won ${p1} of ${currentRound} rounds.`;
    } else if (p2 > p1) {
        title = 'Too bad! You lose';
        resultClass = 'failure';
        details = `${player02.playerName} won ${p2} of ${currentRound} rounds. Try again, ${name}.`;
    } else {
        title = 'It\'s a draw!';
        resultClass = 'draw';
        details = `${name} and ${player02.playerName} each won ${p1} rounds after ${currentRound} rounds.`;
    }

    closeAllPopupsExceptRoundResult();
    closeRoundResult();
    $endGameHeader.text(title);
    $endGameDetails.text(details).removeClass('success failure draw').addClass(resultClass);
    $endGameImage.attr({ src: `${artPath}${{ success: 'win', failure: 'lose', draw: 'draw' }[resultClass]}.svg`, alt: title });
    playSound($endGameAudio, resultClass);
    showPopup($endGame);
    $main.addClass('overlay disabled');
    $exit.addClass('hide');
    $play.removeClass('hide');

    displayGameHistory();
    currentRound = 0;
    maxRounds = initMaxRound;
    player01.resetPlayerStats();
    player02.resetPlayerStats();
    updatePlayersLife();
    updatePlayersPosition();
}

// ── Controls ────────────────────────────────────────────────────────────────

const keyActions = {
    37: ['move', 'left'], 38: ['move', 'up'], 39: ['move', 'right'], 40: ['move', 'down'],
    49: ['attack', 'punch'], 80: ['attack', 'punch'],
    50: ['attack', 'kick'], 75: ['attack', 'kick'],
    51: ['attack', 'block'], 32: ['attack', 'block'], 66: ['attack', 'block'],
    52: ['attack', 'combo'], 67: ['attack', 'combo'],
};

function onGameKey(e) {
    if ($(e.target).is('input, textarea')) return; // typing a name is not a punch
    const action = keyActions[e.which];
    if (!action) return;
    e.preventDefault(); // arrows and Space must not scroll the page mid-fight
    if (e.originalEvent && e.originalEvent.repeat && action[0] === 'attack') return; // holding a key is not a combo
    player01[action[0]](action[1], player02);
}

function disableControls() {
    $controls.attr('disabled', true);
    $(document).off('keydown.fightfusion');
    clearInterval(player02IntervalId);
}

function enableControls() {
    if (!gameStarted) return;
    $controls.attr('disabled', false);
    $(document).off('keydown.fightfusion').on('keydown.fightfusion', onGameKey);
    clearInterval(player02IntervalId);
    player02IntervalId = setInterval(player02Controls, difficulties[difficulty].interval);
}

// The computer closes the distance, then fights; it no longer wanders at random.
function player02Controls() {
    if (!roundActive) return;
    const inRange = isColliding(player02, player01);

    if (!inRange) {
        const towards = player02.currentWidthOffset > player01.currentWidthOffset ? 'left' : 'right';
        player02.move(Math.random() < 0.8 ? towards : (towards === 'left' ? 'right' : 'left'), player01);
        return;
    }

    const { blockChance } = difficulties[difficulty];
    const roll = Math.random();
    if (roll < 0.06) {
        player02.move(Math.random() < 0.5 ? 'up' : 'down', player01); // sometimes dodges
        return;
    }
    let move = 'punch';
    if (roll < 0.06 + blockChance) move = 'block';
    else if (roll < 0.06 + blockChance + 0.3) move = 'kick';
    else if (roll < 0.06 + blockChance + 0.4 && player02.currentCombo > minCombo) move = 'combo';
    player02.attack(move, player01);
}

// ── Combat ──────────────────────────────────────────────────────────────────

function handleAttack(attackingPlayer, move, opponent) {
    if (!roundActive || !opponent) return;

    const isPlayer01 = attackingPlayer === player01;
    const $attackerAudio = isPlayer01 ? $player01Audio : $player02Audio;
    const $defenderHit = isPlayer01 ? $player02Hit : $player01Hit;
    const $attackerName = isPlayer01 ? $player01Name : $player02Name;
    const $defenderName = isPlayer01 ? $player02Name : $player01Name;

    setPose(attackingPlayer, move);

    // Block: no damage, protects against the next hit for a short window.
    if (move === 'block') {
        attackingPlayer.clearBlock();
        attackingPlayer.isBlocking = true;
        attackingPlayer.blockTimer = setTimeout(() => { attackingPlayer.isBlocking = false; }, blockWindow);
        attackingPlayer.attackValue = blockHit;
        playSound($attackerAudio, 'block');
        return;
    }

    attackingPlayer.clearBlock(); // attacking drops your guard

    if (move === 'combo' && attackingPlayer.currentCombo <= minCombo) return; // no combos left
    if (!isColliding(attackingPlayer, opponent)) {
        log(`${attackingPlayer.getId()} ${move} missed`);
        return;
    }

    let damage = singleHit;
    if (move === 'combo') {
        attackingPlayer.currentCombo--;
        damage = comboHit;
    }

    // Crouching ducks high attacks (punch, combo); jumping clears kicks.
    const dodged = (opponent.evade === 'crouch' && (move === 'punch' || move === 'combo')) ||
        (opponent.evade === 'jump' && move === 'kick');
    const blocked = !dodged && opponent.isBlocking;
    if (dodged || blocked) damage = 0;

    opponent.currentLife = Math.max(minLife, opponent.currentLife - damage);
    attackingPlayer.attackValue = damage;
    updatePlayersLife();
    playSound($attackerAudio, damage ? move : 'block');
    showHit($defenderHit, dodged ? 'Dodged' : blocked ? 'Blocked' : `-${damage}`, damage === 0);

    if (damage) {
        opponent.$element.removeClass('is-hit');
        void opponent.$element[0].offsetWidth; // restart the hit flash
        opponent.$element.addClass('is-hit');
        setTimeout(() => opponent.$element.removeClass('is-hit'), 300);
    }

    $attackerName.addClass('attacker');
    $defenderName.addClass('attacked');
    setTimeout(() => {
        $attackerName.removeClass('attacker');
        $defenderName.removeClass('attacked');
    }, 600);

    if (opponent.currentLife <= minLife) {
        endRound();
    }
}

function showHit($el, text, soft) {
    $el.stop(true, true).toggleClass('is-blocked', soft).text(text).show().fadeOut(fadeOutInterval);
}

// Switch the fighter drawing to a pose, then back to the guard stance.
function setPose(player, pose) {
    const arms = { punch: 'punch', block: 'block', combo: 'combo' }[pose] || 'guard';
    const legs = pose === 'kick' ? 'kick' : pose === 'up' ? 'tuck' : 'stand';
    player.$element.attr({ 'data-arms': arms, 'data-legs': legs });
    clearTimeout(player.poseTimer);
    if (pose !== 'stand') {
        player.poseTimer = setTimeout(() => {
            player.$element.attr({ 'data-arms': 'guard', 'data-legs': 'stand' });
        }, pose === 'block' ? blockWindow : 380);
    }
}

// Closest the two fighters' positions may get: their bodies touch, never overlap.
function closestDistance(a, b) {
    return 0.5 * (a.width + b.width) / 2;
}

// In range when a punch or kick drawn from one fighter reaches the other's body.
function isColliding(player1, player2) {
    const distance = Math.abs(player1.currentWidthOffset - player2.currentWidthOffset);
    const reach = 0.95 * (player1.width + player2.width) / 2;
    isCollision = distance <= reach;
    return isCollision;
}

// ── Life bars and positions ─────────────────────────────────────────────────

function updatePlayerLife(player) {
    const $playerLife = $(`#${player.getId()}-life`);
    const life = Math.max(minLife, player.currentLife);
    let lifeColor = 'green';
    if (life <= dangerLife) {
        lifeColor = 'red';
    } else if (life <= warningLife) {
        lifeColor = 'yellow';
    }
    $playerLife.css({
        'width': `${(life / maxLife) * 100}%`,
        'background-color': lifeColor
    });
}

function updatePlayersLife() {
    updatePlayerLife(player01);
    updatePlayerLife(player02);
}

// Start positions: player on the left edge, computer on the right edge of the arena.
function updatePlayersPosition() {
    const containerWidth = $playerArea.width();
    player01.width = player01.$element.outerWidth();
    player02.width = player02.$element.outerWidth();
    player01.updatePosition(0);
    player02.updatePosition(Math.max(0, containerWidth - player02.width));
}

// ── Audio ───────────────────────────────────────────────────────────────────

function startGameAudio() {
    if (!soundOn) return;
    const el = $gameAudio[0];
    if (!el.src.endsWith('game-play.mp3')) el.src = `${audioPath}game-play.mp3`;
    el.loop = true;
    const playing = el.play();
    if (playing) playing.catch(() => { });
}

function stopGameAudio() {
    $gameAudio[0].pause();
    $gameAudio[0].currentTime = 0;
}

// ── Save, resume and history ────────────────────────────────────────────────

function readGameStates() {
    try {
        return JSON.parse(localStorage.getItem('gameStates')) || [];
    } catch {
        return [];
    }
}

function findUnfinishedGame() {
    return readGameStates().find(game => game.status === gameInProgress);
}

function discardUnfinishedGame() {
    const states = readGameStates().filter(game => game.status !== gameInProgress);
    localStorage.setItem('gameStates', JSON.stringify(states));
    displayGameHistory();
}

function checkForUnfinishedGame() {
    setTimeout(() => {
        if (isStartGameClicked || gameStarted) return;
        if (findUnfinishedGame()) {
            openResumeGame();
        } else {
            openStartGame();
        }
    }, openStartGameTimeout);
}

function continueGame() {
    const saved = findUnfinishedGame();
    if (!saved) {
        beginGame(true);
        return;
    }
    currentRound = saved.currentRound;
    maxRounds = saved.maxRounds || initMaxRound;
    player01.resetPlayerStats();
    player02.resetPlayerStats();
    player01.roundsWon = saved.player.roundsWon || 0;
    player02.roundsWon = saved.computer.roundsWon || 0;
    beginGame(false);
}

function determineGameWinner(finished) {
    if (!finished) return nil;
    if (player01.roundsWon > player02.roundsWon) return player01.playerName;
    if (player02.roundsWon > player01.roundsWon) return player02.playerName;
    return nil;
}

function getFormattedTimestamp() {
    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${hours}:${minutes}:${seconds}`;
}

function saveGameState(finished) {
    let gameStates = readGameStates();
    const winner = determineGameWinner(finished);
    const status = !finished ? gameInProgress : (winner === nil ? gameDrawn : gameFinished);

    const gameState = {
        id: Date.now(),
        timestamp: getFormattedTimestamp(),
        player: {
            name: player01.playerName,
            life: player01.currentLife,
            combo: player01.currentCombo,
            roundsWon: player01.roundsWon,
        },
        computer: {
            name: player02.playerName,
            life: player02.currentLife,
            combo: player02.currentCombo,
            roundsWon: player02.roundsWon,
        },
        status: status,
        currentRound: currentRound,
        maxRounds: maxRounds,
        winner: winner,
    };

    // Only one game can be in progress: replace it rather than adding a row per round.
    gameStates = gameStates.filter(game => game.status !== gameInProgress);
    gameStates.push(gameState);
    localStorage.setItem('gameStates', JSON.stringify(gameStates));
    displayGameHistory();
}

function displayGameHistory() {
    $gameHistoryList.empty();
    const gameStates = readGameStates();

    if (gameStates.length === 0) {
        $gameHistoryList.append(`<p class='no-marker'>No games played yet.</p>`);
        $deleteGame.hide();
        return;
    }

    let table = `<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Date</th>
            <th>Status</th>
            <th>Winner</th>
            <th>Rounds played</th>
            <th>Player</th>
            <th>Computer</th>
        </tr>
    </thead>
    <tbody>`;

    gameStates.forEach((game, index) => {
        const player = game.player || {};
        const computer = game.computer || {};
        table += `<tr>
    <td data-label="#">${index + 1}</td>
    <td data-label="Date">${escapeHtml(game.timestamp)}</td>
    <td data-label="Status">${escapeHtml(game.status)}</td>
    <td data-label="Winner">${escapeHtml(game.winner === nil ? '—' : game.winner)}</td>
    <td data-label="Rounds played">${escapeHtml(game.currentRound)}</td>
    <td data-label="Player">
        <ul>
            <li>Rounds won: ${escapeHtml(player.roundsWon ?? 0)}</li>
            <li>Life: ${escapeHtml(player.life ?? '')}</li>
            <li>Combos left: ${escapeHtml(player.combo ?? '')}</li>
        </ul>
    </td>
    <td data-label="Computer">
        <ul>
            <li>Rounds won: ${escapeHtml(computer.roundsWon ?? 0)}</li>
            <li>Life: ${escapeHtml(computer.life ?? '')}</li>
            <li>Combos left: ${escapeHtml(computer.combo ?? '')}</li>
        </ul>
    </td>
  </tr>`;
    });

    table += `</tbody></table>`;
    $gameHistoryList.append(table);
    $deleteGame.show();
}

// ── Instructions and names ──────────────────────────────────────────────────

function setGameInstructions() {
    const you = escapeHtml(playerName || 'Player');
    const them = escapeHtml(computerName);
    $gameInstructions.html(`
        <ul>
            <li>Each round lasts ${roundDuration} seconds. Win ${minRoundsToWIn} rounds to win the match.</li>
            <li>Win a round by knocking out ${them}, or by having more life when time runs out.</li>
            <li>If the rounds are tied after ${initMaxRound}, extra rounds are played, up to ${maxRoundsCap} in total.</li>
            <li>Move: left and right arrow keys, or hold the on-screen arrows. Get close to ${them} to land a hit.</li>
            <li>Punch: P or 1. Kick: K or 2. Combo: C or 4 (3 damage, ${maxCombo} per round).</li>
            <li>Block: B, 3 or Space. It stops the next hit for a moment, but attacking drops your guard.</li>
            <li>Jump (up arrow) clears kicks. Crouch (down arrow) ducks punches and combos.</li>
            <li>Pause any time with the Pause button. ${you}, you can change your name below.</li>
        </ul>
    `);
}

function updatePlayerName() {
    $updatePlayerName.on('input', function () {
        playerName = $(this).val().trim().slice(0, 20) || 'Player';
        player01.playerName = playerName;
        setGameInstructions();
        displayPlayersName();
    });
}

function displayPlayersName() {
    $player01Name.text(player01.playerName);
    $player02Name.text(player02.playerName);
}

// ── Pause and sound buttons ─────────────────────────────────────────────────

function togglePause() {
    if (roundPaused) {
        resumeRound('button');
    } else {
        pauseRound('button');
    }
}

function renderSoundButton() {
    $soundBtn.text(soundOn ? 'Sound on' : 'Sound off').attr('aria-pressed', String(soundOn));
}

function toggleSound() {
    soundOn = !soundOn;
    localStorage.setItem('ff-sound', soundOn ? 'on' : 'off');
    renderSoundButton();
    if (!soundOn) {
        $gameAudio[0].pause();
    } else if (gameStarted) {
        startGameAudio();
    }
}
