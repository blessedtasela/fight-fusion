// Page setup for play-game.html
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
$play.click(openStartGame);
$exit.click(openExitGame);
$continueResumeGame.click(continueGame);
$startResumeNewGame.click(() => beginGame(true));
$closeExitGame.click(closeExitGame);
$cancelExitGame.click(closeExitGame);
$finishExitGame.click(() => endGame(false));
$endGameNewGame.click(() => beginGame(true));
$cancelEndGame.click(closeEndGame);
$nextRound.click(startRound);
$roundEndGame.click(() => endGame(false));

updatePlayersLife();

// Re-place the fighters when the window size changes, but never in the middle of a round.
$(window).resize(function () {
    if (!roundActive) updatePlayersPosition();
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

// On-screen controls. Keyboard controls are attached only while a round runs (enableControls).
$btnUp.click(() => player01.move('up', player02));
$btnDown.click(() => player01.move('down', player02));
$btnLeft.click(() => player01.move('left', player02));
$btnRight.click(() => player01.move('right', player02));

$btnPunch.click(() => player01.attack('punch', player02));
$btnKick.click(() => player01.attack('kick', player02));
$btnBlock.click(() => player01.attack('block', player02));
$btnCombo.click(() => player01.attack('combo', player02));

disableControls();
