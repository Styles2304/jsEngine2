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
         * @param {Number} x World X Position
         * @param {Number} y World Y Position
         * @param {Number} width Width of Cell
         * @param {Number} height Height of Cell
         */
        constructor(Game, World, x, y, width, height) {
            this.Game = Game;
            this.ctx = Game.CONTEXT;
            this.World = World;
            this.pos = new Vector(x, y);
            this.width = width;
            this.height = height;
            this.ents = [];
        }

        /**
         * Update Method for the Cell
         * @method update
         */
        update() {
        // Renders Entitys if Cell is close enough to the World's Camera's followed Entity (player)
        // Followed Entity's (player's) current Cell
            
            let _cell = this.World.camera.follow.Cell.pos,
                _w = this.width * this.World.cellBuffer,
                _h = this.height * this.World.cellBuffer,
                _x = this.pos.x,
                _y = this.pos.y;

            // [x-w, y-h][  x, y-h][x+w, y-h]
            // [x-w, y  ][  x, y  ][x+w, y  ]
            // [x-w, y+h][  x, y+h][x+w, y+h]
            
            if (
                _x == _cell.x - _w && _y == _cell.y - _h ||
                _x == _cell.x && _y == _cell.y - _h ||
                _x == _cell.x + _w && _y == _cell.y - _h ||

                _x == _cell.x - _w && _y == _cell.y ||
                _x == _cell.x && _y == _cell.y ||
                _x == _cell.x + _w &&  _y == _cell.y ||
                
                _x == _cell.x - _w && _y == _cell.y + _h ||
                _x == _cell.x && _y == _cell.y + _h ||
                _x == _cell.x + _w &&  _y == _cell.y + _h
            ) {
                this.ents.forEach((ent) => {
                    ent.render = true;
                });
            } else {
                this.ents.forEach((ent) => {
                    ent.render = false;
                });
            }
        };

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

        /**
         * Checks whether or the not the Entity is contained within the Cell
         * @param {Entity} ent
         * @returns {Boolean} 
         */
        in(ent) {
            return (
                ent.pos.x >= this.pos.x &&
                ent.pos.x < this.pos.x + this.width &&
                ent.pos.y >= this.pos.y &&
                ent.pos.y < this.pos.y + this.height
            );
        }
    }
