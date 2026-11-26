// Debug logging: flip to true while developing. Kept off in production so the console stays clean.
const DEBUG = false;
function log(...args) {
    if (DEBUG) console.log(...args);
}

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
        this.blockTimer = null;
        this.attackValue = initAttackValue;
        this.roundsWon = initRoundWon;
        this.attackMove = defaultAttack;
        this.defaultLeft = this.position.left;
        this.defaultTop = this.position.top;
    }

    move(direction, opponent) {
        // Nobody moves between rounds, during countdowns or while a popup is open.
        if (!roundActive) return;

        let newLeft = this.currentWidthOffset;
        let newTop = this.currentHeightOffset;

        const containerWidth = $playerArea.width();
        const moveAmount = 0.05 * containerWidth; // Move by 5% of container width

        this.currentDirection = direction;
        switch (direction) {
            case 'left':
                newLeft = Math.max(0, this.currentWidthOffset - moveAmount);
                break;
            case 'right':
                newLeft = Math.min(containerWidth - this.width, this.currentWidthOffset + moveAmount);
                break;
            // 'up' and 'down' are jump and crouch animations: the fighter stays on the floor.
        }

        this.updatePosition(newLeft, newTop);
        updatePlayerImage(this.getId(), direction);
    }

    updatePosition(left, top) {
        this.currentWidthOffset = left;
        this.currentHeightOffset = top;
        this.moveProperties = { left: left + 'px' };
        this.$element.stop(true).css({ top: top + 'px' }).animate(this.moveProperties, duration, 'linear');
        log(`${this.getId()} moved ${this.currentDirection}: ${left}px, ${top}px`);
    }

    attack(move, opponent) {
        handleAttack(this, move, opponent);
    }

    getId() {
        return this.$element.attr('id');
    }

    updateRoundsWon() {
        this.roundsWon += 1;
    }

    clearBlock() {
        clearTimeout(this.blockTimer);
        this.isBlocking = false;
    }

    resetRoundStats() {
        this.currentLife = maxLife;
        this.currentCombo = maxCombo;
        this.attackMove = defaultAttack;
        this.attackValue = initAttackValue;
        this.clearBlock();
    }

    resetPlayerStats() {
        this.resetRoundStats();
        this.roundsWon = initRoundWon;
    }
}
