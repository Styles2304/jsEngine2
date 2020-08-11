"use strict";

let Play = Game.states.Play;

Play.start = function() { if (Game.debug) { console.log("Play State"); } }

Play.init = function() {
// World stuff
    this.curWorld.addMap("tileSheet", 16, 16, [
        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,1,2,1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1
    ]);
    this.curWorld.setWorld(400, 400);
    this.curWorld.enablePhysics(new Vector(0,3), null, null, 0.1);
    
// Player
    var _player = new Entity(
        Game,
        this.curWorld,
        20, 0,
        20,
        25,
        1);

    _player.init = function() {
        this.offset = this.center.copy();
        this.physics.advancedCollision = false;
        this.physics.ang = 0;
        this.horzDirection = 1;
        this.running = false;

        this.setSpriteSheet("spriteSheet");
        this.addAnimation("idle_r", 3, false, [
            [3, 4, 19, 24, 0, .97],
            [25, 4, 19, 24, .98, 1]
        ]);
        this.addAnimation("idle_l", 3, true, [
            [3, 4, 19, 24, 0, .97],
            [25, 4, 19, 24, .98, 1]
        ]);
        this.addAnimation("stand_shoot_r", .5, false, [
            [47, 4, 30, 24, 0, 1]
        ]);
        this.addAnimation("stand_shoot_l", .5, true, [
            [47, 4, 30, 24, 0, 1]
        ]);
        this.addAnimation("run_r", .6, false, [
            [52, 30, 15, 24, 0, .24],
            [25, 32, 24, 22, .25, .49],
            [52, 30, 15, 24, .5, .74],
            [70, 32, 20, 22, .75, 1]
        ]);
        this.addAnimation("run_l", .6, true, [
            [52, 30, 15, 24, 0, .24],
            [25, 32, 24, 22, .25, .49],
            [52, 30, 15, 24, .5, .74],
            [70, 32, 20, 22, .75, 1]
        ]);
        this.addAnimation("fall_r", 1, false, [
            [3, 57, 26, 30, 0, 1]
        ]);
        this.addAnimation("fall_l", 1, true, [
            [3, 57, 26, 30, 0, 1]
        ]);

        this.animation = "idle_r";
    }

    _player.update = function() {
        if (this.horzDirection == 1) {
            this.animation = "idle_r";
        } else {
            this.animation = "idle_l";
        }

        if (Game.keys.d) {
            this.pos.x += 4;
            this.horzDirection = 1;
            this.animation = "run_r";
        }

        if (Game.keys.a) {
            this.pos.x -= 4;
            this.horzDirection = 0;
            this.animation = "run_l";
        }

        if (this.Game.keys.a || this.Game.keys.d) { this.running = true; } else { this.running = false; }

        if (Game.keys.enter) {
            if (this.horzDirection == 1) {
                if (!this.running) { this.animation = "stand_shoot_r"; }
            } else {
                if (!this.running) { this.animation = "stand_shoot_l"; }
            }
        }

        if (!this.physics.onSurface) {
            if (this.horzDirection == 1) {
                this.animation = "fall_r";
            } else {
                this.animation = "fall_l";
            }
        }

        if (Game.keys.space && this.physics.onSurface) {
            this.applyForce(new Vector(0, -25));
        }
    }
    
    _player.draw = function() {
        this.animations[this.animation].play();
    }
}

Play.update = function() {}

Play.draw = function() {}