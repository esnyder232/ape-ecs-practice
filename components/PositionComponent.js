const ApeECS = require('ape-ecs');

class PositionComponent extends ApeECS.Component{}

PositionComponent.properties = {
	x: 0,
	y: 0,
	name: ""
}

exports.PositionComponent = PositionComponent;