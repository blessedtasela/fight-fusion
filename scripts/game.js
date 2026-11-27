// Page setup for play-game.html

// Draw both fighters from the shared SVG template.
const fighterTemplate = document.getElementById('fighter-template');
document.querySelectorAll('.fighter-art').forEach(el => el.appendChild(fighterTemplate.content.cloneNode(true)));

// Names and life bars live in the arena's top corners, so they never collide when the fighters close in.
const $hudBar = $('<div class="hud-bar"></div>').prependTo($playerArea);
$('#player01 .fighter-hud').appendTo($hudBar);
$('#player02 .fighter-hud').addClass('hud-right').appendTo($hudBar);

// Keep the game below the fixed navbar, whatever height the navbar wraps to.
function syncNavHeight() {
    document.documentElement.style.setProperty('--nav-h', `${$('#nav').outerHeight()}px`);
}
syncNavHeight();
$(window).on('resize', syncNavHeight);

feather.replace();
displayGameHistory();
checkForUnfinishedGame();
updatePlayersPosition();

// Popups. Handlers are wrapped so jQuery's click event is never passed as an argument.
$deleteGame.click(openDeleteAllGames);
$deleteDeleteAllGames.click(deleteAllSavedGames);
$cancelDeleteAllGames.click(closeDeleteAllGames);
$closeDeleteGame.click(closeDeleteAllGames);
$closeResumeGame.click(closeResumeGame);
$closeStartGame.click(closeStartGame);
$cancelStartGame.click(closeStartGame);
$startNewGame.click(() => beginGame(true));
$play.find('button').click(openStartGame);
$exit.children('button').click(openExitGame);
$continueResumeGame.click(continueGame);
$startResumeNewGame.click(() => beginGame(true));
$closeExitGame.click(closeExitGame);
$cancelExitGame.click(closeExitGame);
$finishExitGame.click(() => endGame(false));
$endGameNewGame.click(() => beginGame(true));
$cancelEndGame.click(closeEndGame);
$nextRound.click(startRound);
$roundEndGame.click(() => endGame(false));

// Pause, sound and difficulty
$pauseBtn.click(togglePause);
$soundBtn.click(toggleSound);
renderSoundButton();
$(`input[name="difficulty"][value="${difficulty}"]`).prop('checked', true);
$('input[name="difficulty"]').on('change', function () {
    difficulty = this.value;
    localStorage.setItem('ff-difficulty', difficulty);
});

updatePlayersLife();

// Re-place the fighters when the window size changes, but never in the middle of a round.
$(window).resize(function () {
    if (!roundActive && !roundPaused) updatePlayersPosition();
});

setGameInstructions();

$updatePlayerName.val(player01.playerName);
updatePlayerName();
displayPlayersName();

$gameAudio[0].volume = 0.1;

$showGameHistory.click(function () {
    $gameHistory.slideToggle(800);
    $hideGameHistory.toggleClass('toggle-game hide-game');
    $showGameHistory.toggleClass('hide-game');
});

$hideGameHistory.click(function () {
    $gameHistory.slideToggle(800);
    $hideGameHistory.toggleClass('toggle-game hide-game');
    $showGameHistory.toggleClass('hide-game');
});

// On-screen arrows: press and hold to keep walking. Keyboard (Enter/Space on a
// focused button) still works through the click event, which has detail 0.
function bindHoldToMove($btn, direction) {
    let holdTimer = null;
    const stop = () => { clearInterval(holdTimer); holdTimer = null; };

    $btn.on('pointerdown', function (e) {
        if (this.disabled) return;
        e.preventDefault();
        player01.move(direction, player02);
        stop();
        if (direction === 'left' || direction === 'right') {
            holdTimer = setInterval(() => player01.move(direction, player02), moveThrottle + 10);
        }
    });
    $btn.on('pointerup pointerleave pointercancel', stop);
    $btn.on('click', e => { if (e.detail === 0) player01.move(direction, player02); });
}

bindHoldToMove($btnUp, 'up');
bindHoldToMove($btnDown, 'down');
bindHoldToMove($btnLeft, 'left');
bindHoldToMove($btnRight, 'right');

$btnPunch.click(() => player01.attack('punch', player02));
$btnKick.click(() => player01.attack('kick', player02));
$btnBlock.click(() => player01.attack('block', player02));
$btnCombo.click(() => player01.attack('combo', player02));

disableControls();
