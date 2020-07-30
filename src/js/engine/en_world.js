"use strict";
/**
 * World Class
 * @typedef {{}} World
 */
    class World {
        /**
         * A World is a self contained object inside the State. Contains the camera, all Entities, and
         * Cells. Equivalent of different "levels"
         * @constructor
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
            this.cellBuffer = 1;
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

            this.addCells();
        }

        /**
         * Runs calculations on the World and all of it's children Elements
         * @method update
         */
        update() {
            // Moves Camera with the followed Entity (player)
            var _c = this.camera;
            _c.pos.x = (_c.follow.pos.x - _c.width / 2);
            _c.pos.y = (_c.follow.pos.y - _c.height /2);

            // Stops Camera when followed Entity (player) is close to the World boundaries
            if (_c.follow.pos.y > this.height - _c.dzY) { _c.pos.y = this.height - _c.height; }
            if (_c.follow.pos.y < _c.dzY) { _c.pos.y = 0; }
            if (_c.follow.pos.x > this.width - _c.dzX) { _c.pos.x = this.width - _c.width; }
            if (_c.follow.pos.x < _c.dzX) { _c.pos.x = 0; }

            this.ctx.setTransform(1,0,0,1, -_c.pos.x, -_c.pos.y);
        }

        /**
         * If (GAME.debug) this method draws World and bounds to the canvas
         * @method debugDraw
         */
        debugDraw() {
            this.ctx.strokeStyle = "rgb(255,0,0)"; // Red
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(1, 1, this.width - 2, this.height - 2);
        }

        /**
         * If (GAME.debug) this method draws the Camera bounds to the canvas
         * @method cameraDebug()
         */
        cameraDebug() {
            this.ctx.strokeStyle = "rgb(0,0,255)"; // Blue
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.camera.pos.x + 10,
                this.camera.pos.y + 10,
                this.camera.width - 20,
                this.camera.height - 20
            );
        }

        /**
         * Enables physics on the Specified World and all of it's children Elements
         * @method enablePhysics
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
            this.ents.forEach((ent) => { ent.enablePhysics(); });
        }

        /**
         * Populates the world with cells based on the STAGE width
         * @method addCells
         */
        addCells() {
            var _horCount = Math.ceil(this.width/this.Game.STAGE.width),
                _verCount = Math.ceil(this.height/this.Game.STAGE.height);

            this.cells = [];

            for (var a = 0; a < _verCount; a++) {
                for (var e = 0; e < _horCount; e++) {
                    this.cells.push(new Cell(
                        this.Game,
                        this,
                        e * this.Game.STAGE.width,
                        a * this.Game.STAGE.height,
                        this.Game.STAGE.width,
                        this.Game.STAGE.height
                    ));
                }
            }
        }

        /**
         * Sets the new dimensions of the World and generates cells accordingly
         * @method setWorld
         * @param {Number} width Width of the newly defined World
         * @param {Number} height Height of the newly defined World
         */
        setWorld(width, height) {
            this.width = width;
            this.height = height;
            this.addCells();
        }

        /**
         * Sets the number of Cells adjacent to the followed Entity's (player's) Cell that will
         * render entities
         * @method setBuffer
         * @param {Number} buffer
         */
        setBuffer(buffer) {
            this.cellBuffer = buffer;
        }
    }
