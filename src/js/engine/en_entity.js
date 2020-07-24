"use strict";
//=======================================================//
// Entity Class
//=======================================================//

class Ent {
    /**
     * Base Entity class
     * @param {Object} game - Reference to the master GAME object
     * @param {Object} world - Reference to World the Entity belongs to
     * @param {number} x - Canvas X Position
     * @param {number} y - Canvas Y Position
     * @param {number} width - Width of the Entity
     * @param {number} height - Height of the Entity
     * @param {number} mass - (Optional) Only useful for Physics
     */
    constructor(game, world, x, y, width, height, mass) {
        this.game = game;
        this.ctx = game.CONTEXT;
        this.pos = new Vect(x, y);
        this.width = width || 0;
        this.height = height || 0;
        this.center = new Vect(Math.floor(this.width / 2), Math.floor(this.height / 2));
        this.offset = new Vect(0,0);
        this.relativePos = Vect.sub(this.pos, this.offset);
        this.worldPos = new Vect(x, y);
        this.world = world;
        this.physics = {
            enabled: false,
            collideWithWorld: true,
            onSurface: false,
            mass: mass,
            acc: new Vect(),
            vel: new Vect(),
        }
        bounding: this.boundingUpdate(),
        this.health = { cur: 100, max: 100 }
        this.initialized = false;

        if (this.world.physics.enabled) { this.enablePhysics(); }
        this.world.ents.push(this);
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
        // Relative Position Update
        //=======================================================//
            this.relativePos = Vect.sub(this.pos, this.offset);

        //=======================================================//
        // World Collision
        //=======================================================//
            _p.onSurface = false;
            
            if (_p.collideWithWorld) {
                if (this.relativePos.y < 0) { // Top
                    this.pos.y = 0 + this.offset.y;
                    _p.vel.y *= -_wp.bounce;
                }

                if (this.relativePos.y + this.height> this.world.height) { // Bottom
                    this.pos.y = this.world.height - (this.height - this.offset.y);
                    _p.vel.y *= -_wp.bounce;
                    _p.onSurface = true;
                }

                if (this.relativePos.x < 0) { // Left
                    this.pos.x = 0 + this.offset.x;
                    _p.vel.x *= -_wp.bounce;
                }
                
                if (this.relativePos.x + this.width > this.world.width) { // Right
                    this.pos.x = this.world.width - (this.width - this.offset.x);
                    _p.vel.x *= -_wp.bounce;
                }
            }

        //=======================================================//
        // Bounding Box Update
        //=======================================================//
            this.bounding = this.boundingUpdate();

        //=======================================================//
        // Zero out acceleration
        //=======================================================//
            _p.acc.mult(0);
        }

    //=======================================================//
    // Non-physics
    //=======================================================//
        if (!_p.enabled) {
        //=======================================================//
        // Relative Position Update
        //=======================================================//
            this.relativePos = Vect.sub(this.pos, this.offset);

        //=======================================================//
        // Bounding Box Update
        //=======================================================//
            this.bounding = this.boundingUpdate();
        }
    }

    debugDraw() {
        if (this.game.debug) {
            this.ctx.strokeStyle = "#F0F";
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.bounding[0].x, this.bounding[0].y);
            this.ctx.lineTo(this.bounding[1].x, this.bounding[1].y);
            this.ctx.lineTo(this.bounding[2].x, this.bounding[2].y);
            this.ctx.lineTo(this.bounding[3].x, this.bounding[3].y);
            this.ctx.lineTo(this.bounding[0].x, this.bounding[0].y);
            this.ctx.stroke();

            // Origin
            this.ctx.fillStyle = "#F0F";
            this.ctx.fillRect(this.pos.x-4, this.pos.y-4, 8, 8);
        }
    }

    applyForce(force) {
        if (!isNaN(force.x)) {
            var _f = Vect.div(force, this.physics.mass);
            this.physics.acc.add(_f);
        }
    }

    boundingUpdate() {
        return [{ x: this.relativePos.x, y: this.relativePos.y },
                { x: (this.relativePos.x) + this.width, y: this.relativePos.y },
                { x: (this.relativePos.x) + this.width, y: (this.relativePos.y) + this.height },
                { x: this.relativePos.x, y: (this.relativePos.y) + this.height }];
    }

    enablePhysics() {
        this.physics.enabled = true;
    };

    rotate(ang) {
        var _rads = ang * Math.PI / 180;
        console.log(_rads);
        // this.ctx.translate(this.pos.x, this.pos.y);
        // this.ctx.rotate(_rads);
        // // draw
        // this.ctx.translate(-this.pos.x, -this.pos.y);
    }

    init() {}
    update() {}
    draw() {}
}