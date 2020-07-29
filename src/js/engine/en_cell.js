"use strict";
/**
 * Cell Class
 * @typedef {{}} Cell
 */
    class Cell {
        /**
         * Tracks Entities inside it's bounds and determines whether or not
         * they're drawn - my solution for culling
         * @constructor
         * @param {GAME} Game Reference to the master GAME object
         * @param {World} World Reference to World the Cell belongs to
         * @param {Number} [x] World X Position
         * @param {Number} [y] World Y Position
         * @param {Number} [width] Width of Cell
         * @param {Number} [height] Height of Cell
         */
        constructor(Game, World, x, y, width, height) {
            this.Game = Game;
            this.ctx = Game.CONTEXT;
            this.World = World;
            this.pos = new Vector(x || 0, y || 0);
            this.width = width || Game.STAGE.width;
            this.height = height || Game.STAGE.height;
            this.ents = [];
        }

        /**
         * If (GAME.debug) this method draws the Origin and Boundingbox of the Entity
         * @method debugDraw
         */
        debugDraw() {
            this.ctx.strokeStyle="rgb(0,255,0)"; // Green
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([10,5]);
            var _wMod = 0,
                _hMod = 0;
            
            if (this.World.cells.length == 1) {
                this.ctx.strokeRect(this.pos.x + 1, this.pos.y + 1, this.width - 2, this.height - 2);
            } else {
                this.ctx.beginPath();

                if (this.pos.x == this.World.width - this.width) {
                    _wMod = -1;
                }

                if (this.pos.y == this.World.height - this.height) {
                    _hMod = -1;
                }

                if (this.pos.x == 0) {
                    this.ctx.moveTo(this.pos.x + 1, this.pos.y + 1);
                    this.ctx.lineTo(this.pos.x + 1, this.pos.y + this.height + _hMod);
                    this.ctx.moveTo(this.pos.x + 1, this.pos.y + 1);
                }

                if (this.pos.y == 0) {
                    this.ctx.moveTo(this.pos.x + 1, this.pos.y + 1);
                    this.ctx.lineTo(this.pos.x + this.width + _wMod, this.pos.y + 1);
                }
                
                this.ctx.moveTo(this.pos.x + this.width + _wMod, this.pos.y);
                this.ctx.lineTo(this.pos.x + this.width + _wMod, this.pos.y + this.height + _hMod);
                this.ctx.lineTo(this.pos.x, this.pos.y + this.height + _hMod);
                this.ctx.stroke();
            }
            this.ctx.setLineDash([]);
        }
    }
