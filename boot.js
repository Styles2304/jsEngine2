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
        this.physics.advancedCollision = false;
        this.physics.ang = 0;
    }

    _player.draw = function() {
        this.ctx.fillStyle = "#FF0"; // Yellow
        this.ctx.fillRect(this.relativePos.x, this.relativePos.y, this.width, this.height);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#F00"; // Red
        this.ctx.beginPath();
        this.ctx.moveTo(this.pos.x, this.pos.y);
        this.ctx.lineTo(this.pos.x, this.pos.y - 50);
        this.ctx.stroke();
    }

    _player.update = function() {
        if (this.Game.keys.d) { this.physics.ang += 3; }
        if (this.Game.keys.a) { this.physics.ang -= 3; }
        if (this.Game.keys.down) { this.applyForce(new Vector(0, 3)); }
        if (this.Game.keys.up) { this.applyForce(new Vector(0, -3)); }
        if (this.Game.keys.left) { this.applyForce(new Vector(-3, 0)); }
        if (this.Game.keys.right) { this.applyForce(new Vector(3, 0)); }

        if (this.Game.keys.w) { this.applyForce(this.pos.fromAngle(this.Game.radians(this.physics.ang - 90))) }
    }

    this.curWorld.camera.follow = _player;
}

Boot.update = function() {}

Boot.draw = function() {}
