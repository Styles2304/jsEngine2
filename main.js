"use strict"

// Create Game
    const Game = new GAME("gameContainer", 400, 400, 30);

// States
    Game.addState("Boot", ["start", "init"], ["draw"]);
    Game.addState("Play", ["start", "init"], ["update", "draw"]);

// Start State
    Game.startState("Boot");