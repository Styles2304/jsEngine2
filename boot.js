"use strict";

let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }


Boot.init = function() {
    this.curWorld.addEnt("cube", 10, 150, 50, 50, true);

    var _cube = this.curWorld.ents.cube;
    _cube.speed = 5;
    _cube.anchor = _cube.center;
    _cube.physics.collideWithWorld = true;
    _cube.draw = function() {
        this.ctx.fillStyle = "#FF0";
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}

Boot.update = function() {
    let _cube = this.curWorld.ents.cube;

    var _grav = new Vect(0, 0.5);
    var _wind = new Vect(0.03, 0);

    _cube.applyForce(_grav);
    _cube.applyForce(_wind);

    _cube.physics.vel.limit(10);
    // console.log(_cube.physics.vel);
}

Boot.draw = function() {}