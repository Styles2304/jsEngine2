"use strict";
/**
 * World Class
 * @typedef {{}} World
 */
    class World {
        /**
         * A World is a self contained object inside the State. Contains the camera, all Entities, and
         * Cells. Equivalent of different "levels"
         * @param {GAME} Game Reference to the master GAME object
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
                new Vector(0, 0),
                new Vector(this.width, 0),
                new Vector(this.width, this.height),
                new Vector(0, this.height)
            );
            this.physics = {
                enabled: false,
                gravity: new Vector(0, 3),
                friction: 1,
                drag: 0.0001,
                bounce: 0.75
            };
            this.camera = {
                follow: null,
                pos: new Vector(),
                width: this.Game.STAGE.width,
                height: this.Game.STAGE.height,
                dzX: this.width / 2,
                dzY: this.height / 2
            }
        }

        /**
         * Runs calculations on the World and all of it's children Elements
         * @method update
         */
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

        /**
         * If (GAME.debug) this method draws World and Camera bounds to the canvas
         * @method debugDraw
         */
        debugDraw() {
            // World
            this.ctx.strokeStyle = "rgb(255,0,0)"; // Red
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(1, 1, this.width - 2, this.height - 2);

            // Camera
            this.ctx.strokeStyle = "rgb(0,0,255)"; // Blue
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.camera.pos.x + 10,
                this.camera.pos.y + 10,
                this.camera.width - 20,
                this.camera.height - 20
            );
            this.ctx.lineWidth = 1;
        }

        /**
         * Enables physics on the Specified World and all of it's children Elements
         * @param {Vector} gravity 
         * @param {number} friction 
         * @param {number} drag 
         * @param {number} bounce 
         */
        enablePhysics(gravity, friction, drag, bounce) {
            this.physics.gravity = gravity || new Vector(0,3);
            this.physics.friction = friction || 1;
            this.physics.drag = drag || 0.0001;
            this.physics.bounce = bounce || 0.75;

            this.physics.enabled = true;
            this.ents.forEach(function(ent) {
                ent.enablePhysics();
            });
        }

        /**
         * Populates the world with cells at the specified width and height
         * @param {Number} width Width of cells
         * @param {Number} height Height of cells
         */
        addCells(width, height) {
            var _x = 0,
                _y = 0,
                _horCount = Math.ceil(this.width/width),
                _verCount = Math.ceil(this.height/height);

            for (var a = 0; a < _verCount; a++) {
                for (var e = 0; e < _horCount; e++) {
                    this.cells.push(new Cell(this.Game, this, e * width, a * height, width, height));
                }
            }
        }
    }
