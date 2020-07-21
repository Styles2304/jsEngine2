"use strict";

let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }

Boot.init = function() {
    for (var a = 0; a < 5; a++) {
        var _mass = Math.random() * 2;
        this.curWorld.addEnt(
            "cube" + a,
            Math.floor(Math.random() * this.curWorld.width),
            this.curWorld.height/3,
            _mass * 20, _mass * 20,
            true,
            _mass
        );

        var _cube = this.curWorld.ents["cube" + a];

        _cube.physics.collideWithWorld = true;

        _cube.draw = function() {
            this.ctx.fillStyle = "#FF0";
            this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }
    }

}

Boot.update = function() {
    var _gravity = new Vect(0,0.3);
    var _wind = new Vect(-0.3, 0);

    for (var a = 0; a < 5; a++) {
        let _cube = this.curWorld.ents["cube" + a];
        _cube.applyForce(Vect.mult(_gravity, _cube.physics.mass));
        _cube.applyForce(_wind);

        var _fric = _cube.physics.vel.copy();
        _fric.setMag(-0.1);

        // _cube.applyForce(_fric);
    }
}

Boot.draw = function() {}