export class Subject {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

export class ScoreObserver {
    constructor() {
        this.score = 0;
        this.highestScore = parseInt(localStorage.getItem("highestScore")) || 0;
        this.multiplier = 1;
    }

    update(data) {
        if (data.type === "score") {
            this.score += data.value;
            console.log("Score updated:", this.score, "Highest:", this.highestScore);
        } else if (data.type === "multiplier") {
            // handle multiplier notifications from power-ups
            this.multiplier = data.value || 1;
            console.log("Multiplier set to", this.multiplier);
        }
    }

    setMultiplier(value = 1) {
        this.multiplier = value;
    }

    reset() {
        this.score = 0;
        this.multiplier = 1;
    }

    persistIfHigher() {
        if (this.score > this.highestScore) {
            this.highestScore = this.score;
            try { localStorage.setItem("highestScore", String(this.highestScore)); } catch (e) { /* ignore */ }
        }
    }

    getMultiplier() {
        return this.multiplier;
    }

    getHighest() {
        return this.highestScore;
    }
}

export class LevelObserver {
    constructor(levels) {
        this.levels = levels || [];
        this.currentLevelIndex = 0;
        this.score = 0; // track cumulative score for level transitions
        // for the level up screen
        this.lastLevelUpAt = 0;
        this.levelUpDuration = 2000; // ms to show the level-up screen
    }

    update(data) {
        if (data.type === "score") {
            this.score += data.value;
            const nextLevel = this.levels[this.currentLevelIndex];
            if (nextLevel && nextLevel.nextAtScore !== undefined && this.score >= nextLevel.nextAtScore) {
                this.currentLevelIndex = Math.min(this.currentLevelIndex + 1, this.levels.length - 1);
                const lvl = this.levels[this.currentLevelIndex];
                this.lastLevelUpAt = Date.now();
                let msg;
                if (lvl) {
                    msg = lvl.name;
                } else {
                    msg = `Index ${this.currentLevelIndex}`;
                }
                console.log("Level Up:", msg);
            }
        }
    }

    // to indicate if level-up screen is active
    isLevelUpActive() {
        return this.lastLevelUpAt && (Date.now() - this.lastLevelUpAt < this.levelUpDuration);
    }

    // clear level-up state when resetting the game
    clearLevelUp() {
        this.lastLevelUpAt = 0;
    }

    
    getCurrentLevelIndex() {
        return this.currentLevelIndex;
    }

    // reset observer state (used on game restart)
    reset() {
        this.currentLevelIndex = 0;
        this.score = 0;
        this.clearLevelUp();
    }
}