"use strict"

// Create Game
    const Game = new GAME("gameCanvas", "gameContainer", 800, 400, 30, true);

// States
    Game.addState("Boot", ["start", "init"], ["update", "draw"]);

// Start State
    Game.startState("Boot");