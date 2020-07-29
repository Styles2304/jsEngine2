"use strict";

let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }

Boot.init = function() {
    this.curWorld.setWorld(2000, 400);
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

    _player.update = function() {
        if (this.Game.keys.left) { this.pos.x -= 10; }
        if (this.Game.keys.right) { this.pos.x += 10; }
        if (this.Game.keys.space) { this.assignCell(); }
    }

    var _testEnt = new Entity(
        this.Game,
        this.curWorld,
        100, 50,
        50, 50, 10
    );

    _testEnt.render = false;
}

Boot.update = function() {}

Boot.draw = function() {}
