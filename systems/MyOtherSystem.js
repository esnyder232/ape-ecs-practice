const ApeECS = require('ape-ecs');

class MyOtherSystem extends ApeECS.System {

	init() {
		console.log('MyOtherSystem init');

		this.queryArr = [];

		this.moveQuery = this.createQuery()
		.fromAll('PositionComponent').persist();

		// this.moveQuery = this.world.createQuery()
		// .fromAll("PositionComponent");

		//var results = this.moveQuery.execute();

		console.log('MyOtherSystem results: ' + 0);
	}

	update(tick) {
		console.log('MyOtherSystem updated ' + tick);

		// this.moveQuery = this.world.createQuery()
		// .fromAll("PositionComponent");

		//const entities = this.moveQuery.execute();


		var temp = this.createQuery()
		.fromAll('PositionComponent').persist();

		temp.execute();

		this.queryArr.push(temp);

		console.log('MyOtherSystem update results: ' + temp.results.size);

		// if(tick === 3)
		// {
		// 	console.log('Action System Update: tick 3');

		// 	console.log('Adding another entity');
		// 	this.entityE = this.world.createEntity({
		// 		components: [
		// 			{
		// 				type: "PositionComponent",
		// 				name: "My Position",
		// 				x: 1,
		// 				y: 2
		// 			}
		// 		]
		// 	});

		// 	var tempResults = this.queryArr[0].execute();

		// 	var stophere = true;
		// }

		
	}
}

exports.MyOtherSystem = MyOtherSystem;
