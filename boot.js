"use strict";
let Boot = Game.states.Boot;
Boot.start = function() { if (Game.debug) { console.log("Boot State"); } }

Boot.init = function() {
    Game.loadImages([
        "src/img/spritesheet.png"
    ], Game.startState("Play"));
    this.loadingText = "Loading...";
}

Boot.draw = function() {
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "#FFF";
    this.ctx.fillText(this.loadingText, Game.STAGE.center.x - (this.ctx.measureText(this.loadingText).width / 2), Game.STAGE.center.y);

}