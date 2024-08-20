
class Player {
    constructor(elementId, position, controls, name, life = maxLife, combo = maxCombo) {
        this.$element = $(elementId);
        this.position = position;
        this.width = this.$element.outerWidth();
        this.height = this.$element.outerHeight();
        this.currentWidthOffset = this.position.left;
        this.currentHeightOffset = this.position.top;
        this.controls = controls;
        this.currentDirection = null;
        this.moveProperties = {};
        this.currentLife = life;
        this.currentCombo = combo;
        this.playerName = name;
        this.isBlocking = false;
        this.attackValue = initAttackValue;
        this.roundsWon = initRoundWon;
        this.attackMove = defaultAttack;
        this.defaultLeft = this.position.left;
        this.defaultTop = this.position.top;
    }


    move(direction, opponent) {
        let newLeft = this.currentWidthOffset;
        let newTop = this.currentHeightOffset;

        const containerWidth = $playerArea.width();
        const containerHeight = $playerArea.height();
        const moveAmount = 0.05 * containerWidth; // Move by 5% of container width

        switch (direction) {
            case 'up':
                this.currentDirection = direction;
                newTop = Math.max(0, this.currentHeightOffset - moveAmount);
                break;
            case 'down':
                this.currentDirection = direction;
                break;
            case 'left':
                this.currentDirection = direction;
                newLeft = Math.max(0, this.currentWidthOffset - moveAmount);
                break;
            case 'right':
                this.currentDirection = direction;
                newLeft = Math.min(containerWidth - this.width, this.currentWidthOffset + moveAmount);
                break;
        }

        // Update position and apply animation
        this.updatePosition(newLeft, newTop);
        updatePlayerImage(this.$element.attr('id'), direction)
    }

    updatePosition(left, top) {
        this.currentWidthOffset = left;
        this.currentHeightOffset = top;
        this.$element.css({
            left: left + 'px',
            top: top + 'px',
        });

        // Update moveProperties
        this.moveProperties.left = left + 'px';
        this.$element.animate(this.moveProperties, duration, 'linear');

        console.log(`Direction: ${this.currentDirection}`);
        console.log(`Parent width: ${parentWidth}px`);
        console.log(`Current Position: ${this.currentWidthOffset}px, ${this.currentHeightOffset}px`);
        console.log(`Move Properties: ${JSON.stringify(this.moveProperties)}`);
    }


    // Attack the opponent
    attack(move, opponent) {
        console.log('opponent: ', opponent)
        handleAttack(this, move, opponent);
    }

    resetPlayerPosition() {
        this.moveProperties = {
            left: this.defaultLeft + 'px',
            top: this.defaultTop + 'px',
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

    updateLife(newLife) {
        this.currentLife = newLife;
    }

    updateCombo(newCombo) {
        this.currentCombo = newCombo;
    }

    updateRoundsWon() {
        this.roundsWon += 1;
    }

    resetRoundStats() {
        this.currentLife = maxLife;
        this.currentCombo = maxCombo;
        this.attackMove = defaultAttack;
    }

    resetPlayerStats() {
        this.currentLife = maxLife;
        this.currentCombo = maxCombo;
        this.roundsWon = initRoundWon;
        this.attackValue = initAttackValue;
        this.attackMove = defaultAttack;
    }
}
