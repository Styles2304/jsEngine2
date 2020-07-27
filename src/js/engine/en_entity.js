"use strict";
/** Entity Class */
    class Ent {
        /**
         * Base Entity class
         * @param {{}} Game Reference to the master GAME object
         * @param {{}}} World Reference to World the Entity belongs to
         * @param {Number} x Canvas X Position
         * @param {Number} y Canvas Y Position
         * @param {Number} width Width of the Entity
         * @param {Number} height Height of the Entity
         * @param {Number} mass (Optional) Only useful for Physics
         */
        constructor(Game, World, x, y, width, height, mass) {
            this.Game = Game;
            this.ctx = Game.CONTEXT;
            this.pos = new Vect(x, y);
            this.width = width || 0;
            this.height = height || 0;
            this.center = new Vect(Math.floor(this.width / 2), Math.floor(this.height / 2));
            this.offset = new Vect(0,0);
            this.relativePos = Vect.sub(this.pos, this.offset);
            this.World = World;
            this.physics = {
                enabled: false,
                collideWithWorld: true,
                onSurface: false,
                mass: mass,
                acc: new Vect(), /** Force: Acceleration */
                vel: new Vect(), /** Force: Velocity */
                frc: new Vect(), /** Force: Friction */
                drg: new Vect(), /** Force: Drag */
                ang: 0, /** Current Angle of Entity */
                aAcc: 0, /** Force: Angular Acceleration */
                aVel: 0 /** Force: Angular Velocity */
            }
            this.bounding = this.boundingUpdate(),
            this.health = { cur: 100, max: 100 }
            this.initialized = false;

            if (this.World.physics.enabled) { this.enablePhysics(); }
            this.World.ents.push(this);
        }

        classInit() {}

        classUpdate() {
        /**
         * Physics
         */
            const _p = this.physics;
            const _wp = this.World.physics;

            if (_p.enabled) {
            /**
             * Pre-defined forces: Gravity, Friction, Drag
             */
                this.applyForce(Vect.mult(_wp.gravity, _p.mass)); // Gravity ignoring mass

                if (_p.onSurface) { // Only apply friction touching a surface
                    _p.frc = _p.vel.copy();
                    _p.frc.setMag(-_wp.friction);
                    this.applyForce(_p.frc);
                    
                    if (_p.aVel > 0) {
                        _p.aAcc -= _p.frc.getMag();
                    }

                    if (_p.aVel < 0) {
                        _p.aAcc += _p.frc.getMag();
                    }
                } else { // Applies drag when in the air
                    _p.drg = _p.vel.copy();
                    _p.drg.mult(-_wp.drag * (_p.vel.magSq()));
                    this.applyForce(_p.drg);
                }

            /**
             * Angular Forces
             */
                _p.aVel += _p.aAcc;
                _p.ang += _p.aVel;

            /**
             * Acceleration, Velocity, Position / World Position
             */
                _p.vel.add(_p.acc);
                this.pos.add(_p.vel);

            /**
             * Relative Position Update
             */
                this.relativePos = Vect.sub(this.pos, this.offset);

            /**
             * World Collision
             */
                _p.onSurface = false;
                
                if (_p.collideWithWorld) {
                    if (this.relativePos.y < 0) { // Top
                        this.pos.y = 0 + this.offset.y;
                        _p.vel.y *= -_wp.bounce;
                    }

                    if (this.relativePos.y + this.height> this.World.height) { // Bottom
                        this.pos.y = this.World.height - (this.height - this.offset.y);
                        _p.vel.y *= -_wp.bounce;
                        _p.onSurface = true;
                    }

                    if (this.relativePos.x < 0) { // Left
                        this.pos.x = 0 + this.offset.x;
                        _p.vel.x *= -_wp.bounce;
                    }
                    
                    if (this.relativePos.x + this.width > this.World.width) { // Right
                        this.pos.x = this.World.width - (this.width - this.offset.x);
                        _p.vel.x *= -_wp.bounce;
                    }
                }

            /**
             * Bounding Box Update
             */
                this.bounding = this.boundingUpdate();

            /**
             * Zero out acceleration(s)
             */
                _p.acc.mult(0);
                _p.aAcc = 0;
            }

        /**
         * Non-physics
         */
            if (!_p.enabled) {
            /**
             * Relative Position Update
             */
                this.relativePos = Vect.sub(this.pos, this.offset);

            /**
             * Bounding Box Update
             */
                this.bounding = this.boundingUpdate();
            }
        }

        debugDraw() {
            if (this.Game.debug) {
                this.ctx.strokeStyle = "#F0F";
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.bounding[0].x, this.bounding[0].y);
                this.ctx.lineTo(this.bounding[1].x, this.bounding[1].y);
                this.ctx.lineTo(this.bounding[2].x, this.bounding[2].y);
                this.ctx.lineTo(this.bounding[3].x, this.bounding[3].y);
                this.ctx.lineTo(this.bounding[0].x, this.bounding[0].y);
                this.ctx.stroke();

            /**
             * Origin
             */
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

        /**
         * Updates the bounding box based on current positioning and rotation
         * @returns {array} An array of vectors
         */
        boundingUpdate() {
            var _x = Math.floor(this.relativePos.x),
                _y = Math.floor(this.relativePos.y);

            return [
                { x: _x, y: _y },
                { x: _x + this.width, y: _y },
                { x: _x + this.width, y: _y + this.height },
                { x: _x, y: _y + this.height }
            ];
        }

        enablePhysics() {
            this.physics.enabled = true;
        };

        draw() {
            /**
             * Default draw function for Entity so it is visible when added in world
             */
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
            this.ctx.arc(
                _x,
                _y + this.height / 16,
                _r / 2,
                0,
                Math.PI
            );
            this.ctx.stroke();
        }

        init() {}
        update() {}
        drawEnt() {
            /**
             * Rotates the canvas if any rotation (this.ang) is present on the Entity
             */
            if (this.ang != 0) {
                this.ctx.translate(this.pos.x, this.pos.y);
                this.ctx.rotate(this.physics.ang * Math.PI / 180);
                this.ctx.translate(-this.pos.x, -this.pos.y);
            }
            
            /**
             * Draws the Entity to the canvas
             */
            this.draw();

            /**
             * Corrects the canvas rotation if necessary
             */
            if (this.ang != 0) {
                this.ctx.translate(this.pos.x, this.pos.y);
                this.ctx.rotate(-this.physics.ang * Math.PI / 180);
                this.ctx.translate(-this.pos.x, -this.pos.y);
            }
        }
    }