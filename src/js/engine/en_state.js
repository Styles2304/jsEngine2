"use strict";
//=======================================================//
// State Class
//=======================================================//

class State {
    constructor(game, oneTime, doLoop) {
        this.g = game;
        this.oneTime = oneTime;
        this.doLoop = doLoop;
        this.initialized = false;
        this.worlds = [];
        this.worlds.push(new World(game, this.g.STAGE.width, this.g.STAGE.height));
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

                            // Runs the init functions for any pre-created entities in the current world
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
                that.g.refresh();

                for (var a = 0; a < that.doLoop.length; a++) {
                    // Calls the update functions on children that have it
                    if (that.doLoop[a] == "update") {
                        Object.keys(that.curWorld.ents).forEach(key => {
                            that.curWorld.ents[key].classUpdate(key);
                            that.curWorld.ents[key].update();
                        });
                    }

                    // Calls the debugDraw and draw functions on children that have it
                    if (that.doLoop[a] == "draw") {
                        // Add Draw functions

                        if (that.g.debug) {
                            that.curWorld.debugDraw();
                        }

                        Object.keys(that.curWorld.ents).forEach(key => {
                            that.curWorld.ents[key].draw();
                            that.curWorld.ents[key].debugDraw();
                        });
                    }

                    that[that.doLoop[a]]();
                }
            }, 1000 / this.g.FPS);
    }

    addWorld(width, height) { this.worlds.push(new World(this.g, width, height)); }
}