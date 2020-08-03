"use strict";

let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }

Boot.init = function() {
    this.curWorld.setWorld(400, 400);
    this.curWorld.enablePhysics(new Vector(0,0), null, null, 0.75);

    // Player
    var _player = new Entity(
        this.Game,
        this.curWorld,
        this.curWorld.width - 50, this.curWorld.height - 50,
        50,
        50,
        10);

    _player.init = function() {
        this.offset = this.center.copy();
        this.physics.advancedCollision = true;
        this.physics.ang = 0;
        // this.simpleBounding(10, 10, this.width - 20, this.height - 20);
    }

    _player.update = function() {
        if (this.Game.keys.d) { this.physics.ang += 2; }
        if (this.Game.keys.a) { this.physics.ang -= 2; }
        if (this.Game.keys.down) { this.applyForce(new Vector(0, 3)); }
        if (this.Game.keys.up) { this.applyForce(new Vector(0, -3)); }
        if (this.Game.keys.left) { this.applyForce(new Vector(-3, 0)); }
        if (this.Game.keys.right) { this.applyForce(new Vector(3, 0)); }

        if (this.physics.onSurface) { this.physics.vel.y = 0; }
    }

    this.curWorld.camera.follow = _player;
}

Boot.update = function() {}

Boot.draw = function() {}
