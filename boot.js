"use strict";

let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }
Boot.wind = null;

Boot.init = function() {
    for (var a = 0; a < 10; a++) {
        var _mass = Math.floor(Math.random() * (3-1) + 1);
        this.curWorld.addEnt(
            "cube" + a,
            Math.floor(Math.random() * this.curWorld.width),
            5,
            _mass * 20, _mass * 20);

        var _cube = this.curWorld.ents["cube" + a];

        _cube.physics.collideWithWorld = true;

        _cube.draw = function() {
            this.ctx.fillStyle = "rgba(255,255,0,.5)";
            this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }
    }

    this.curWorld.enablePhysics();

    this.wind = new Vect(Math.random() * (1+1) - 1, 0);
    console.log(this.wind.x);
}

Boot.update = function() {
    for (var a = 0; a < 10; a++) {
        let _cube = this.curWorld.ents["cube" + a];
        _cube.applyForce(this.wind);
    }
}

Boot.draw = function() {}