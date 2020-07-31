"use strict";

let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }

Boot.init = function() {
    this.curWorld.setWorld(2000, 400);
    this.curWorld.enablePhysics();

    // Player
    var _player = new Entity(
        this.Game,
        this.curWorld,
        this.curWorld.width / 2, 50,
        50,
        50,
        10);

    _player.init = function() {
        this.offset = _player.center.copy();
    }

    _player.update = function() {
        if (this.Game.keys.left) { this.pos.x -= 10; }
        if (this.Game.keys.right) { this.pos.x += 10; }

    // Relative Position Update to fix above - won't be a problem with applyForce()
        this.relativePos = Vector.sub(this.pos, this.offset);
    }

    this.curWorld.camera.follow = _player;


    // Test Entity
    var _testEnt = new Entity(
        this.Game,
        this.curWorld,
        10, 50,
        50, 50, 10
    );

    // _testEnt.update = function() {
    //     this.pos.x += 5;
    //     this.relativePos = Vector.sub(this.pos, this.offset);
    // }

    _testEnt.draw = function() {
        // console.log("drawing");
    }
}

Boot.update = function() {}

Boot.draw = function() {}
