const ApeECS = require('ape-ecs');

class ActionSystem extends ApeECS.System {

	init() {
		console.log('actionSystem init');

		this.queryArr = [];

		this.moveQuery = this.createQuery()
		.fromAll('PositionComponent').persist();

		// this.moveQuery = this.world.createQuery()
		// .fromAll("PositionComponent");

		//var results = this.moveQuery.execute();

		console.log('actionSystem results: ' + 0);
	}

	update(tick) {
		console.log('actionSystem updated ' + tick);

		// this.moveQuery = this.world.createQuery()
		// .fromAll("PositionComponent");

		//const entities = this.moveQuery.execute();


		var temp = this.createQuery()
		.fromAll('PositionComponent').persist();

		temp.execute();

		this.queryArr.push(temp);

		console.log('actionSystem update results: ' + temp.results.size);

		if(tick === 3)
		{
			console.log('Action System Update: tick 3');

			console.log('Adding another entity');
			this.entityE = this.world.createEntity({
				components: [
					{
						type: "PositionComponent",
						name: "My Position",
						x: 1,
						y: 2
					}
				]
			});

			var tempResults = this.queryArr[0].execute();

			this.world.updateIndexes();

			var tempResults2 = this.queryArr[0].execute();

			var stophere = true;
		}


		////////////////////////////////////////////////////////
		// STOPPED HERE
		// Make another system (myOtherSystem.js) and test if making changes to one entity (or adding an entity) in ActionSystem affects the persisted queries in the other systems
		// - yes, it does. But not immediately. the ape-ecs library ONLY updates ANY persisted query results when "world.updateIndexes()" is called.
		// - world.updateIndexes() is called:
		//   - automatically before each individual system runs (in _preUpdate() in world source code)
		//   - can be called manually by user code by calling "world.updateIndexes()"
		//
		// I BELIEVE it should, but only at the beginning of the other system (system._preupdate()).
		// Also test if running this.world.updateIndexes() will affect the current persisted queries in ActionSystem (and other system too...why not)
		// - it does.
		
	}
}

exports.ActionSystem = ActionSystem;
