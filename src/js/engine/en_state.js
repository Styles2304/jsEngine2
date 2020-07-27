"use strict";
/** State Class */
    class State {
        /**
         * 
         * @param {{}} Game Reference to the master GAME object
         * @param {[]} oneTime Array of functions to only call once
         * @param {[]} doLoop Array of functions to call every frame
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
                            // Add Draw functions

                            if (that.Game.debug) {
                                that.curWorld.debugDraw();
                            }

                            that.curWorld.ents.forEach(function(ent) {
                                ent.drawEnt();
                                ent.debugDraw();
                            });
                        }

                        that[that.doLoop[a]]();
                    }
                }, 1000 / this.Game.FPS);
        }

        addWorld(width, height) { this.worlds.push(new World(this.Game, width, height)); }
    }