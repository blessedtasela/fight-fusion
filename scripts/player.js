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
        this.currentLife = life;
        this.currentCombo = combo;
        this.playerName = name;
        this.isBlocking = false;
        this.blockTimer = null;
        this.evade = null;        // 'jump' dodges kicks, 'crouch' dodges punches and combos
        this.evadeTimer = null;
        this.poseTimer = null;
        this.lastMoveAt = 0;
        this.attackValue = initAttackValue;
        this.roundsWon = initRoundWon;
        this.attackMove = defaultAttack;
        this.defaultLeft = this.position.left;
        this.defaultTop = this.position.top;
    }

    move(direction, opponent) {
        // Nobody moves between rounds, during countdowns or while paused.
        if (!roundActive) return;

        const now = Date.now();
        if (now - this.lastMoveAt < moveThrottle) return; // holding a key or button: steady pace
        this.lastMoveAt = now;
        this.currentDirection = direction;

        if (direction === 'up' || direction === 'down') {
            this.startEvade(direction === 'up' ? 'jump' : 'crouch');
            return;
        }

        const containerWidth = $playerArea.width();
        const step = moveStep * containerWidth;
        let newLeft = this.currentWidthOffset + (direction === 'left' ? -step : step);
        newLeft = Math.max(0, Math.min(containerWidth - this.width, newLeft));

        // Fighters can close in but never walk through each other.
        if (opponent) {
            const minGap = closestDistance(this, opponent);
            if (opponent.currentWidthOffset >= this.currentWidthOffset) {
                newLeft = Math.min(newLeft, opponent.currentWidthOffset - minGap);
            } else {
                newLeft = Math.max(newLeft, opponent.currentWidthOffset + minGap);
            }
        }

        this.updatePosition(newLeft);
    }

    startEvade(kind) {
        if (this.evade) return;
        this.evade = kind;
        this.$element.addClass(kind === 'jump' ? 'is-jumping' : 'is-crouching');
        setPose(this, kind === 'jump' ? 'up' : 'down');
        clearTimeout(this.evadeTimer);
        this.evadeTimer = setTimeout(() => this.clearEvade(), evadeDuration);
    }

    clearEvade() {
        clearTimeout(this.evadeTimer);
        this.evade = null;
        this.$element.removeClass('is-jumping is-crouching');
    }

    updatePosition(left) {
        this.currentWidthOffset = left;
        this.$element.css('left', left + 'px'); // a CSS transition makes the step smooth
        log(`${this.getId()} moved ${this.currentDirection}: ${Math.round(left)}px`);
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
        this.clearEvade();
        setPose(this, 'stand');
    }

    resetPlayerStats() {
        this.resetRoundStats();
        this.roundsWon = initRoundWon;
    }
}
