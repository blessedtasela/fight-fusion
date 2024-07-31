
function openExitGame() {
    console.log('openExitGame popups have been opened.');
    $exitGame.css('display', 'block').css('opacity', '1');
    $main.removeClass('overlay disabled');
    $gameData.addClass('disabled');
}

function closeExitGame() {
    console.log('closeExitGame popups have been closed.');
    $exitGame.css('display', 'none').css('opacity', '0');
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
}

function openResumeGame() {
    console.log('openResumeGame popups have been close.');
    $resumeGame.css('display', 'block').css('opacity', '1');
    $main.removeClass('overlay disabled');
    $gameData.addClass('disabled');
    $play.addClass('hide');
    $exit.removeClass('hide');
}

function closeResumeGame() {
    console.log('closeResumeGame popups have been close.');
    $resumeGame.css('display', 'none').css('opacity', '0');
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    $play.removeClass('hide');
    $exit.addClass('hide');
}

function openStartGame() {
    isStartGameClicked = true;
    let gameStates = JSON.parse(localStorage.getItem('gameStates')) || [];
    const unfinishedGame = gameStates.find(game => game.status === gameInProgress);

    if (unfinishedGame) {
        openResumeGame();
    } else {
        console.log('openStartGame popups have been opened.');
        $startGame.css('display', 'block').css('opacity', '1');
        $main.removeClass('overlay disabled');
        $gameData.addClass('disabled');
        $play.addClass('hide');
        $exit.removeClass('hide');
    }
}

function closeStartGame() {
    console.log('closeStartGame popups have been close.');
    $startGame.css('display', 'none').css('opacity', '0');
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    $play.removeClass('hide');
    $exit.addClass('hide')
}

function openEndGame() {
    console.log('openStartGame popups have been opened.');
    $endGame.css('display', 'block').css('opacity', '1');
    $exit.addClass('hide');
    $play.removeClass('hide');
    $main.addClass('overlay disabled');
    $gameData.addClass('disabled');
}

function closeEndGame() {
    console.log('closeStartGame popups have been close.');
    $endGame.css('display', 'none').css('opacity', '0');
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    $play.removeClass('hide ');
    $exit.addClass('hide')
}

function openRoundResult() {
    if (isRoundEnded) {
        return;
    }

    console.log('openRoundResult popups have been opened.');
    $roundResult.css('display', 'block').css('opacity', '1');
    $exit.removeClass('hide');
    $play.addClass('hide');
    $main.addClass('overlay disabled');
    $gameData.addClass('disabled');
}

function closeRoundResult() {
    console.log('closeRoundResult popups have been closed.');
    $roundResult.css('display', 'none').css('opacity', '0');
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    $play.addClass('hide');
    $exit.removeClass('hide')
}

function openRoundCountdown() {
    console.log('openRoundCountdown popups have been opened.');
    $roundCountDown.css('display', 'block').css('opacity', '1');
}

function closeRoundCountdown() {
    console.log('closeRoundCountdown popups have been closed.');
    $roundCountDown.css('display', 'none').css('opacity', '0');
}

function openCurrentRound() {
    console.log('openCurrentRound popups have been opened.');
    $currentRound.css('display', 'block').css('opacity', '1');
}

function closeCurrentRound() {
    console.log('closeCurrentRound popups have been closed.');
    $currentRound.css('display', 'none').css('opacity', '0');
}

function openPreRound() {
    console.log('openPreRound popups have been opened.');
    $preRound.css('display', 'block').css('opacity', '1');
}

function closePreRound() {
    console.log('closePreRound popups have been closed.');
    $preRound.css('display', 'none').css('opacity', '0');
}


function openDeleteAllGames() {
    $deleteAllGames.css('display', 'block').css('opacity', '1');
    $main.addClass('overlay disabled');
    $gameData.addClass('disabled');
}

function closeDeleteAllGames() {
    console.log('closeDeleteAllGames popups have been close.');
    $deleteAllGames.css('display', 'none').css('opacity', '0');
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
}

function deleteAllSavedGames() {
    localStorage.removeItem('gameStates');
    console.log('All saved games have been deleted.');
    closeDeleteAllGames();
    displayGameHistory();
}


function beginGame() {
    gameStarted = true;
    $startGame.css('display', 'none').css('opacity', '0');
    $resumeGame.css('display', 'none').css('opacity', '0');
    $endGame.css('display', 'none').css('opacity', '0');
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    $exit.removeClass('hide');
    $play.addClass('hide');
    startRound();
}

function closeAllPopups() {
    console.log('Closing all popups.');

    // Close each popup
    $exitGame.css('display', 'none').css('opacity', '0');
    $resumeGame.css('display', 'none').css('opacity', '0');
    $startGame.css('display', 'none').css('opacity', '0');
    $endGame.css('display', 'none').css('opacity', '0');
    $roundResult.css('display', 'none').css('opacity', '0');
    $roundCountDown.css('display', 'none').css('opacity', '0');
    $currentRound.css('display', 'none').css('opacity', '0');
    $preRound.css('display', 'none').css('opacity', '0');
    $deleteAllGames.css('display', 'none').css('opacity', '0');

    // Restore main and gameData classes
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');

    // Reset game controls and states
    // $play.removeClass('hide');
    // $exit.removeClass('hide');
}



function saveGameState() {
    let gameStates = JSON.parse(localStorage.getItem('gameStates')) || [];
    let gameStatus = (player01.currentLife > 0 && player02.currentLife > 0) ? gameInProgress : gameFinished;

    let ongoingGameIndex = gameStates.findIndex(game => game.isGameInProgress);
    let winner = null;

    if (player01Wins >= 2) {
        winner = player01.playerName;
    } else if (player02Wins >= 2) {
        winner = player02.playerName;
    } else if (currentRound >= maxRounds && player01Wins !== player02Wins) {
        winner = player01Wins > player02Wins ? player01.playerName : player02.playerName;
    } else {
        winner = player02.playerName;
    }

    if (ongoingGameIndex >= 0) {
        // Update the existing ongoing game
        gameStates[ongoingGameIndex] = {
            ...gameStates[ongoingGameIndex],
            player: {
                position: player01.position,
                life: player01.currentLife,
                combo: player01.currentCombo
            },
            computer: {
                position: player02.position,
                life: player02.currentLife,
                combo: player02.currentCombo
            },
            status: gameStatus,
            currentRound: currentRound,
            maxRounds: maxRounds,
            winner: winner,
        };
    } else {
        // Save a new game state
        const newGameState = {
            id: gameStates.length + 1,
            timestamp: getFormattedTimestamp(),
            player: {
                position: player01.position,
                life: player01.currentLife,
                combo: player01.currentCombo
            },
            computer: {
                position: player02.position,
                life: player02.currentLife,
                combo: player02.currentCombo
            },
            isGameInProgress: currentRound < maxRounds,
            status: gameStatus,
            currentRound: currentRound,
            maxRounds: maxRounds,
            winner: winner,
        };

        gameStates.push(newGameState);
    }

    displayGameHistory();
    localStorage.setItem('gameStates', JSON.stringify(gameStates));
}

// Function to determine the game status
function determineGameStatus() {
    if (currentRound < maxRounds) {
        return 'in-progress';
    }
    if (player01Wins > player02Wins) {
        return 'win';
    } else if (player02Wins > player01Wins) {
        return 'lose';
    } else {
        return 'draw';
    }
}

function startRound() {
    closeRoundResult();
    if (player01Wins >= 2 || player02Wins >= 2 || (player01Wins + player02Wins == initMaxRound && currentRound == maxRounds)) {
        gameEnded();
    } else {
        currentRound++;
        if (currentRound > maxRounds) {
            maxRounds = currentRound;
        }

        startPreRound();
    }
}

// Method to start the pre-round countdown
function startPreRound() {
    let countdown = preRoundCount;
    displayCurrentRoundInfo();

    setTimeout(() => {
        displayPreRoundInfo(countdown);
    }, currentRoundTimeout);

}

// Method to start the actual round
function beginRound() {
    enableControls();
    let roundCountdown = roundDuration;
    console.log(`Round ${currentRound} begins!`);
    displayRoundCountdown(roundCountdown);
}

function isRoundOver() {
    return player01.life <= minLife || player02.life <= minLife;
}



function endRound() {
    // Check if the game should end immediately
    if ((player01Wins >= 2 || player02Wins >= 2) && (currentRound >= initMaxRound || currentRound >= maxRounds)) {
        gameEnded();
    } else if (currentRound >= initMaxRound || currentRound >= maxRounds) {
        // If the maximum number of rounds has been reached, determine the winner
        if (player01Wins > player02Wins && (currentRound >= initMaxRound || currentRound >= maxRounds) || player02Wins > player01Wins && (currentRound >= initMaxRound || currentRound >= maxRounds)) {
            gameEnded();
        } else {
            showRoundResult();
        }
    } else {
        // Show the result of the current round
        showRoundResult();
    }

    closeRoundCountdown();
    closeAllPopups();
    showRoundResult();
    disableControls();

    saveGameState();
}



function displayRoundCountdown(countdown) {
    $roundCountDown.text("START!!!");
    openRoundCountdown();
    let interval = setInterval(() => {
        countdown--;
        console.log(`Round time remaining: ${countdown}`);
        $roundCountDown.text(countdown);
        if (countdown <= countdownEnd || isRoundOver()) {
            clearInterval(interval);
            endRound();
        }
    }, roundInterval);
}
function displayPreRoundInfo(countdown) {
    if (isRoundEnded) {
        return; // Exit if the game has ended
    }

    $preRoundData.text(`${countdown}`);
    openPreRound();

    let interval = setInterval(() => {
        countdown--;
        console.log(`Round ${currentRound} starting in ${countdown}`);
        $preRoundData.text(`${countdown}`);
        if (countdown <= preRoundCountEnd) {
            clearInterval(interval);
            closePreRound();
            if (!isRoundEnded) {
                beginRound();
            }
        }
    }, preRoundInterval);

    setTimeout(() => {
        if (!isRoundEnded) {
            closePreRound();
        }
    }, preRoundTimeout);
}


function displayCurrentRoundInfo() {
    $currentRoundData.text(`Round ${currentRound}`);
    openCurrentRound();

    setTimeout(() => {
        closeCurrentRound();
    }, currentRoundTimeout);
}

function displayPreRoundInfo(countdown) {
    $preRoundData.text(`${countdown}`);
    openPreRound();
    let interval = setInterval(() => {
        countdown--;
        console.log(`Round ${currentRound} starting in ${countdown}`);
        $preRoundData.text(`${countdown}`);
        if (countdown <= preRoundCountEnd) {
            clearInterval(interval);
            closePreRound();
            beginRound();
        }
    }, preRoundInterval);

    setTimeout(() => {
        closePreRound();
    }, preRoundTimeout);
}

// Function to show the round result popup
function showRoundResult() {
    let roundResult;
    if (player01.currentLife > player02.currentLife) {
        player01Wins++;
        roundResult = 'Player 1 wins this round!';
    } else if (player02.currentLife > player01.currentLife) {
        player02Wins++;
        roundResult = 'Player 2 wins this round!';
    } else {
        roundResult = 'This round is a draw!';
    }

    // Update popup content and show
    $roundResultDetails.text(roundResult);
    $roundResult.css('display', 'block').css('opacity', '1');
}
// Method to end the game
function gameEnded() {
    let resultClass = '';
    let resultDetails = '';
    let resultImage = '';
    let resultAudio = '';

    if (isGameEnded) {
        closeEndGame();
        return
    }

    isRoundEnded = true;
    isGameEnded = true;

    if ((player01.currentLife <= minLife || player02.currentLife <= minLife) || currentRound >= maxRounds) {
        if (player01.roundsWon > player02.roundsWon) {
            resultTitle = 'Congratulations! You Win';
            resultClass = 'success';
            resultDetails = `Congratulations ${player01.playerName}! You won a total of ${player01.roundsWon} rounds.\nCurrent Life is ${player01.currentLife}`;
            resultImage = 'path_to_win_image.gif';
            resultAudio = 'path_to_win_audio.mp3';
        } else if (player02.roundsWon > player01.roundsWon) {
            resultTitle = 'Too bad!! You Lose';
            resultClass = 'failure';
            resultDetails = `Hello ${player01.playerName}, you lost. ${player02.playerName} won a total of ${player02.roundsWon} rounds.\nYour Current Life is ${player01.currentLife}`;
            resultImage = 'path_to_lose_image.gif';
            resultAudio = 'path_to_lose_audio.mp3';
        } else {
            resultTitle = 'Awww! It\'s a draw!';
            resultClass = 'draw';
            resultDetails = `Awww! It's a draw! ${player01.playerName}, you won a total of ${player01.roundsWon} rounds.\nCurrent Life is ${player01.currentLife} \n\n$$$$$\n\n${player02.playerName} won a total of ${player02.roundsWon} rounds.\nCurrent Life is ${player02.currentLife}`;
            resultImage = 'path_to_draw_image.gif'; // Path to the draw image
            resultAudio = 'path_to_draw_audio.mp3'; // Path to the draw audio
        }
    } else {
        resultTitle = 'Game is still ongoing';
        resultClass = 'draw';
        resultDetails = `The game is ongoing. ${player01.playerName} won ${player01.roundsWon} rounds and ${player02.playerName} won ${player02.roundsWon} rounds.`;
        resultImage = 'path_to_ongoing_image.gif'; // Path to the ongoing game image
        resultAudio = 'path_to_ongoing_audio.mp3'; // Path to the ongoing game audio
    }

    // Update the content and class of the popup
    $endGameDetails.text(resultDetails).addClass(resultClass);
    $endGameImage.attr('src', resultImage);
    $endGameAudio.attr('src', resultAudio)[0].play();

    // Display the end-game popup
    $endGame.css('display', 'block').css('opacity', '1');

    saveGameState();
    openEndGame();
    disableControls();
    displayGameHistory();
    closeExitGame();
    closeCurrentRound();
    closePreRound();
    closeRoundCountdown();
    closeRoundResult();
    currentRound = 0;
    player01Wins = 0;
    player02Wins = 0;
    isMaxWidth = false;
    isCollision = false;
    gameStarted = false;
    isColision = false;
    isStartGameClicked = false;
    resetGame();
}


function resetGame() {


    // $players.append(player02.$element);

    player01.$element.css({ top: player01.position.top + 'px', left: player01.position.left + 'px' });
    player02.$element.css({ top: player02.position.top + 'px', left: player02.position.left + 'px' });

}

function disableControls() {
    $controls.attr('disabled', true);
    $(document).off('keydown');
    clearInterval(player02IntervalId);
}

function displayGameHistory() {
    $gameHistoryList.empty();

    let gameStates = JSON.parse(localStorage.getItem('gameStates')) || [];

    if (gameStates.length === 0) {
        $gameHistoryList.append(`<li class='no-marker'><p>No games played yet.</p></li>`);
        $deleteButton.hide();
        return;
    }

    gameStates.forEach(game => {
        const listItem = `<li>Game ${game.id} - ${game.timestamp} $$$$$$$ Status: ${game.status} $$$$$$$ Winner: ${game.winner}</li>`;
        $gameHistoryList.append(listItem);
    });

    $deleteGame.show();
}


function enableControls() {

    if (!gameStarted) {
        return
    }

    $controls.attr('disabled', false);

    // Automatically control player02 at intervals
    player02IntervalId = setInterval(player02Controls, player02Interval);
}


function player02Controls() {
    console.log('player02 control');
    // Randomly decide on a move direction for the computer
    const directions = ['left', 'right', 'up', 'down'];
    const attacks = ['punch', 'kick', 'block', 'combo'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const randomAttack = attacks[Math.floor(Math.random() * directions.length)];
    player02.move(randomDirection, player01);
    player02.attack(randomAttack, player01);
}

function getGameHistory() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        return JSON.parse(savedState);
    }
    return null;
}

function stopGame() {
    gameStarted = false;
    disableControls();
}


function hideResumeGamePrompt() {
    document.getElementById('resumeGamePrompt').style.display = 'none';
}

function deleteGameState() {
    localStorage.removeItem('gameState');
}



function checkForUnfinishedGame() {
    let gameStates = JSON.parse(localStorage.getItem('gameStates')) || [];
    const unfinishedGame = gameStates.find(game => game.status === gameInProgress);

    if (unfinishedGame) {
        setTimeout(() => {
            if (!isStartGameClicked) {
                openResumeGame();
            } else {
                console.log('resumeGame popup has been opended already.')
            }
        }, openStartGameTimeout);

    } else {
        setTimeout(() => {
            if (!isStartGameClicked) {
                openStartGame();
            }
            else {
                console.log('startGame popup has been opended already.')
            }
        }, openStartGameTimeout);
    }
}


function continueGame() {
    // $resumeGame.css('display', 'none').css('opacity', '0');

    console.log('in continue game')
    let gameStates = JSON.parse(localStorage.getItem('gameStates')) || [];
    const unfinishedGame = gameStates.find(game => game.isGameInProgress);

    if (unfinishedGame) {
        console.log('in unfinished game')
        player01.position = unfinishedGame.player.position;
        player01.currentLife = unfinishedGame.player.life;
        player01.currentCombo = unfinishedGame.player.combo;

        player02.position = unfinishedGame.computer.position;
        player02.currentLife = unfinishedGame.computer.life;
        player02.currentCombo = unfinishedGame.computer.combo;

        player01.updatePosition(player01.position.left, player01.position.top);
        player02.updatePosition(player02.position.left, player02.position.top);

        currentRound = unfinishedGame.currentRound;
        console.log('Resuming game from saved state:', unfinishedGame);
    }

    console.log('in about to begin game');

    beginGame();
}

function startNewGame() {
    isRoundEnded = false;
    startRound();
    console.log('Starting a new game');
}


function getFormattedTimestamp() {
    const date = new Date();

    // Get day, month, and year
    const day = date.getDate();
    const year = date.getFullYear();

    // Array of month names
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = months[date.getMonth()];

    // Get hours, minutes, and seconds
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Format as "day month year hour:minute:second"
    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}

function handleAttack(attackingPlayer, move, opponent) {
    if (!opponent) {
        console.error("Opponent is undefined or null.");
        return;
    }

    if (attackingPlayer.currentLife <= minLife || opponent.currentLife <= minLife) {
        console.log('Game over or invalid attack.');
        return;
    }

    if (isColliding(attackingPlayer, opponent)) {
        console.log('Attack is effective');
        switch (move) {
            case 'punch':
            case 'kick':
                attackingPlayer.isBlocking = false;
                opponent.currentLife--;
                attackingPlayer.attackValue = singleHit;
                break;
            case 'block':
                attackingPlayer.isBlocking = true;
                if (!opponent.isBlocking) {
                    opponent.currentLife--;
                    attackingPlayer.attackValue = blockHit;
                } else {
                    console.log('Attack has been blocked!!! By: ', opponent.playerName);
                }
                break;
            case 'combo':
                attackingPlayer.isBlocking = false;
                if (attackingPlayer.currentCombo > minCombo) {
                    opponent.currentLife -= 3;
                    attackingPlayer.attackValue = comboHit;
                }
                break;
        }

        let attacker = attackingPlayer === player01 ? player01 : player02;
        if (attacker === player01) {
            $player01Img.css('border', '2px solid green');
            $player02Img.css('border', '2px solid red');
            $player01Hit.text(`x${attacker.attackValue}`).slideToggle(fadeOutInterval);
            $player02Hit.css('display', 'block')
            setTimeout(() => {
                $player01Img.css('border', 'none');
                $player02Img.css('border', 'none');
            }, fadeOutInterval);
        }
        else {
            $player02Img.css('border', '2px solid green');
            $player01Img.css('border', '2px solid red');
            $player02Hit.text(`x${opponent.attackValue}`).slideToggle(fadeOutInterval);
            setTimeout(() => {
                $player02Img.css('border', 'none');
                $player01Img.css('border', 'none');
            }, fadeOutInterval);
        }

        console.log('Opponent\'s life reduced');
        saveGameState();

    } else {
        console.log('Attack is not effective');
    }
    console.log(`${attackingPlayer.$element.attr('id')}\'s current life: ${attackingPlayer.currentLife}`);
    console.log(`${opponent.$element.attr('id')}\'s current life: ${opponent.currentLife}`);
    updatePlayerImage(attackingPlayer.$element.attr('id'), move);
}

function updatePlayerImage(player, move) {
    // Define the image path based on the attack move
    const imagePath = `./resources/gifs/`;
    const img = `${imagePath}${move}.gif`
    console.log(img)
    const $player = $(`#${player}`);
    const $playerImg = $player.find('img');
    console.log($playerImg)
    const $player01 = $('#player01');
    // Update the player's image in the DOM
    $playerImg.attr('src', img); // Assuming the image has an ID of 'playerImage'

    // Remove the image update after 1 second
    setTimeout(function () {
        $playerImg.attr('src', `${imagePath}standing.gif`); // Reset to default image
    }, 1000);
}


function isColliding(player1, player2) {
    const threshold = 10;
    // Get player boundaries
    const player1Left = player1.currentWidthOffset;
    const player1Right = player1Left + player1.width;
    const player1Top = player1.currentHeightOffset;
    const player1Bottom = player1Top + player1.height;

    const player2Left = player2.currentWidthOffset;
    const player2Right = player2Left + player2.width;
    const player2Top = player2.currentHeightOffset;
    const player2Bottom = player2Top + player2.height;

    // Check horizontal and vertical overlap
    const horizontalOverlap = (player1Right > player2Left) && (player1Left < player2Right);
    const verticalOverlap = (player1Bottom > player2Top) && (player1Top < player2Bottom);

    // Determine collision
    const collisionX = horizontalOverlap;

    isColision = collisionX;
    console.log('is colliding: ', collisionX)
    return collisionX;
}

function updatePlayerPosition(player) {
    const containerWidth = $playerArea.width();
    const containerHeight = $playerArea.height();

    let newLeft = Math.max(0, Math.min(containerWidth - player.width, player.currentWidthOffset));
    let newTop = Math.max(0, Math.min(containerHeight - player.height, player.currentHeightOffset));

    player.updatePosition(newLeft, newTop);
    console.log(`${player.getId()} - ${player.playerName}'s position updated: Width: ${newLeft}px, Height: ${newTop}px`);
}
