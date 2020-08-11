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
            this.map = null;
            this.render = true;

            if (this.World.map !== null) {
                let si = this.pos.x + (this.pos.y * this.width), // Starting Index
                    ei = si + (this.width * this.height) / (this.World.map.tileWidth * this.World.map.tileHeight); // Ending Index

                this.map = new WorldMap(
                    this.ctx,
                    this,
                    this.World.map.src,
                    this.World.map.tileWidth,
                    this.World.map.tileHeight,
                    this.World.map.data.slice(si,ei)
                );
            }
        }

        /**
         * Update Method for the Cell
         * Draws Entities and Map if cell is close enough to the Camera's followed Entity
         * @method update
         */
        update() {
        // Followed Entity's (player's) current Cell
            if (this.World.camera.follow !== null) {
                let _cell = this.World.camera.follow.Cell.pos,
                    _w = this.width * this.World.cellBuffer,
                    _h = this.height * this.World.cellBuffer,
                    _x = this.pos.x,
                    _y = this.pos.y;
                
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
                    this.render = true;
                    this.ents.forEach((ent) => {
                        ent.render = true;
                    });
                } else {
                    this.render = false;
                    this.ents.forEach((ent) => {
                        ent.render = false;
                    });
                }
            }
        };

        /**
         * Draw function for the cell - primarily to draw the map
         * @method draw
         */
        draw() {
            if (this.render && this.map !== null) {
                this.map.draw();
            }
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
