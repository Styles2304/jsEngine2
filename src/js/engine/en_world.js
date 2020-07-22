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
        this.physics = {
            enabled: false,
            gravity: new Vect(0, 3),
            friction: new Vect(),
            fricStr: 1,
            drag: new Vect(),
            dragStr: 0.00005,
            bounce: .75
        };
    }

    debugDraw() {
        this.ctx.strokeStyle = "rgb(255,0,0)";
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(0, 0, this.width, this.height);
    }

    addEnt(name, x, y, width, height, physics, mass) {
        this.ents[name] = new Ent(this.g, this, x, y, width || 0, height || 0, physics || false, mass || 1);
    }

    enablePhysics() {
        this.physics.enabled = true;

        Object.keys(this.ents).forEach(key => {
            this.ents[key].enablePhysics();
        });
    }
}