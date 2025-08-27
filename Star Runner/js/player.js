// in here writing the class of the player
import { Element } from "./element.js"

export class Player extends Element {
    constructor(x, y, radius, color, speed) {
        super(x, y, radius, color);
        this.speed = speed;
        this.lives = 3;
        this.bullets = [];
        this.bulletColor = "#6eaed3ff";
    }

    move(upPressed, downPressed, leftPressed, rightPressed, canvas) {
        if (upPressed) {
            this.y -= this.speed;
        }
        else if (downPressed) {
            this.y += this.speed;
        }
        else if (leftPressed) {
            this.x -= this.speed;
        }
        else if (rightPressed) {
            this.x += this.speed;
        }

        // to Keep the player inside the canvas
        if (this.x - this.radius < 0) {
            this.x = this.radius;
        }
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
        }
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
        }
    }

    shoot() {
        this.bullets.push({
            x: this.x,
            y: this.y - this.radius,
            speed: 7
        })

    }


    updateBullets(context) {
        this.bullets.forEach((bullet) => {
            bullet.y -= bullet.speed;

            // draw bullet as a line
            context.beginPath();
            context.moveTo(bullet.x, bullet.y);
            context.lineTo(bullet.x, bullet.y - 10);
            context.strokeStyle = this.bulletColor;
            context.lineWidth = 2;
            context.stroke();

        });
    }
}

