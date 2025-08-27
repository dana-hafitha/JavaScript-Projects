// in here we define the class of the enemy


import { Element } from "./element.js"

export class Enemy extends Element{
    constructor(x, y, radius, color, velocity){
        super(x, y, radius, color);
        this.velocity = velocity;
    }

    update() {
        this.y += this.velocity; 
    }

}

