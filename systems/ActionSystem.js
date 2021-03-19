const ApeECS = require('ape-ecs');

class ActionSystem extends ApeECS.System {

	init() {
		console.log('actionSystem init');

		this.queryArr = [];

		this.moveQuery = this.createQuery()
		.fromAll('PositionComponent').persist();



		//registering to events
		this.subscribe("PositionComponent");



		console.log('actionSystem results: ' + 0);
	}

	update(tick) {
		console.log('actionSystem updated ' + tick);

		// this.moveQuery = this.world.createQuery()
		// .fromAll("PositionComponent");

		//const entities = this.moveQuery.execute();


		var temp = this.createQuery({
			includeApeDestroy: true
		})
		.fromAll('PositionComponent').persist();

		temp.execute();

		this.queryArr.push(temp);

		console.log('actionSystem update results: ' + temp.results.size);


		//go throuhg changes so we can look at individual components
		for(var i = 0; i < this.changes.length; i++)
		{
			var comp = this.world.getComponent(this.changes[i].component);
			
			if(comp !== undefined)
			{
				var stopHere = true;
			}
		}

		if(tick === 3)
		{
			console.log('Action System Update: tick 3');

			// console.log('Adding another entity');
			// this.entityE = this.world.createEntity({
			// 	components: [
			// 		{
			// 			type: "PositionComponent",
			// 			name: "My Position",
			// 			x: 1,
			// 			y: 2
			// 		}
			// 	]
			// });

			// this.world.updateIndexes();

			//also destroy stuff for testing
			var entIterator = temp.results.values();
			var firstEnt = entIterator.next().value;
			var secondEnt = entIterator.next().value;

			//destroy a component on first entity
			// firstEnt.removeComponent(firstEnt.getOne("PositionComponent"));

			// this.world.updateIndexes();

			this.moveQuery = null;

			
			//destroy an entity (manual way)
			//firstEnt.destroy();

			//destroy an entity (ApeDestroy way)
			firstEnt.addTag("ApeDestroy");
			

			var stophere = true;
		}

		if(tick === 4)
		{
			var stophere = true;
		}
	}
}

exports.ActionSystem = ActionSystem;
