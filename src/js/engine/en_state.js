"use strict";
/**
 * State Class
 * @typedef {{}} State
 */
    class State {
        /**
         * A State is a self contained Object with it's own Worlds and Entities that behave differently from each other.
         * Equivalent to things like the main menu, game play, and pause menu
         * @constructor
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
        // oneTime
            var _tempInterval = setInterval(() => {
            for (var a = 0; a < this.oneTime.length; a++) {
                if (this.oneTime[a] == "init") {
                    if (!this.initialized) {
                        this[this.oneTime[a]]();

                    // Runs the init functions for any pre-created entities in the current World
                        Object.keys(this.curWorld.ents).forEach((key) => {
                            let _ent = this.curWorld.ents[key];
                            if (!_ent.initialized) {
                                _ent.classInit();
                                _ent.init();
                                _ent.initialized = true;
                            }
                        });

                        this.initialized = true;
                    }
                } else {
                // Executes all other "oneTime" 
                    this[this.oneTime[a]]();
                }
            }

            clearInterval(_tempInterval);
            });

        // doLoop
            this.runInterval = setInterval(() => {
                // console.log(this);
                this.Game.refresh();

                for (var a = 0; a < this.doLoop.length; a++) {
                // Calls the update functions on children this have it
                    if (this.doLoop[a] == "update") {
                    // Runs update() on the current World
                        this.curWorld.update();

                    // Runs update() on Cells in current World
                        this.curWorld.cells.forEach((cell) => {
                            cell.update();
                        });

                    // Runs update() on Entitys in the current World
                        this.curWorld.ents.forEach((ent) => {
                            ent.classUpdate();
                            ent.update();
                        });
                    } else if (this.doLoop[a] == "draw") { // Calls the debugDraw and draw functions on children that have it
                    // World
                        if (this.Game.debug) { this.curWorld.debugDraw(); }

                    // Cells
                        this.curWorld.cells.forEach((cell) => {
                            if (this.Game.debug) { cell.debugDraw(); }
                        });

                    // Camera
                        if (this.Game.debug) { this.curWorld.cameraDebug(); }

                    // Entities
                        this.curWorld.ents.forEach((ent) => {
                            ent.drawEnt();
                            if (this.Game.debug) { ent.debugDraw(); }
                        });
                    } else {
                        this[this.doLoop[a]]();
                    }
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
