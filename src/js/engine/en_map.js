"use strict";
/**
 * Map Class
 * @typedef {{}} WorldMap
 * 
 * TO-DO:
 *  - Modify draw() to only call if camera position has changed since last draw
 */
    class WorldMap {
        /**
         * Contains map data for the World
         * @constructor
         * @param {{}} ctx Game Context
         * @param {{}} Cell Pointer to containing Cell
         * @param {String} src Source Image
         * @param {Number} tileWidth Tile Width
         * @param {Number} tileHeight Tile Height
         * @param {Array} data Map Array
         */
        constructor(ctx, Cell, src, tileWidth, tileHeight, data) {
            this.ctx = ctx,
            this.Cell = Cell,
            this.src = src,
            this.srcWidth = src.width,
            this.srcHeight = src.height,
            this.tileWidth = tileWidth,
            this.tileHeight = tileHeight,
            this.data = data
        }

        /**
         * Draws the map
         * @method draw
         */
        draw() {
            for (var a = 0; a < this.data.length; a++) {
                let tile = this.data[a];

                if (tile != -1) { // -1 is empty space
                // Converts 1 dimensional array into useable tilesheet
                    var source_x = (tile % this.srcWidth) * this.tileWidth,
                        source_y = Math.floor(tile / this.srcHeight) * this.tileHeight,
                        dest_x = (a % (this.Cell.width / this.tileWidth)) * this.tileWidth,
                        dest_y = Math.floor(a / (this.Cell.height / this.tileHeight)) * this.tileHeight;

                // Draws tile to screen
                    this.ctx.drawImage(
                        this.src,
                        source_x,
                        source_y,
                        this.tileWidth,
                        this.tileHeight,
                        dest_x,
                        dest_y,
                        this.tileWidth,
                        this.tileHeight
                        );
                }
            }
        }
    }