"use strict";
/** World Class */
    class World {
        /**
         * The World class contained by a State. Contains the camera, all entities, and
         * Cells
         * @param {{}} Game Reference to the master GAME object
         * @param {Number} width Width of the World
         * @param {Number} height Height of the World
         */
        constructor(Game, width, height) {
            this.Game = Game;
            this.ctx = Game.CONTEXT;
            this.width = width;
            this.height = height;
            this.cells = [];
            this.ents = [];
            this.collision = Array(
                new Vect(0, 0),
                new Vect(this.width, 0),
                new Vect(this.width, this.height),
                new Vect(0, this.height)
            );
            this.physics = {
                enabled: false,
                gravity: new Vect(0, 3),
                friction: 1,
                drag: 0.0001,
                bounce: 0.75
            };
            this.camera = {
                follow: null,
                pos: new Vect(),
                width: this.Game.STAGE.width,
                height: this.Game.STAGE.height,
                dzX: this.width / 2,
                dzY: this.height / 2
            }
        }

        update() {
            var _c = this.camera;
            _c.pos.x = (_c.follow.pos.x - _c.width / 2);
            _c.pos.y = (_c.follow.pos.y - _c.height /2);

            if (_c.follow.pos.y > this.height - _c.dzY) { _c.pos.y = this.height - _c.height; }
            if (_c.follow.pos.y < _c.dzY) { _c.pos.y = 0; }
            if (_c.follow.pos.x > this.width - _c.dzX) { _c.pos.x = this.width - _c.width; }
            if (_c.follow.pos.x < _c.dzX) { _c.pos.x = 0; }

            this.ctx.setTransform(1,0,0,1, -_c.pos.x, -_c.pos.y);
        }

        debugDraw() {
            // World
            this.ctx.strokeStyle = "rgb(255,0,0)"; // Red
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(1, 1, this.width - 2, this.height - 2);

            // Camera
            this.ctx.strokeStyle = "rgb(0,0,255)"; // Blue
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.camera.pos.x + 4,
                this.camera.pos.y + 4,
                this.camera.width - 9,
                this.camera.height - 8
            );
            this.ctx.lineWidth = 1;
        }

        /**
         * Enables physics on the Specified World and all of the Entities it contains
         * @param {Object.<Vect>} gravity 
         * @param {number} friction 
         * @param {number} drag 
         * @param {number} bounce 
         */
        enablePhysics(gravity, friction, drag, bounce) {
            this.physics.gravity = gravity || new Vect(0,3);
            this.physics.friction = friction || 1;
            this.physics.drag = drag || 0.0001;
            this.physics.bounce = bounce || 0.75;

            this.physics.enabled = true;
            this.ents.forEach(function(ent) {
                ent.enablePhysics();
            });
        }
    }