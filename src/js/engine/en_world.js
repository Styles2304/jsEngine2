"use strict";
//=======================================================//
// World Class
//=======================================================//

class World {
    constructor(game, width, height) {
        this.g = game;
        this.ctx = game.CONTEXT;
        this.width = width;
        this.height = height;
        this.cells = [];
        this.ents = {};
        this.collision = Array(
            new Vect(0, 0),
            new Vect(this.width, 0),
            new Vect(this.width, this.height),
            new Vect(0, this.height)
        );
    }

    debugDraw() {
        this.ctx.strokeStyle = "rgb(255,0,0)";
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(0, 0, this.width, this.height);
    }

    addEnt(name, x, y, width, height, physics) {
        this.ents[name] = new Ent(this.g, this, x, y, width || 0, height || 0, physics || false);
    }
}