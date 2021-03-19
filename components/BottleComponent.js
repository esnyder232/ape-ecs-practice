const ApeECS = require('ape-ecs');

class BottleComponent extends ApeECS.Component{}

BottleComponent.properties = {
	liquid: 'water',
	amount: 1
}

exports.BottleComponent = BottleComponent;