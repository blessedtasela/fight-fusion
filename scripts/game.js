
// Call these functions on page load or when appropriate
feather.replace();
displayGameHistory();
checkForUnfinishedGame();
disableControls();
updatePlayerPosition(player01);
updatePlayerPosition(player02);
$deleteGame.click(openDeleteAllGames);
$deleteDeleteAllGames.click(deleteAllSavedGames);
$cancelDeleteAllGames.click(closeDeleteAllGames);
$closeDeleteGame.click(closeDeleteAllGames);
$closeResumeGame.click(closeResumeGame);
$closeStartGame.click(closeStartGame);
$cancelStartGame.click(closeStartGame);
$startNewGame.click(beginGame);
$play.click(openStartGame);
$exit.click(openExitGame);
$continueResumeGame.click(continueGame);
$startResumeNewGame.click(beginGame)
$closeExitGame.click(closeExitGame);
$cancelExitGame.click(closeExitGame);
$finishExitGame.click(endGame);
$endGameNewGame.click(beginGame);
$cancelEndGame.click(closeEndGame);
$closeEndGame.click(closeEndGame);
$closeRoundResult.click(closeRoundResult);
$nextRound.click(startRound);
$roundEndGame.click(endGame);
$gameData.removeClass('disabled');

// openRoundCountdown()


$(window).resize(function () {
    updatePlayerPosition(player01);
    updatePlayerPosition(player02);
});

$showGameHistory.click(function () {
    $gameHistory.slideToggle(800);
    $hideGameHistory.toggleClass('toggle-game hide-game');
    $showGameHistory.toggleClass('hide-game');
})

$hideGameHistory.click(function () {
    $gameHistory.slideToggle(800);
    $hideGameHistory.toggleClass('toggle-game hide-game');
    $showGameHistory.toggleClass('hide-game');
})


  // Player01 controls
  $btnUp.click(() => player01.move('up', player02));
  $btnDown.click(() => player01.move('down', player02));
  $btnLeft.click(() => player01.move('left', player02));
  $btnRight.click(() => player01.move('right', player02));

  $btnPunch.click(() => player01.attack('punch', player02));
  $btnKick.click(() => player01.attack('kick', player02));
  $btnBlock.click(() => player01.attack('block', player02));
  $btnCombo.click(() => player01.attack('combo', player02));

  // Keyboard controls for movement
  $(document).keydown(function (e) {
      switch (e.which) {
          case 37: // Left arrow key
              player01.move('left', player02);
              break;
          case 38: // Up arrow key
              player01.move('up', player02);
              break;
          case 39: // Right arrow key
              player01.move('right', player02);
              break;
          case 40: // Down arrow key
              player01.move('down', player02);
              break;
      }
  });

  // Keyboard controls for attack
  $(document).keydown(function (e) {
      switch (e.which) {
          case 49: // Key '1'
          case 80: // 'p' key
              player01.attack('punch', player02);
              break;
          case 50: // Key '2'
          case 75: // 'k' key
              player01.attack('kick', player02);
              break;
          case 51: // Key '3'
          case 32: // Space key
          case 66: // 'b' key
              player01.attack('block', player02);
              break;
          case 52: // Key '4'
          case 67: // 'c' key
              player01.attack('combo', player02);
              break;
      }
  });

