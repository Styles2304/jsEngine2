"use strict";

let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }
Boot.wind = null;

Boot.init = function() {
    for (var a = 0; a < 10; a++) { // Create 10 basic ents for physics testing
        var _mass = Math.floor(Math.random() * (200-1) + 1);

        var _ent = new Ent(
            this.game,
            this.curWorld,
            Math.floor(Math.random() * this.curWorld.width), 50,
            _mass, // width
            _mass, // height
            _mass);

        _ent.draw = function() {
            this.ctx.fillStyle = "rgba(255,255,0,0.5)";
            this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }
    }

    this.curWorld.enablePhysics();

    this.wind = new Vect(Math.random() * (1+1) - 1, 0);
}

Boot.update = function() {}

Boot.draw = function() {}
