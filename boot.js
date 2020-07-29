"use strict";

let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }

Boot.init = function() {
    this.curWorld.enablePhysics();

    var _player = new Entity(
        this.Game,
        this.curWorld,
        this.curWorld.width / 2, 50,
        50,
        50,
        10);

    this.curWorld.camera.follow = _player;

    _player.init = function() {
        this.offset = _player.center.copy();
    }
    _player.update = function() {}
}

Boot.update = function() {}

Boot.draw = function() {}
