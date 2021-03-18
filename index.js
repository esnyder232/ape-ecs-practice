const Game = require("./game.js");

console.log('===== ape-ecs-testing START =====');

var theGame = new Game.Game();
theGame.init();
theGame.startGame();

console.log('===== ape-ecs-testing END =====');