/* 
   These functions manage the opening and closing of various game popups, such as start, resume, exit, and end game popups, 
   as well as controlling the UI state, including enabling or disabling gameplay elements and updating the interface accordingly.
*/

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
    console.log('openEndGame popups have been opened.');
    $endGame.css('display', 'block').css('opacity', '1');
    $exit.addClass('hide');
    $play.removeClass('hide');
    $main.addClass('overlay disabled');
    $gameData.addClass('disabled');
}

function closeEndGame() {
    console.log('closeEndGame popups have been close.');
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
    $countDown.css('display', 'block').css('opacity', '1');
}

function closeRoundCountdown() {
    console.log('closeRoundCountdown popups have been closed.');
    $countDown.css('display', 'none').css('opacity', '0');
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
    isGameEnded = false;
    $startGame.css('display', 'none').css('opacity', '0');
    $resumeGame.css('display', 'none').css('opacity', '0');
    $endGame.css('display', 'none').css('opacity', '0');
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
    $exit.removeClass('hide');
    $play.addClass('hide');
    startRound();
}

function closeAllPopupsExceptRoundResult() {
    console.log('Closing all closeAllPopupsExceptRoundResult.');

    // Close each popup
    $exitGame.css('display', 'none').css('opacity', '0');
    $resumeGame.css('display', 'none').css('opacity', '0');
    $startGame.css('display', 'none').css('opacity', '0');
    $endGame.css('display', 'none').css('opacity', '0');
    $countDown.css('display', 'none').css('opacity', '0');
    $currentRound.css('display', 'none').css('opacity', '0');
    $preRound.css('display', 'none').css('opacity', '0');
    $deleteAllGames.css('display', 'none').css('opacity', '0');


    // Restore main and gameData classes
    $main.removeClass('overlay disabled');
    $gameData.removeClass('disabled');
}


// Function to determine the game status
function determineGameStatus() {
    if (currentRound < maxRounds) {
        return gameInProgress;
    } else {
        return gameFinished;
    }
}

function determineGameWinner() {
    if (player01.roundsWon >= minRoundsToWIn) {
        return player01.playerName;
    } else if (player02.roundsWon >= minRoundsToWIn) {
        return player02.playerName;
    } else if (currentRound >= maxRounds && player01.roundsWon !== player02.roundsWon) {
        return player01.roundsWon > player02.roundsWon ? player01.playerName : player02.playerName;
    } else {
        return player02.playerName;
    }
}

function startRound() {

    closeRoundResult();
    if (((player01.roundsWon >= minRoundsToWIn || player02.roundsWon >= minRoundsToWIn) && currentRound >= initMaxRound) || (player01.roundsWon + player02.roundsWon === initMaxRound && currentRound === maxRounds)) {
        endGame();
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

    isGameEnded = false;
    closeRoundResult();
    startGameAudio();
    let countdown = preRoundCount;
    displayCurrentRoundInfo();

    setTimeout(() => {
        displayPreRoundInfo(countdown);
    }, currentRoundTimeout);

}

// function to display the current round that is about to start and proceed to begin round
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
        if (!isRoundEnded) {
            closePreRound();
        }
    }, preRoundTimeout);
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

    disableControls();
    countPlayerWin();
    saveGameState();
    if ((player01.roundsWon >= minRoundsToWIn || player02.roundsWon >= minRoundsToWIn) && currentRound >= initMaxRound) {
        endGame();
        console.log('first condition GameEnded')
    } else if (currentRound >= maxRounds) {
        endGame();
        console.log('second condition GameEnded')
    } else {
        showRoundResult();
        closeAllPopupsExceptRoundResult();
        console.log('third condition showRoundResult')
    }

}

function displayRoundCountdown(countdown) {
    $roundCountDown.text("START!!!");
    $roundStartAudio.attr({
        'src': `${audioPath}start.mp3`,
        'alt': `${audioPath}start.mp3`,
        'autoplay': true
    });
    openRoundCountdown();
    roundIntervalId = setInterval(() => {
        countdown--;
        console.log(`Round time remaining: ${countdown}`);
        $roundCountDown.text(countdown);
        if (countdown <= countdownEnd || isRoundOver()) {
            clearInterval(roundIntervalId);
            endRound();
        }
    }, roundInterval);
}


function displayCurrentRoundInfo() {
    $currentRoundData.text(`Round ${currentRound}`);
    openCurrentRound();

    setTimeout(() => {
        closeCurrentRound();
    }, currentRoundTimeout);
}


function updatePlayerLife(player) {
    const $playerLife = $(`#${player.getId()}-life`);
    let lifeValue = (player.currentLife / maxLife) * 100;
    let currentLife = player.currentLife;
    let lifeColor = 'green';

    if (currentLife <= dangerLife) {
        lifeColor = 'red';
    } else if (currentLife <= warningLife) {
        lifeColor = 'yellow';
    }

    $playerLife.css({
        'width': `${lifeValue}%`,
        'background-color': lifeColor
    });
}

function updatePlayersLife() {
    updatePlayerLife(player01);
    updatePlayerLife(player02);
}

// Function to show the round result popup
function showRoundResult() {
    let roundResult;
    let roundResultImage;
    let roundResultAudio;
    if (player01.currentLife > player02.currentLife) {
        roundResult = `${player01.playerName} ${roundWin}`;
        roundResultImage = `${gifPath}round-win.gif`;
        roundResultAudio = `${audioPath}round-win.mp3`;
    } else if (player02.currentLife > player01.currentLife) {
        roundResult = `${player02.playerName} ${roundWin}`;
        roundResultImage = `${gifPath}round-lose.gif`;
        roundResultAudio = `${audioPath}round-lose.mp3`;
    } else {
        roundResult = `${roundDraw}`;
        roundResultImage = `${gifPath}round-draw.gif`;
        roundResultAudio = `${audioPath}round-draw.mp3`;
    }


    // Update popup content and show
    $roundResultDetails.text(roundResult);
    $roundResultImage.attr('src',);
    $roundResultImage.attr('alt', roundResultImage);
    $roundResultAudio.attr({
        'src': `${roundResultAudio}`,
        'alt': `${roundResultAudio}`,
        'autoplay': true
    });
    $roundResultImage.attr({
        'src': `${roundResultImage}`,
        'alt': `${roundResultImage}`,
    });
    $roundResult.css('display', 'block').css('opacity', '1');

    clearInterval(roundIntervalId);
    player01.resetRoundStats();
    player02.resetRoundStats();
    updatePlayersPosition();
    updatePlayersLife();
}

function countPlayerWin() {
    if (player01.currentLife > player02.currentLife) {
        player01.updateRoundsWon();
    } else if (player02.currentLife > player01.currentLife) {
        player02.updateRoundsWon();
    }
}

// Method to end the game
function endGame() {
    let resultClass = '';
    let resultDetails = '';
    let resultImage = '';
    let resultAudio = '';
    stopGameAudio();

    if (isGameEnded) {
        closeEndGame();
        console.log('game is ended, return is true.');
        return;
    }

    isRoundEnded = true;
    isGameEnded = true;

    if ((player01.currentLife <= minLife || player02.currentLife <= minLife) || currentRound >= maxRounds) {
        if (player01.roundsWon > player02.roundsWon) {
            resultTitle = 'Congratulations! You Win';
            resultClass = 'success';
            resultDetails = `Congratulations ${player01.playerName}! You won a total of ${player01.roundsWon} rounds.\nCurrent Life is ${player01.currentLife}`;
            resultImage = `${gifPath}${resultClass}.gif`;
            resultAudio = `${audioPath}${resultClass}.mp3`;
        } else if (player02.roundsWon > player01.roundsWon) {
            resultTitle = 'Too bad!! You Lose';
            resultClass = 'failure';
            resultDetails = `Hello ${player01.playerName}, you lost. ${player02.playerName} won a total of ${player02.roundsWon} rounds.\nYour Current Life is ${player01.currentLife}`;
            resultImage = `${gifPath}${resultClass}.gif`;
            resultAudio = `${audioPath}${resultClass}.mp3`;
        } else {
            resultTitle = 'Awww! It\'s a draw!';
            resultClass = 'draw';
            resultDetails = `Awww! It's a draw! ${player01.playerName}, you won a total of ${player01.roundsWon} rounds.\nCurrent Life is ${player01.currentLife} \n\n$$$$$\n\n${player02.playerName} won a total of ${player02.roundsWon} rounds.\nCurrent Life is ${player02.currentLife}`;
            resultImage = `${gifPath}${resultClass}.gif`;
            resultAudio = `${audioPath}${resultClass}.mp3`;
        }
    } else {
        resultTitle = 'Game is still ongoing';
        resultClass = 'draw';
        resultDetails = `The game is ongoing. ${player01.playerName} won ${player01.roundsWon} rounds and ${player02.playerName} won ${player02.roundsWon} rounds.`;
        resultImage = `${gifPath}${resultClass}.gif`;
        resultAudio = `${audioPath}${resultClass}.mp3`;
    }

    // Update the content and class of the popup
    $endGameDetails.text(resultDetails).addClass(resultClass);
    $endGameImage.attr({
        'src': `${resultImage}`,
        'alt': `${resultImage}`,
    })
    $endGameAudio.attr({
        'src': `${resultAudio}`,
        'alt': `${resultAudio}`,
        'autoplay': true
    })
    $endGame.css('display', 'block').css('opacity', '1');
    $countDown.css('display', 'none').css('opacity', '0');

    clearInterval(roundIntervalId);
    closeRoundResult();
    closePreRound();
    disableControls();
    displayGameHistory();
    closeExitGame();
    closeCurrentRound();
    closePreRound();
    currentRound = 0;
    player01.roundsWon = 0;
    player02.roundsWon = 0;
    isMaxWidth = false;
    isCollision = false;
    gameStarted = false;
    isColision = false;
    isStartGameClicked = false;
    player01.resetPlayerStats();
    player02.resetPlayerStats();
    updatePlayersLife();
    updatePlayersPosition();
}


function resetGame() {

    player01 = player01;
    player02 = player02;

    player01.$element.css({ top: player01.position.top + 'px', left: player01.position.left + 'px' });
    player02.$element.css({ top: player02.position.top + 'px', left: player02.position.left + 'px' });

}

function disableControls() {
    $controls.attr('disabled', true);
    $(document).off('keydown');
    clearInterval(player02IntervalId);
}


function enableControls() {

    if (!gameStarted) {
        return
    }

    $controls.attr('disabled', false);
    // $(document).on('keydown');
    player02IntervalId = setInterval(player02Controls, player02Interval);

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
}


function player02Controls() {
    console.log('player02 control');
    // Randomly decide on a move direction for the computer
    const directions = ['left', 'right', 'up', 'down'];
    const attacks = ['punch', 'kick', 'block', 'combo'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const randomAttack = attacks[Math.floor(Math.random() * attacks.length)];
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
        endRound();
        console.error("Opponent is undefined or null.");
        return;
    }

    if (attackingPlayer.currentLife <= minLife || opponent.currentLife <= minLife) {
        console.log('Game over or invalid attack.');
        endRound();
        return;
    }

    if (isColliding(attackingPlayer, opponent)) {
        console.log('Attack is effective');
        updatePlayersLife();
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
                    attackingPlayer.currentCombo--;
                    opponent.currentLife -= comboHit;
                    attackingPlayer.attackValue = comboHit;
                } else {
                    attackingPlayer.attackValue = minCombo;
                }
                console.log(attackingPlayer.getId(), ' combo: ', attackingPlayer.currentCombo);
                break;
        }


        let attacker = attackingPlayer === player01 ? player01 : player02;
        if (attacker === player01) {
            $player01Audio.attr({
                'src': `${audioPath}${move}.mp3`,
                'alt': `${audioPath}${move}.mp3`,
                'autoplay': true
            });

            $player01Name.addClass('attacker');
            $player02Name.addClass('attacked');
            $player01Hit.text(`x${attacker.attackValue}`);
            $player02Hit.css('display', 'block')
            setTimeout(() => {
                $player01Name.removeClass('attacker');
                $player02Name.removeClass('attacked');
                $player01Hit.fadeOut();
            }, fadeOutInterval);
        }
        else {
            $player02Audio.attr({
                'src': `${audioPath}${move}.mp3`,
                'alt': `${audioPath}${move}.mp3`,
                'autoplay': true
            });

            $player02Name.addClass('attacker');
            $player01Name.addClass('attacked');
            $player02Hit.text(`x${opponent.attackValue}`);
            setTimeout(() => {
                $player02Name.removeClass('attacker');
                $player01Name.removeClass('attacked');
                $player02Hit.fadeOut();
            }, fadeOutInterval);
        }

        console.log('Opponent\'s life reduced');

    } else {
        console.log('Attack is not effective');
    }
    console.log(`${attackingPlayer.getId()}\'s current life: ${attackingPlayer.currentLife}`);
    console.log(`${opponent.getId()}\'s current life: ${opponent.currentLife}`);
    updatePlayerImage(attackingPlayer.getId(), move);
}

function updatePlayerImage(player, move) {
    // Define the image path based on the attack move

    const img = `${gifPath}${move}.gif`
    console.log(img)
    const $player = $(`#${player}`);
    const $playerImg = $player.find('img');
    console.log($playerImg)
    const $player01 = $('#player01');
    // Update the player's image in the DOM
    $playerImg.attr('src', img); // Assuming the image has an ID of 'playerImage'

    // Remove the image update after 1 second
    setTimeout(function () {
        $playerImg.attr('src', `${gifPath}standing.gif`); // Reset to default image
    }, 1000);
}

function startGameAudio() {
    $gameAudio.attr({
        'src': `${audioPath}game-play.mp3`,
        'alt': `${audioPath}game-play.mp3`,
        'autoplay': 'autoplay',
        'loop': 'loop'
    });
}

function stopGameAudio() {
    $gameAudio[0].pause();
    $gameAudio[0].currentTime = 0;
}

function isColliding(player1, player2) {
    const threshold = 0;
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
    const collisionX = horizontalOverlap + threshold;

    isColision = collisionX;
    console.log('is colliding: ', collisionX)
    return collisionX;
}

function updatePlayerPosition() {
    const containerWidth = $playerArea.width();
    const containerHeight = $playerArea.height();

    // Recalculate offsets based on container size
    player01.currentWidthOffset = player01.defaultLeft;
    player01.currentHeightOffset = containerHeight * (player01.currentHeightOffset / player01.height);

    // Calculate new position based on updated offsets
    let newLeft = Math.max(0, Math.min(containerWidth - player01.width, player01.currentWidthOffset));
    let newTop = Math.max(0, Math.min(containerHeight - player01.height, player01.currentHeightOffset));

    player01.updatePosition(newLeft, newTop);
    console.log(`${player01.getId()} - ${player01.playerName}'s position updated: Width: ${newLeft}px, Height: ${newTop}px`);
}

function updateComputerPosition() {
    const containerWidth = $playerArea.width();
    const containerHeight = $playerArea.height();

    // Recalculate offsets based on container size
    player02.currentWidthOffset = containerWidth * (player02.currentWidthOffset / player02.width);
    player02.currentHeightOffset = containerHeight * (player02.currentHeightOffset / player02.height);

    // Calculate new position based on updated offsets
    let newLeft = Math.max(0, Math.min(containerWidth - player02.width, player02.currentWidthOffset));
    let newTop = Math.max(0, Math.min(containerHeight - player02.height, player02.currentHeightOffset));

    player02.updatePosition(newLeft, newTop);
    console.log(`${player02.getId()} - ${player02.playerName}'s position updated: Width: ${newLeft}px, Height: ${newTop}px`);
}

function updatePlayersPosition() {
    updatePlayerPosition();
    updateComputerPosition();
}

function continueGame() {

    console.log('in continue game')
    let gameStates = JSON.parse(localStorage.getItem('gameStates')) || [];
    const unfinishedGame = gameStates.find(game => game.status === gameInProgress);

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

function saveGameState() {
    let gameStates = JSON.parse(localStorage.getItem('gameStates')) || [];
    let gameStatus = determineGameStatus();
    let winner = determineGameWinner();

    // Create the game state object
    const gameState = {
        id: gameStates.length + 1,
        timestamp: getFormattedTimestamp(),
        player: {
            position: player01.position,
            life: player01.currentLife,
            combo: player01.currentCombo,
            roundsWon: player01.roundsWon,
        },
        computer: {
            position: player02.position,
            life: player02.currentLife,
            combo: player02.currentCombo,
            roundsWon: player02.roundsWon,
        },
        status: gameStatus,
        currentRound: currentRound,
        maxRounds: maxRounds,
        winner: winner,
        totalRoundWon: winner === player01.playerName ? player01.roundsWon : player02.roundsWon,
    };

    // Remove any existing game with status 'gameInProgress'
    gameStates = gameStates.filter(game => game.status !== gameInProgress);

    // Add the new or updated game state
    gameStates.push(gameState);

    // Save the updated game states
    localStorage.setItem('gameStates', JSON.stringify(gameStates));
    displayGameHistory();
}

function displayGameHistory() {
    $gameHistoryList.empty();

    let gameStates = JSON.parse(localStorage.getItem('gameStates')) || [];

    if (gameStates.length === 0) {
        $gameHistoryList.append(`<li class='no-marker'><p>No games played yet.</p></li>`);
        $deleteGame.hide();
        return;
    }

    // Create table structure
    let table = `<table>
    <thead>
        <tr>
            <th>SN</th>
            <th>Date</th>
            <th>Status</th>
            <th>Winner</th>
            <th>Current Round</th>
            <th>Player Details</th>
            <th>Computer Details</th>
        </tr>
    </thead>
    <tbody>`;

    gameStates.forEach((game, index) => {
        table += `<tr>
    <td data-label="SN">${index++}</td>
    <td data-label="Date">${game.timestamp}</td>
    <td data-label="Status">${game.status}</td>
    <td data-label="Winner">${game.winner}</td>
    <td data-label="Current Round">${game.currentRound}</td>
    <td data-label="Player Details">
        <ul>
           <li>Position: Left: ${game.player.position.left}px. Top: ${game.player.position.top}px</li>
            <li>Life: ${game.player.life}</li>
            <li>Combo: ${game.player.combo}</li>
            <li>Rounds Won: ${game.player.roundsWon}</li>
        </ul>
    </td>
    <td data-label="Computer Details">
        <ul>
            <li>Position: Left: ${game.computer.position.left}px. Top: ${game.computer.position.top}px</li>
            <li>Life: ${game.computer.life}</li>
            <li>Combo: ${game.computer.combo}</li>
            <li>Rounds Won: ${game.computer.roundsWon}</li>
        </ul>
    </td>
  </tr>`;
    });

    table += `</tbody></table>`;

    $gameHistoryList.append(table);
    $deleteGame.show();
}

function setGameInstructions() {
    const instructions = `
        <ul>
            <li>The game lasts for ${roundDuration} seconds each round.</li>
            <li>To win, ${playerName} must win more than ${minRoundsToWIn} rounds.</li>
            <li>If there is a draw in the first ${maxRounds} rounds, extra rounds will be added until ${playerName} or opponent: ${computerName} wins.</li>
            <li>${playerName} is competing against opponent: ${computerName}.</li>
            <li>To win a round, ${playerName} must have more life points before the time elapses or defeat opponent: ${computerName}.</li>
            <li>${playerName} can view the Game History below.</li>
             <li>You can change ${playerName} name in the Game History below.</li>
        </ul>
    `;

    $gameInstructions.html(instructions);
}

function updatePlayerName() {
    $updatePlayerName.on('input', function () {
        playerName = $(this).val();
        player01.playerName = playerName;
        console.log(`Player name updated to: ${player01.playerName} and ${playerName}`);
        setGameInstructions();
        displayPlayersName();
    });

}

function displayPlayersName() {
    $player01Name.text(player01.playerName);
    $player02Name.text(player02.playerName);
}
