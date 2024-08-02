
class Player {
    constructor(elementId, position, controls, name = defaultName, life = maxLife, combo = maxCombo) {
        this.$element = $(elementId);
        this.position = position;
        this.offset = this.$element.position()
        this.width = this.$element.outerWidth();
        this.height = this.$element.outerHeight();
        this.currentWidthOffset = this.position.left;
        this.currentHeightOffset = this.position.top;
        this.controls = controls;
        this.currentDirection = null;
        this.moveProperties = {};
        this.offset = this.$element.position();
        this.currentLife = life;
        this.currentCombo = combo;
        this.playerName = name;
        this.isBlocking = false;
        this.attackValue = initAttackValue;
        this.roundsWon = initRoundWon;
        this.attackMove = defaultAttack;
    }


    move(direction, opponent) {

        let newLeft = this.currentWidthOffset;
        let newTop = this.currentHeightOffset;


        let playerWidth = this.currentWidthOffset;
        let playerHeight = this.currentHeightOffset;
        let moveProperties = {
            left: this.currentWidthOffset + 'px',
            top: this.currentHeightOffset + 'px',
        };

        switch (direction) {
            case 'up':
                this.currentDirection = direction;
                if (this.currentHeightOffset <= parentHeight + playerHeight) {
                    if (this.currentHeightOffset > -playerHeightOffset) {

                        // Animate up
                        let upPosition = this.currentHeightOffset - playerHeightOffset;
                        let downPosition = upPosition + playerHeightOffset;

                        // Animate up
                        this.$element.animate({ top: upPosition + 'px' }, duration, 'linear', () => {
                            // Move back down
                            this.$element.animate({ top: downPosition + 'px' }, duration, 'linear', () => {
                                console.log('Bounced back to original position');
                            });
                        });

                        // Update the current height offset
                        this.currentHeightOffset = downPosition;
                    }
                }

                break;
            case 'down':
                this.currentDirection = direction;
                console.log('  to change the image here');
                break;

            case 'left':

                this.currentDirection = direction;
                if (this.currentWidthOffset <= parentWidth + playerWidth) {
                    if (this.currentWidthOffset > -playerWidthOffset) {
                        if (this.position.hasOwnProperty('right')) {
                            console.log('has right')
                            playerWidth = this.position.right;
                        }

                        this.currentWidthOffset = Math.min(parentWidth - playerWidth, this.currentWidthOffset - playerWidthOffset);
                    }
                }
                break;
            case 'right':

                this.currentDirection = direction;
                if (this.currentWidthOffset <= parentWidth - playerWidth) {
                    this.currentWidthOffset = Math.min(parentWidth - playerWidth, this.currentWidthOffset + playerWidthOffset);
                }
                break;
        }

        if (isColision) {
            console.log('Collision detected');
            console.log('currentWidth: ', this.currentWidthOffset);
            console.log('newLeft: ', newLeft);

            // Total width occupied by both players
            const totalWidth = this.width + opponent.width;

            // Determine if the movement direction is towards the opponent
            if ((direction === 'left' && this.currentWidthOffset > opponent.currentWidthOffset) ||
                (direction === 'right' && this.currentWidthOffset < opponent.currentWidthOffset)) {

                // Calculate the maximum allowed position to avoid overlap
                let maxPosition;
                if (direction === 'left') {
                    maxPosition = opponent.currentWidthOffset + opponent.width;
                } else if (direction === 'right') {
                    maxPosition = opponent.currentWidthOffset - this.width;
                }

                // Prevent moving forward beyond the maximum allowed position
                if (direction === 'left' && newLeft < maxPosition) {
                    newLeft = maxPosition;
                } else if (direction === 'right' && newLeft > maxPosition) {
                    newLeft = maxPosition;
                }
            }

            // Ensure the new position is within bounds
            newLeft = Math.max(0, Math.min(parentWidth - this.width, newLeft));
            newTop = Math.max(0, Math.min(parentHeight - this.height, newTop));

            // Update position and apply animation
            this.updatePosition(newLeft, newTop);
        }


        updatePlayerImage(this.$element.attr('id'), direction)


        // Update moveProperties
        this.moveProperties.left = this.currentWidthOffset + 'px';
        this.$element.animate(moveProperties, duration, 'linear');

        console.log(`Direction: ${this.currentDirection}`);
        console.log(`Parent width: ${parentWidth}px`);
        console.log(`Current Position: ${this.currentWidthOffset}px, ${this.currentHeightOffset}px`);
        console.log(`Move Properties: ${JSON.stringify(moveProperties)}`);

    }

    updatePosition(left, top) {
        this.currentWidthOffset = left;
        this.currentHeightOffset = top;
        this.$element.css({
            left: left + 'px',
            top: top + 'px',
        });

        this.moveProperties.left = this.currentWidthOffset + 'px';
        this.$element.animate(this.moveProperties, duration, 'linear');
    }

    // Attack the opponent
    attack(move, opponent) {
        console.log('opponent: ', opponent)
        handleAttack(this, move, opponent);
    }

    reset() {
        this.currentWidthOffset = this.position.left || 0;
        this.currentHeightOffset = this.position.top || 0;
        this.moveProperties = {
            left: this.currentWidthOffset + 'px',
            top: this.currentHeightOffset + 'px',
        };

        this.$element.css({
            left: this.moveProperties.left,
            top: this.moveProperties.top,
        });

        this.currentDirection = null;
    }

    getId() {
        return this.$element.attr('id');
    }

}
