// powerup.js
// ...
import { Element } from "./element.js";

export class PowerUp extends Element {
    constructor(x, y, radius, color, type, duration = 5000) {
        super(x, y, radius, color); // call the parent constructor (Element)
        this.type = type;          //"doubleScore", "extraLife"
        this.duration = duration;  
        this.active = false;       // effect is active or not
        this.velocity = 2;         
    }

    move() {
        this.y += this.velocity; 
    }



    applyEffect(player, scoreSubject) {
        if (this.type === "doubleScore") {
            this.active = true;

            scoreSubject.observers[0].setMultiplier(2);
            scoreSubject.notify({ type: "multiplier", value: 2 });
            

            // save & change bullet color while power-up active
            player.bulletColor = "yellow";

            // track timeout so we can clear it if game restarts
            player.powerupTimeouts = [];
            const timeoutId = setTimeout(() => {
                this.active = false;
                scoreSubject.observers[0].setMultiplier(1);

                // restore previous bullet color
                player.bulletColor = "#6eaed3ff";

                // remove this timeout id from tracking array
                const idx = player.powerupTimeouts.indexOf(timeoutId);

                if (idx !== -1) {
                    player.powerupTimeouts.splice(idx, 1);
                }

            }, this.duration);

            player.powerupTimeouts.push(timeoutId);
        }

        if (this.type === "extraLife") {
            player.lives += 1; 
        }
    }
}
