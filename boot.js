"use strict";

let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }

Boot.init = function() {
    this.curWorld.enablePhysics();
    
    // var _wind = new Vect(5,0);

    var _ents = 1;
    
    for (var a = 0; a < _ents; a++) { // Create 10 basic ents for physics testing
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
            this.ctx.fillRect(this.relativePos.x, this.relativePos.y, this.width, this.height);
        }

        _ent.offset = _ent.center.copy();

        _ent.rotate(45);
    }
}

Boot.update = function() {}

Boot.draw = function() {}
