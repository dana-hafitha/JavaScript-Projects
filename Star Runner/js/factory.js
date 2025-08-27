// factory.js
import { Enemy } from "./enemy.js";
import { PowerUp } from "./powerups.js";

export class EntityFactory {
    static createEntity(type, options) {
        switch (type) {
            case "enemy":
                return new Enemy(options.x, options.y, options.radius, options.color, options.velocity);
            case "powerup":
                return new PowerUp(options.x, options.y, options.radius, options.color, options.effect);
            default:
                throw new Error("Unknown entity type: " + type);
        }
    }
}
