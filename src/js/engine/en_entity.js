"use strict";
//=======================================================//
// Entity Class
//=======================================================//

class Ent {
    constructor(game, world, x, y, width, height, physics) {
        this.g = game;
        this.ctx = game.CONTEXT;
        this.pos = new Vect(x, y);
        this.width = width || 0;
        this.height = height || 0;
        this.heatlh = { cur: 100, max: 100 }
        this.center = {
            x: Math.floor(this.width / 2),
            y: Math.floor(this.height / 2)
        }
        this.worldPos = { x: x, y: y }
        this.world = world;
        this.physics = {
            enabled: physics,
            collideWithWorld: false,
            worldBounce: false,
            mass: 1,
            bounding: [
                { x: this.pos.x, y: this.pos.y },
                { x: this.pos.x + this.width, y: this.pos.y },
                { x: this.pos.x + this.width, y: this.pos.y + this.height },
                { x: this.pos.x, y: this.pos.y + this.height }
            ],
            acc: new Vect(),
            vel: new Vect(),
        }
        this.initialized = false;
    }

    classInit() {
    }

    classUpdate() {
    //=======================================================//
    // Physics
    //=======================================================//
        const _p = this.physics;
        _p.bBounce = new Vect(0, 10);
        if (_p.enabled) {

        //=======================================================//
        // Acceleration, Velocity, Position
        //=======================================================//
            _p.vel.add(_p.acc);
            this.pos.add(_p.vel);

        //=======================================================//
        // World Collision
        //=======================================================//
            if (_p.collideWithWorld) {

                // Top Bounds
                if (
                    _p.bounding[0].y <= 0 ||
                    _p.bounding[1].y <= 0 ||
                    _p.bounding[2].y <= 0 ||
                    _p.bounding[3].y <= 0
                ) {
                    this.pos.y = 0.1;
                    _p.vel.y = _p.vel.y * -1;
                }

                // Bottom Bounds
                if (
                    _p.bounding[0].y >= this.world.height ||
                    _p.bounding[1].y >= this.world.height ||
                    _p.bounding[2].y >= this.world.height ||
                    _p.bounding[3].y >= this.world.height
                ) {
                    this.pos.y = this.world.height - (this.height + 0.1);
                    _p.vel.y = _p.vel.y * -1;
                }

                // Left Bounds
                if (
                    _p.bounding[0].x <= 0 ||
                    _p.bounding[1].x <= 0 ||
                    _p.bounding[2].x <= 0 ||
                    _p.bounding[3].x <= 0
                ) {
                    this.pos.x = 0.1;
                    _p.vel.x = _p.vel.x * -1;
                }

                // Right Bounds
                if (
                    _p.bounding[0].x >= this.world.width ||
                    _p.bounding[1].x >= this.world.width ||
                    _p.bounding[2].x >= this.world.width ||
                    _p.bounding[3].x >= this.world.width
                ) {
                    this.pos.x = this.world.width - (this.width +0.1);
                    _p.vel.x = _p.vel.x * -1;
                }
            }

        //=======================================================//
        // Bounding Box Update
        //=======================================================//
            _p.bounding = [
                { x: this.pos.x, y: this.pos.y },
                { x: this.pos.x + this.width, y: this.pos.y },
                { x: this.pos.x + this.width, y: this.pos.y + this.height },
                { x: this.pos.x, y: this.pos.y + this.height }
            ];

            // Resets acceleration
            _p.acc.mult(0);

        }
    }

    debugDraw() {
        if (this.g.debug) {
            this.ctx.strokeStyle = "#F0F";
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.physics.bounding[0].x, this.physics.bounding[0].y);
            this.ctx.lineTo(this.physics.bounding[1].x, this.physics.bounding[1].y);
            this.ctx.lineTo(this.physics.bounding[2].x, this.physics.bounding[2].y);
            this.ctx.lineTo(this.physics.bounding[3].x, this.physics.bounding[3].y);
            this.ctx.lineTo(this.physics.bounding[0].x, this.physics.bounding[0].y);
            this.ctx.stroke();

            // Anchor Point
            this.ctx.fillStyle = "#F0F";
            this.ctx.fillRect(this.pos.x -4, this.pos.y -4, 8, 8);
        }
    }

    applyForce(force) {
        var _f = Vect.div(force, this.physics.mass);
        this.physics.acc.add(_f);
    }

    init() {}
    update() {}
    draw() {}
}
