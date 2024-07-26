


// The URL of the GIF you want to display
const gifUrl = './resources/gifs/punch.gif';


const $btnUp = $('#btn-up');
const $btnDown = $('#btn-down');
const $btnLeft = $('#btn-left');
const $btnRight = $('#btn-right');
const $player01 = $('#player01');
const $playerArea = $('.player-area');
const $players = $('#players')
let offset = $player01.position();
const player01Width = $player01.outerWidth();
const player01Height = $player01.outerHeight();
const parentWidth = $playerArea.width();
const parentHeight = $playerArea.height();
let moveProperties = {};
let currentWidthOffset = offset.left;
let currentHeightOffset = offset.top;
let isMaxWidth = false;
const playerWidthOffset = 50;
const playerHeightOffset = 100;

let moveplayer01 = true; // Initial direction flag
let currentDirection = 'right'; // Initial direction
const duration = 500; // Duration for each move (0.5s)

// Directions mapping
const directions = {
    up: { property: 'top', value: '-' },
    down: { property: 'top', value: '+' },
    left: { property: 'left', value: '-' },
    right: { property: 'left', value: '+' }
};

// Function to handle movement
function move(direction) {
    let playerWidth = currentWidthOffset;
    let playerHeight = currentHeightOffset;
    moveProperties = {
        left: currentWidthOffset + 'px',
        top: currentHeightOffset + 'px'
    };

    console.log('in move');

    switch (direction) {
        case 'up':
            moveUp();
            break;
        case 'down':
            moveDown();
            break;
        case 'left':
            moveLeft();
            break;
        case 'right':
            moveRight();
            break;
    }

    // Log positions for debugging
    console.log('offset top', moveProperties.top);
    console.log('offset left', moveProperties.left);
    console.log('parent width', parentWidth);
    console.log('player01 width ', player01Width);
    console.log('player width', playerWidth);
    console.log('total width', parentWidth - player01Width);
    console.log('current width offset ', currentWidthOffset);
    console.log('parent height', parentHeight);
    console.log('player01 height ', player01Height);
    console.log('player height', playerHeight);
    console.log('current height offset ', currentHeightOffset);
    console.log('total height', parentHeight - player01Height);
}

function moveUp() {
    console.log('in move up');
    $player01.css('transform', 'scaleX(1)');
    if (currentHeightOffset <= parentHeight + player01Height) {
        if (currentHeightOffset > -playerHeightOffset) {
            // Animate up
            let upPosition = currentHeightOffset - playerHeightOffset;
            let downPosition = upPosition + playerHeightOffset;

            $player01.animate({ top: upPosition + 'px' }, duration, 'linear', function () {
                // Move back down
                $player01.animate({ top: downPosition + 'px' }, duration, 'linear', function () {
                    console.log('Bounced back to original position');
                });
            });

            // Update the current height offset
            currentHeightOffset = downPosition;
        }
    }
}

function moveDown() {
    console.log('in move down');
    // Implement move down logic here

        console.log('To change the image here');
    
}

function moveLeft() {
    console.log('in move left');
    $player01.css('transform', 'scaleX(1)');
    if (currentWidthOffset <= parentWidth + player01Width) {
        if (currentWidthOffset > -playerWidthOffset) {
            currentWidthOffset = Math.min(parentWidth - player01Width, currentWidthOffset - playerWidthOffset);
        }
    }
    if (currentWidthOffset >= playerWidth) {
        // Implement further logic here if necessary
    } else {
        console.log('parent max width reached');
    }
}

function moveRight() {
    console.log('in move right');
    $player01.css('transform', 'scaleX(-1)');
    if (currentWidthOffset <= parentWidth - player01Width) {
        currentWidthOffset = Math.min(parentWidth - player01Width, currentWidthOffset + playerWidthOffset);
    }
    if (currentWidthOffset <= playerWidth) {
        // Implement further logic here if necessary
    } else {
        console.log('parent max width reached');
    }
}


// Buttons for control
$btnUp.click(function () {
    move('up');
});
$btnDown.click(function () {
    move('down');
});
$btnLeft.click(function () {
    move('left');
});
$btnRight.click(function () {
    move('right');
});

// Event listeners for keyboard arrow keys
$(document).keydown(function (e) {
    switch (e.which) {
        case 37: // Left arrow key
            move('left');
            break;
        case 38: // Up arrow key
            move('up');
            break;
        case 39: // Right arrow key
            move('right');
            break;
        case 40: // Down arrow key
            move('down');
            break;
    }
});

// // Event listeners for touch events
// $(document).on('touchstart', function (e) {
//     const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
//     const x = touch.clientX;
//     const y = touch.clientY;

//     // Assuming you have a way to determine the region of the touch
//     // For example, you can use touch areas to determine which direction to move
//     if (x < $(window).width() / 2 && y < $(window).height() / 2) {
//         move('up');
//     } else if (x < $(window).width() / 2 && y > $(window).height() / 2) {
//         move('down');
//     } else if (x > $(window).width() / 2 && y < $(window).height() / 2) {
//         move('left');
//     } else if (x > $(window).width() / 2 && y > $(window).height() / 2) {
//         move('right');
//     }
// });
