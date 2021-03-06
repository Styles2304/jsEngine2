"use strict";
/**
 * Entity Class
 * @typedef {{}} Entity
 * 
 * TO-DO:
 *  - Collision with tilemap
 */
    class Entity {
        /**
         * Base Entity class with it's own Init(), Update(), and Draw() functions
         * @constructor
         * @param {GAME} Game Reference to the master GAME object
         * @param {World} World Reference to World the Entity belongs to
         * @param {Number} x World X Position
         * @param {Number} y World Y Position
         * @param {Number} [width=0] Width of the Entity
         * @param {Number} [height=0] Height of the Entity
         * @param {Number} [mass=0] Only useful for Physics
         */
        constructor(Game, World, x, y, width, height, mass) {
            this.Game = Game;
            this.ctx = Game.CONTEXT;
            this.pos = new Vector(x, y);
            if (typeof width === 'undefined') { this.width = 0; } else { this.width = width; }
            if (typeof height === 'undefined') { this.height = 0; } else { this.height = height; }
            this.center = new Vector(Math.floor(this.width / 2), Math.floor(this.height / 2));
            this.offset = new Vector();
            this.relativePos = Vector.sub(this.pos, this.offset);
            this.World = World;
            this.Cell = null;
            this.cellMapPos = new Vector();
            this.mapIndex = null;
            this.animations = {};
            this.animation = null;
            this.spriteSheet = null;
            this.physics = {
                enabled: false,             // Physics toggle for Entity
                collideWithWorld: true,     // Collide with world bounds - not that useful for how much work I'm putting into it.
                advancedCollision: true,    // Rotates bounding box with Entity and has different collision calculations based on
                                            // the 4 corners of the defined bounding box
                bounding: [],               // Bounding Box for Advanced Collision
                simpleBounding: {           // Bounding box for simple collisions
                    pos: { x: 0, y: 0 },    // pos is an offset
                    width: this.width,
                    height: this.height
                },
                onSurface: false,           // Touching a surface
                mass: null,                 // Mass of Entity
                acc: new Vector(),          // Force: Acceleration
                vel: new Vector(),          // Force: Velocity
                frc: new Vector(),          // Force: Friction
                drg: new Vector(),          // Force: Drag
                ang: 0,                     // Current Angle of Entity
                aAcc: 0,                    // Force: Angular Acceleration
                aVel: 0                     // Force: Angular Velocity
            }
            if (typeof mass === 'undefined') { this.physics.mass = 0; } else { this.physics.mass = mass; }
            this.health = { cur: 100, max: 100 }
            this.initialized = false;
            this.render = true;

            if (this.World.physics.enabled) { this.physics.enabled = true; }
            this.World.ents.push(this);
        }

        /**
         * Anything that needs to be initiated by the Entity by default
         * @method classInit
         */
        classInit() {
            this.assignCell();
            this.init();
            this.initialized = true;
        }

        /**
         * All Processes that need to be updated by the class by default
         * The powerhouse of the Entity class
         * @method classUpdate
         */
        classUpdate() {
         // Cell Management
            if (!this.Cell.in(this) && !this.assigningCell) {
            // Removes Entity from leaving Cell
                this.Cell.ents.splice(this.Cell.ents.indexOf(this), 1);

            // Locates new cell and assigns it accordingly
                this.assignCell();
            }

        // Physics
            const _p = this.physics;
            const _wp = this.World.physics;
            
            if (_p.enabled) {

            // Pre-defined forces: Gravity, Friction, Drag
                this.applyForce(Vector.mult(_wp.gravity, _p.mass)); // Gravity ignoring mass

                if (_p.onSurface) { // Only apply friction touching a surface
                // Applies Linear Friction
                    _p.frc = _p.vel.copy();
                    _p.frc.setMag(-_wp.friction);
                    this.applyForce(_p.frc);
                    
                // Applies Angular Friction
                    if (_p.aVel > 0) {
                        _p.aAcc -= _p.frc.getMag();
                    }
                    if (_p.aVel < 0) {
                        _p.aAcc += _p.frc.getMag();
                    }
                } else { // Applies drag when in the air
                // Applies Linear Drag
                    _p.drg = _p.vel.copy();
                    _p.drg.mult(-_wp.drag * (_p.vel.magSq()));
                    this.applyForce(_p.drg);

                // Applies Angular Drag
                    if (_p.aVel > 0) {
                        _p.drg = (_p.aVel * _p.aVel) * -_wp.drag;
                    }
                    if (_p.aVel < 0) {
                        _p.drg = (_p.aVel * _p.aVel) * _wp.drag;
                    }
                    this.applyAngForce(_p.drg);
                }

            // Angular Forces
                _p.aVel += _p.aAcc;
                _p.ang += _p.aVel;

            // Acceleration, Velocity, Position / World Position
                _p.vel.add(_p.acc);
                this.pos.add(_p.vel);

            // Relative Position Update
                this.relativePos = Vector.sub(this.pos, this.offset);

            // Bounding Box Update
                if (_p.advancedCollision) {
                    this.physics.bounding[0] = Vector.rot(Vector.add(this.relativePos, new Vector(0, 0)), this.Game.radians(_p.ang), this.pos);
                    this.physics.bounding[2] = Vector.rot(Vector.add(this.relativePos, new Vector(this.width, this.height)), this.Game.radians(_p.ang), this.pos);
                    this.physics.bounding[1] = Vector.rot(Vector.add(this.relativePos, new Vector(this.width, 0)), this.Game.radians(_p.ang), this.pos);
                    this.physics.bounding[3] = Vector.rot(Vector.add(this.relativePos, new Vector(0, this.height )), this.Game.radians(_p.ang), this.pos);
                }

            // Collision In General
                _p.onSurface = false;
                
            // World Bounds Collision
                if (_p.collideWithWorld) {
                    if (_p.advancedCollision) {
                    // Top Bounds
                        if (
                            _p.bounding[0].y < 0 || _p.bounding[1].y < 0 ||
                            _p.bounding[2].y < 0 || _p.bounding[3].y < 0
                        ) {
                            if (_p.bounding[0].y < 0) { this.pos.y -= _p.bounding[0].y; }
                            if (_p.bounding[1].y < 0) { this.pos.y -= _p.bounding[1].y; }
                            if (_p.bounding[2].y < 0) { this.pos.y -= _p.bounding[2].y; }
                            if (_p.bounding[3].y < 0) { this.pos.y -= _p.bounding[3].y; }

                            _p.vel.y *= -_wp.bounce;
                        }
                    // Bottom Bounds
                        if (
                            _p.bounding[0].y > this.World.height || _p.bounding[1].y > this.World.height ||
                            _p.bounding[2].y > this.World.height || _p.bounding[3].y > this.World.height
                        ) {
                            if (_p.bounding[0].y > this.World.height) { this.pos.y -= _p.bounding[0].y - this.World.height; }
                            if (_p.bounding[1].y > this.World.height) { this.pos.y -= _p.bounding[1].y - this.World.height; }
                            if (_p.bounding[2].y > this.World.height) { this.pos.y -= _p.bounding[2].y - this.World.height; }
                            if (_p.bounding[3].y > this.World.height) { this.pos.y -= _p.bounding[3].y - this.World.height; }

                            _p.vel.y *= -_wp.bounce;
                            _p.onSurface = true;
                        }
                    // Left Bounds
                        if (
                            _p.bounding[0].x < 0 || _p.bounding[1].x < 0 ||
                            _p.bounding[2].x < 0 || _p.bounding[3].x < 0
                        ) {
                            if (_p.bounding[0].x < 0) { this.pos.x -= _p.bounding[0].x; }
                            if (_p.bounding[1].x < 0) { this.pos.x -= _p.bounding[1].x; }
                            if (_p.bounding[2].x < 0) { this.pos.x -= _p.bounding[2].x; }
                            if (_p.bounding[3].x < 0) { this.pos.x -= _p.bounding[3].x; }

                            _p.vel.x *= -_wp.bounce;
                        }
                    // Right Bounds
                        if (
                            _p.bounding[0].x > this.World.width || _p.bounding[1].x > this.World.width ||
                            _p.bounding[2].x > this.World.width || _p.bounding[3].x > this.World.width
                        ) {
                            if (_p.bounding[0].x > this.World.width) { this.pos.x -= _p.bounding[0].x - this.World.width; }
                            if (_p.bounding[1].x > this.World.width) { this.pos.x -= _p.bounding[1].x - this.World.width; }
                            if (_p.bounding[2].x > this.World.width) { this.pos.x -= _p.bounding[2].x - this.World.width; }
                            if (_p.bounding[3].x > this.World.width) { this.pos.x -= _p.bounding[3].x - this.World.width; }

                            _p.vel.x *= -_wp.bounce;
                        }
                    } else {
                    // Top Bounds
                        if (this.relativePos.y + _p.simpleBounding.pos.y < 0) {
                            this.pos.y = this.offset.y - _p.simpleBounding.pos.y;
                            _p.vel.y *= -_wp.bounce;
                        }

                    // Bottom Bounds
                        if (this.relativePos.y + _p.simpleBounding.pos.y + _p.simpleBounding.height > this.World.height) {
                            this.pos.y = this.World.height - this.offset.y + (this.height - (_p.simpleBounding.pos.y + _p.simpleBounding.height));
                            _p.vel.y *= -_wp.bounce;
                            _p.onSurface = true;
                        }
                    // Left Bounds
                        if (this.relativePos.x + _p.simpleBounding.pos.x < 0) {
                            this.pos.x = this.offset.x - _p.simpleBounding.pos.x;
                            _p.vel.x *= -_wp.bounce;
                        }

                    // Right Bounds
                        if (this.relativePos.x + _p.simpleBounding.pos.x + _p.simpleBounding.width > this.World.width) {
                            this.pos.x = this.World.width - this.offset.x + (this.width - (_p.simpleBounding.pos.x + _p.simpleBounding.width));
                            _p.vel.x *= -_wp.bounce;
                        }
                    }
                }

            // Map Collision
                if (_p.advancedCollision) {} else {
                    // Bottom Bounds
                        
                    // var tile = array[y * width + x]
                    // this.Cell.width / this.tileWidth

                    // if (this.relativePos.y + _p.simpleBounding.pos.y + _p.simpleBounding.height > this.World.height) {
                    //     this.pos.y = this.World.height - this.offset.y + (this.height - (_p.simpleBounding.pos.y + _p.simpleBounding.height));
                    //     _p.vel.y *= -_wp.bounce;
                    //     _p.onSurface = true;
                    // }
                }

            // Zero out acceleration(s)
                _p.acc.mult(0);
                _p.aAcc = 0;

            // Zero out very small angular velocities
                if (Math.abs(_p.aVel) < 0.099) { _p.aVel = 0; }
            }


            // Calls the player defined update() 
            this.update();

            // End of update Relative Position Update
                this.relativePos = Vector.sub(this.pos, this.offset);
        }

        /**
         * Automatically translates and rotates the canvas based on Entity.ang,
         * Executes the users draw method, then returns the canvas to normal
         * @method classDraw
         */
        classDraw() {
            if (this.render) {
            // Rotates the canvas if any rotation (this.ang) is present on the Entity
                if (this.ang != 0) {
                    this.ctx.translate(this.pos.x, this.pos.y);
                    this.ctx.rotate(this.Game.radians(this.physics.ang));
                    this.ctx.translate(-this.pos.x, -this.pos.y);
                }
            
            // Calls the player defined draw() class
                this.draw();

            // If Game.debug draws the origin and bounding box of the Entity
                if (this.Game.debug) { this.debugDraw(); }

            // Corrects the canvas rotation if necessary
                if (this.ang != 0) {
                    this.ctx.translate(this.pos.x, this.pos.y);
                    this.ctx.rotate(-this.Game.radians(this.physics.ang));
                    this.ctx.translate(-this.pos.x, -this.pos.y);
                }
            }
        }

        /**
         * If (GAME.debug) this method draws the Origin and Boundingbox of the Entity
         * @method debugDraw
         */
        debugDraw() {
            // Bounding Box
                this.ctx.strokeStyle = "#F0F";
                this.ctx.lineWidth = 2;

            // Un-does any rotation that may be present so the bounding box is accurately represented
                if (this.physics.ang != 0) {
                    this.ctx.translate(this.pos.x, this.pos.y);
                    this.ctx.rotate(-this.Game.radians(this.physics.ang));
                    this.ctx.translate(-this.pos.x, -this.pos.y);
                }

                if (this.physics.advancedCollision) {
                // Advanced Collision Box drawing from bounding coordinates
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.physics.bounding[0].x, this.physics.bounding[0].y);
                    this.ctx.lineTo(this.physics.bounding[1].x, this.physics.bounding[1].y);
                    this.ctx.lineTo(this.physics.bounding[2].x, this.physics.bounding[2].y);
                    this.ctx.lineTo(this.physics.bounding[3].x, this.physics.bounding[3].y);
                    this.ctx.lineTo(this.physics.bounding[0].x, this.physics.bounding[0].y);
                    this.ctx.stroke();
                } else {
                // Simple Collision Box
                    this.ctx.strokeRect(
                        this.relativePos.x + this.physics.simpleBounding.pos.x, this.relativePos.y + this.physics.simpleBounding.pos.y,
                        this.physics.simpleBounding.width, this.physics.simpleBounding.height
                    );
                }

            // Re-Applies any rotation that may be present
                if (this.physics.ang != 0) {
                    this.ctx.translate(this.pos.x, this.pos.y);
                    this.ctx.rotate(this.Game.radians(this.physics.ang));
                    this.ctx.translate(-this.pos.x, -this.pos.y);
                }
    
            // Origin
                this.ctx.fillStyle = "#F0F";
                this.ctx.fillRect(this.pos.x-4, this.pos.y-4, 8, 8);
            }

        /**
         * Determines which cell the Entity is in, adds an Entity pointer to that Cell,
         * and Adds a Cell pointer to the Entity
         * This is called when initiating an Entity and when the Entity changes cells
         * Ultimately this is for culling and faster collision checks
         * @method assignCell
         */
        assignCell() {
            this.World.cells.forEach((cell) => {
                if (cell.in(this)) {
                    this.Cell = cell;
                    this.Cell.ents.push(this);
                }
            });
        }

        /**
         * Applies force/mass to an Entity in a physics enabled World
         * @method applyForce
         * @param {Vector} force
         */
        applyForce(force) {
            if (!isNaN(force.x)) {
                var _f = Vector.div(force, this.physics.mass);
                this.physics.acc.add(_f);
            }
        }

        /**
         * Applies an angular force/mass to rotate the Entity
         * === DO NOT USE WITH LINEAR GRAVITY ===
         * @method applyAngForce
         * @param {Number} force
         */
        applyAngForce(force) {
            if (!isNaN(force)) {
                this.physics.aVel += (force / this.physics.mass);
            }
        }

        /**
         * Sets the simple collision bounding box relative to the parent Entity
         * @method simpleBounding
         * @param {Number} x X Position from the top-left corner of the Entity
         * @param {Number} y Y Position from the top-left corner of the Entity
         * @param {Number} width
         * @param {Number} height
         */
        simpleBounding(x, y, width, height) {
            this.physics.simpleBounding.pos = {
                x: x,
                y: y
            }
            this.physics.simpleBounding.width = width;
            this.physics.simpleBounding.height = height;
        }

        /**
         * Sets the Entity's spritesheet
         * @method
         * @param {String} src Path to image source and name of pre-loaded image
         */
        setSpriteSheet(src) {
            this.spriteSheet = Game.images[src];
        };
        
        /**
         * Adds an animation to the entity
         * @method addAnimation
         * @param {String} name Name of the animation to add
         * @param {Number} duration Length of time to get through the entire animation in ms
         * @param {Boolean} [flipped=false] Optional toggle to flip animation. If true, image is draw mirrored
         * @param {Array} [frames=[]] Optional array of frames to be added at animation creation
         */
        addAnimation(name, duration, flipped, frames) {
            var _duration,
                _flipped,
                _frames = [];

            if (typeof duration === 'undefined') { _duration = 1; } else { _duration = duration; }
            if (typeof flipped === 'undefined') { _flipped = false; } else { _flipped = flipped; }
            if (typeof frames !== 'undefined') {
            // Converts provided array of frames and frame data to objects to be added to the animation
                for (var a = 0; a < frames.length; a++) {
                    _frames.push({
                        x: frames[a][0],
                        y: frames[a][1],
                        w: frames[a][2],
                        h: frames[a][3],
                        start: frames[a][4],
                        end: frames[a][5]
                    });
                }
            }

            this.animations[name] = new Anim(
                this.ctx,
                this,
                name,
                this.spriteSheet,
                _duration,
                _flipped,
                _frames
            );
        }

        /**
         * Calls animation and sets the currentAnimation
         * @method playAnimation
         * @param {Anim} name 
         */
        playAnimation(name) {
            this.animations[name].play();
            this.currentAnimation = name;
        }

        /**
         * Initating method of the Entity
         * Only Called Once
         * @method init
         */
        init() {}

        /**
         * Update method for calculations that need to be run every frame
         * @method update
         */
        update() {}

        /**
         * Generally overwritten by the user
         * This draws the default sprite for the Entity
         * ... But maybe not? I might replace the ability to overwrite draw with
         * control over animations (idle, run, etc)
         * @method draw
         */
        draw() { // Delete all when dev is done
            var _r = this.width/2,
                _x = this.pos.x + (this.center.x - this.offset.x),
                _y = this.pos.y + (this.center.y - this.offset.y);
            this.ctx.fillStyle="#FF0";
            this.ctx.beginPath();      
            this.ctx.arc(
                _x,
                _y,
                _r,
                0,
                2 * Math.PI);
            this.ctx.fill();
            this.ctx.fillStyle="#000";
            this.ctx.fillRect(
                (_x - this.width / 5) - (Math.sqrt(_r)) / 2,
                _y - this.height / 6,
                Math.sqrt(_r),
                Math.sqrt(_r)
            );
            this.ctx.fillRect(
                (_x + this.width / 5) - (Math.sqrt(_r)) / 2,
                _y - this.height / 6,
                Math.sqrt(_r),
                Math.sqrt(_r)
            );
            this.ctx.strokeStyle="#000";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(_x - this.width / 4, _y + this.height / 5);
            this.ctx.lineTo(_x + this.width / 4, _y + this.height / 5);
            this.ctx.stroke();
        }
    }
