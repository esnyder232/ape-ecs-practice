const ApeECS = require('ape-ecs');
const {performance} = require('perf_hooks');
const PositionComponent = require('./components/PositionComponent.js');
const ActionMoveComponent = require('./components/ActionMoveComponent.js');
const InventorySlotComponent = require('./components/InventorySlotComponent.js');
const BottleComponent = require('./components/BottleComponent.js');

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
		this.world = new ApeECS.World({
			useApeDestroy: true
		});

		//register components
		this.world.registerComponent(PositionComponent.PositionComponent, 10);
		this.world.registerComponent(ActionMoveComponent.ActionMoveComponent, 10);
		this.world.registerComponent(InventorySlotComponent.InventorySlotComponent, 10);
		this.world.registerComponent(BottleComponent.BottleComponent, 10);
		
		//register tags
		this.world.registerTags("Character", "PlayerControlled", "MyTag1", "MyTag2", "MyTag3", "MyTag4");
		
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
					name: "My Position AAA",
					x: 1,
					y: 2,
					key: "myFirstPosition"
				},
				// {
				// 	type: "PositionComponent",
				// 	name: "My Position 22222",
				// 	x: 111,
				// 	y: 2222
				// },
				{
					type: "ActionMoveComponent",
					name: "My Action Move",
					key: "myActionnnnnn"
				}
			]
		});

		this.entityB = this.world.createEntity({
			components: [
				{
					type: "PositionComponent",
					name: "My Position BBB",
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

		//testing a query
		this.myQuery = this.world.createQuery().fromAll("PositionComponent");
		var myQueryResults = this.myQuery.execute();
		console.log('game init query results: ' + myQueryResults.size);

		//getting properties of entites
		var posA = this.entityA.getComponents("PositionComponent");

		console.log('entity id is: ' + this.entityA.id);
		for(const ctype of Object.keys(this.entityA.types))
		{
			for(const component of this.entityA.types[ctype])
			{
				console.log('type is: ' + ctype + ". Id: " + component.id);
			}
		}

		var hasResult = this.entityA.has("ActionMoveComponent");
		var hasResult2 = this.entityB.has("ActionMoveComponent");
		

		var posSet = this.entityA.getComponents("PositionComponentasdf");
		var posOne = this.entityA.getOne("PositionComponent");


		this.entityA.addTag("MyTag1");
		this.entityA.removeTag("MyTag2");

		//adding components
		this.entityA.addComponent({
			type: "PositionComponent",
			key: "myPositionAgain",
			x: 123,
			y: 321
		});

		//removeing components
		this.entityA.removeComponent(this.entityA.c.myPositionAgain);
		this.entityA.removeComponent(this.entityA.c.myPositionAgain);


		var obj = this.entityA.getObject();

		//destroy entity
		// var qs = this.world.createQuery().from(entityA);

		// this.entityA.destroy();

		// var qs = this.world.createQuery().from(entityA);


		this.entityF = this.world.createEntity({
			c: {
				PositionComponent: {
					x: 777,
					y: 908
				},
				PositionComponent: {
					x: 9,
					y: 12
				}
			}
		})






		//////////////////////////////////////////
		// testing entity refs
		var bottle = this.world.createEntity({
			tags:["MyTag2"],
			components: [
				{
					type: "BottleComponent",
					liquid: "lava",
					amount: 0.75
				}
			]
		});

		var bottle2 = this.world.createEntity({
			tags:["MyTag2", "MyTag1"],
			components: [
				{
					type: "BottleComponent",
					liquid: "lava2",
					amount: 0.75
				}
			]
		});
		

		var npc = this.world.createEntity({
			tags: ["Character"],
			c: {
				rightHand: {
					type: "InventorySlotComponent"
				},
				leftHand: {
					type: "InventorySlotComponent"
				}
			}
		});

		var npc2 = this.world.createEntity({
			tags: ["Character", "MyTag2"],
			components: [
				{
					type: "InventorySlotComponent",
					name: "Left Hand"
				},
				{
					type: "InventorySlotComponent",
					name: "Right Hand"
				}
			]
		});

		var npc3 = this.world.createEntity({
			tags: ["Character"],
			c: {
				rightHand: {
					type: "InventorySlotComponent"
				},
				leftHand: {
					type: "InventorySlotComponent"
				}
			}
		});

		var npc4 = this.world.createEntity({
			tags: ["Character", "MyTag4"],
			components: [
				{
					type: "InventorySlotComponent",
					name: "Left Hand"
				},
				{
					type: "InventorySlotComponent",
					name: "Right Hand"
				}
			]
		});

		
		npc.c.rightHand.slot = bottle;
		var npc2LeftHand = null;
		var npc4LeftHand = null;

		for(var c of npc2.getComponents("InventorySlotComponent")) {
			if(c.name === "Left Hand")
			{
				npc2LeftHand = c;
			}
		}

		for(var c of npc4.getComponents("InventorySlotComponent")) {
			if(c.name === "Left Hand")
			{
				npc4LeftHand = c;
			}
		}

		npc2LeftHand.slot = bottle2;
		npc4LeftHand.slot = bottle2;

		console.log(npc.c.rightHand.slot === bottle);

		//now query going from the bottle -> Inventory -> entity
		var allCharacterResults = this.world.createQuery().fromAll("Character").execute();

		var fromReverseQuery = this.world.createQuery().fromReverse(bottle, "rightHand");
		var myEntityRefResults = fromReverseQuery.execute();

		//querying again
		//...well, it works....pretty janky though.
		var npcFromBottle = this.world.createQuery().fromReverse(bottle2, "").execute();


		//testing more queries
		//gets all entities that have MyTag2 tag on them
		var q1 = this.world.createQuery().fromAll("MyTag2").execute();

		/*
		Gets all entites that have MyTag2 tag on them OR any entity that has the Character tag on them.
		It does NOT work as they say it does in the api: "must have MyTag2 component Type or tag AND must have one or more of Character"
		
		They are claiming it works like this:

		select entitId
		from (
			select distinct c.entityId
			from components c
			where c.type = 'MyTag2'
		) fromAll
		inner join (
			select distinct c.entityId
			from tags t
			where t.type in ('Character', 'Character2')
		) fromAny on fromAll.entityId = fromAny.entityId



		However, it instead works like this:
			
			select distinct c.entityId
			from components c
			where c.type = 'MyTag2'
		
			union all
			
			select distinct c.entityId
			from tags t
			where t.type = 'Character'			

		*/
		var q2 = this.world.createQuery().fromAll("MyTag2").fromAny("Character", "Character2").execute(); 

		var q3 = this.world.createQuery({
			all: ["MyTag2"],
			any: ["Character"]
		}).execute();


		var q4 = this.world.createQuery().from(npc2, npc4).execute();
		var q5 = this.world.createQuery().fromAll("Character").from(npc2, npc4).execute();



		
		var q6 = this.world.createQuery().fromAll("Character").execute();
		var q7 = this.world.createQuery().fromAll("Character").not("MyTag2").execute();



		var q8 = this.world.createQuery().fromAll("Character").execute();
		var q9 = this.world.createQuery().fromAll("Character").only("MyTag2").execute();
		var q10 = this.world.createQuery().fromAll("Character").only("MyTag2","MyTag4").execute();



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