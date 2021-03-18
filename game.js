const ApeECS = require('ape-ecs');
const {performance} = require('perf_hooks');
const PositionComponent = require('./components/PositionComponent.js');
const ActionMoveComponent = require('./components/ActionMoveComponent.js');
const ActionSystem = require('./systems/ActionSystem.js');
const MyOtherSystem = require('./systems/MyOtherSystem.js');

class Game {
	constructor() {
		this.runGameLoop = false;
		this.frameRate = 60;
		this.physicsTimeStep = 1/this.frameRate; //seconds
		this.frameTimeStep = 1000/this.frameRate; //ms
		this.previousTick = 0;

		this.frameNum = 0;
		
		//ECS stuff
		this.world = null;
	}

	init() {
		console.log('game init');
		this.world = new ApeECS.World();

		//register components
		this.world.registerComponent(PositionComponent.PositionComponent, 10);
		this.world.registerComponent(ActionMoveComponent.ActionMoveComponent, 10);
		
		//register tags
		this.world.registerTags("Character", "PlayerControlled");
		
		//register Systems
		this.world.registerSystem("everyFrame", ActionSystem.ActionSystem);
		this.world.registerSystem("everyFrame", MyOtherSystem.MyOtherSystem);

		//query for some reason
		this.playerQuery = this.world.createQuery().fromAll("PlayerControlled", "MoveAction");

		//create some entities
		console.log('adding entities....');
		this.entityA = this.world.createEntity({
			components: [
				{
					type: "PositionComponent",
					name: "My Position",
					x: 1,
					y: 2
				},
				// {
				// 	type: "PositionComponent",
				// 	name: "My Position 22222",
				// 	x: 111,
				// 	y: 2222
				// },
				{
					type: "ActionMoveComponent",
					name: "My Action Move"
				}
			]
		});

		this.entityB = this.world.createEntity({
			components: [
				{
					type: "PositionComponent",
					name: "My Position",
					x: 1,
					y: 2
				}
			]
		});

		this.entityC = this.world.createEntity({
			components: [
				{
					type: "ActionMoveComponent",
					name: "My Action Move"
				}
			]
		});

		this.myQuery = this.world.createQuery().fromAll("PositionComponent");
		var myQueryResults = this.myQuery.execute();
		
		console.log('game init query results: ' + myQueryResults.size);

		console.log('game init done');

		var stopHere = true;
		
	}

	update(dt) {
		console.log('---- Game Loop Frame: ' + this.frameNum + " ----");

		if(this.frameNum === 3)
		{
			console.log('Adding another entity');
			this.entityD = this.world.createEntity({
				components: [
					{
						type: "PositionComponent",
						name: "My Position",
						x: 1,
						y: 2
					}
				]
			});
		}

		//run systems and update ecs world
		this.world.runSystems("everyFrame");
		this.world.tick();

		this.frameNum++;
	}


	startGame() {
		if(!this.runGameLoop)
		{
			this.runGameLoop = true;
			this.gameLoop();
		}
	}

	stopGame() {
		if(this.runGameLoop)
		{
			this.runGameLoop = false;
		}
	}

	gameLoop() {
		var nowTime = performance.now();

		//if its the designated time has passed, run the update function
		if(this.previousTick + (this.frameTimeStep) < nowTime)
		{
			this.previousTick = nowTime;
			this.update(this.frameTimeStep);
		}

		//set either the sloppy timer (setTimeout) or accurate timer (setImmediate)
		if(nowTime - this.previousTick < (this.frameTimeStep))
		{
			//call the sloppy timer
			if(this.runGameLoop)
			{
				setTimeout(this.gameLoop.bind(this), 1);
			}
		}
		else
		{
			//call the accurate timer
			setImmediate(this.gameLoop.bind(this));
		}
	}


}

exports.Game = Game;