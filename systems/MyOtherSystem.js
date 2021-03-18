const ApeECS = require('ape-ecs');

class MyOtherSystem extends ApeECS.System {

	init() {
		console.log('MyOtherSystem init');

		this.queryArr = [];

		this.moveQuery = this.createQuery()
		.fromAll('PositionComponent').persist();
	}

	update(tick) {
		console.log('MyOtherSystem updated ' + tick);

		var ents = this.moveQuery.execute();
		for(var e of ents) {
			//update the position components by x += 1;
			for(var pc of e.getComponents("PositionComponent"))
			{
				pc.update({
					x: pc.x+1
				})
			}
		}
	}
}

exports.MyOtherSystem = MyOtherSystem;
