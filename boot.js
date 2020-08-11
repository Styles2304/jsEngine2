"use strict";
let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }

Boot.init = function() {
    this.loaded = false;
    Game.loadImages([
        ["src/img/spritesheet.png", "spriteSheet", 276, 281],
        ["src/img/tilesheet.png", "tileSheet", 48, 16]
    ], this.loaded = true);
    this.loadingText = "Loading...";
    this.continueText = "Press Spacebar";
}

Boot.draw = function() {
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "#FFF";

    if (this.loaded) {
        this.ctx.fillText(this.continueText, Game.STAGE.center.x - (this.ctx.measureText(this.continueText).width / 2), Game.STAGE.center.y);
        // if (Game.keys.space) { Game.startState("Play"); }
        Game.startState("Play");
    } else {
        this.ctx.fillText(this.loadingText, Game.STAGE.center.x - (this.ctx.measureText(this.loadingText).width / 2), Game.STAGE.center.y);
    }
}