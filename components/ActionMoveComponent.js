const ApeECS = require('ape-ecs');

class ActionMoveComponent extends ApeECS.Component{}

ActionMoveComponent.properties = {
	actions: [],
	hello: "world",
	name: "",
	x: 0,
	y: 0
}

exports.ActionMoveComponent = ActionMoveComponent;