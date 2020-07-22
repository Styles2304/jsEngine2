"use strict";
//=======================================================//
// Entity Class
//=======================================================//

class Ent {
    constructor(game, world, x, y, width, height, physics, mass) {
        this.g = game;
        this.ctx = game.CONTEXT;
        this.pos = new Vect(x, y);
        this.width = width || 0;
        this.height = height || 0;
        this.health = { cur: 100, max: 100 }
        this.center = {
            x: Math.floor(this.width / 2),
            y: Math.floor(this.height / 2)
        }
        this.worldPos = { x: x, y: y }
        this.world = world;
        this.physics = {
            enabled: physics,
            collideWithWorld: true,
            onSurface: false,
            mass: mass,
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
        const _wp = this.world.physics;

        if (_p.enabled) {
        //=======================================================//
        // Pre-defined forces: Gravity, Friction, Drag
        //=======================================================//
            this.applyForce(Vect.mult(_wp.gravity, _p.mass)); // Gravity ignoring mass

            if (_p.onSurface) { // Only apply friction touching a surface
                _wp.friction = _p.vel.copy();
                _wp.friction.setMag(-_wp.fricStr);
                this.applyForce(_wp.friction);
            } else { // Applies drag when in the air
                _wp.drag = _p.vel.copy();
                _wp.drag.mult(-_wp.dragStr * (_p.vel.magSq()));
                this.applyForce(_wp.drag);
            }

        //=======================================================//
        // Acceleration, Velocity, Position
        //=======================================================//
            _p.vel.add(_p.acc);
            this.pos.add(_p.vel);
        //=======================================================//
        // World Collision
        //=======================================================//
            _p.onSurface = false;
            
            if (_p.collideWithWorld) {
                if (this.pos.y < 0) { // Top
                    this.pos.y = 0;
                    _p.vel.y *= -_wp.bounce;
                }

                if (this.pos.y + this.height> this.world.height) { // Bottom
                    this.pos.y = this.world.height - this.height;
                    _p.vel.y *= -_wp.bounce;
                    _p.onSurface = true;
                }

                if (this.pos.x < 0) { // Left
                    _p.vel.x *= -_wp.bounce;
                    this.pos.x = 0;
                }
                
                if (this.pos.x + this.width > this.world.width) { // Right
                    this.pos.x = this.world.width - this.width;
                    _p.vel.x *= -_wp.bounce;
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

        //=======================================================//
        // Zero out acceleration
        //=======================================================//
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
        if (!isNaN(force.x)) {
            var _f = Vect.div(force, this.physics.mass);
            this.physics.acc.add(_f);
        }
    }

    enablePhysics() {
        this.physics.enabled = true;
    };

    init() {}
    update() {}
    draw() {}
}
