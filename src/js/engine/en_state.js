"use strict";
/**
 * State Class
 * @typedef {{}} State
 */
    class State {
        /**
         * A State is a self contained Object with it's own Worlds and Entities that behave differently from each other.
         * Equivalent to things like the main menu, game play, and pause menu
         * @param {GAME} Game Reference to the master GAME object
         * @param {Array} oneTime Array of functions to only call once
         * @param {Array} doLoop Array of functions to call every frame
         */
        constructor(Game, oneTime, doLoop) {
            this.Game = Game;
            this.ctx = Game.CONTEXT;
            this.oneTime = oneTime;
            this.doLoop = doLoop;
            this.initialized = false;
            this.worlds = [];
            this.worlds.push(new World(Game, this.Game.STAGE.width, this.Game.STAGE.height));
            this.curWorld = this.worlds[0];
        }
        
        /**
         * Runs the State by calling the necessary functions of itself
         * and all it's children elements
         * @method run
         */
        run() {
            // Pre-Settings
                let that = this;

            // oneTime
                var _tempInterval = setInterval(function() {
                    for (var a = 0; a < that.oneTime.length; a++) {
                        if (that.oneTime[a] == "init") {
                            if (!that.initialized) {
                                that[that.oneTime[a]]();

                                // Runs the init functions for any pre-created entities in the current World
                                Object.keys(that.curWorld.ents).forEach(key => {
                                    let _ent = that.curWorld.ents[key];
                                    if (!_ent.initialized) {
                                        _ent.classInit();
                                        _ent.init();
                                        _ent.initialized = true;
                                    }
                                });

                                that.initialized = true;
                            }
                        } else {
                            // Executes all other "oneTime" 
                            that[that.oneTime[a]]();
                        }
                    }

                    clearInterval(_tempInterval);
                });

            // doLoop
                this.runInterval = setInterval(function() {
                    that.Game.refresh();

                    for (var a = 0; a < that.doLoop.length; a++) {
                        // Calls the update functions on children that have it
                        if (that.doLoop[a] == "update") {
                            that.curWorld.update();

                            that.curWorld.ents.forEach(function(ent) {
                                ent.classUpdate();
                                ent.update();
                            });
                        }

                        // Calls the debugDraw and draw functions on children that have it
                        if (that.doLoop[a] == "draw") {
                            // World
                            if (that.Game.debug) { that.curWorld.debugDraw(); }

                            // Cells
                            that.curWorld.cells.forEach(function(cell) {
                                if (that.Game.debug) { cell.debugDraw(); }
                            });

                            // Camera
                            if (that.Game.debug) { that.curWorld.cameraDebug(); }

                            // Entities
                            that.curWorld.ents.forEach(function(ent) {
                                ent.drawEnt();
                                if (that.Game.debug) { ent.debugDraw(); }
                            });
                        }

                        that[that.doLoop[a]]();
                    }
                }, 1000 / this.Game.FPS);
        }

        /**
         * Adds a new World space to the current State
         * @method addWorld
         * @param {Number} width Width of the new World
         * @param {Number} height Height of the new World
         */
        addWorld(width, height) { this.worlds.push(new World(this.Game, width, height)); }
    }
