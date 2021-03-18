const ApeECS = require('ape-ecs');

class PositionComponent extends ApeECS.Component{
	preInit(initialValues)
	{
		console.log("Popsition Component preinit called!!!");
		console.log(initialValues);

		initialValues.hello = "WOIRLDLDLDLDLDLDL";
		return initialValues;
	}

	init(initialValues) 
	{
		console.log("Popsition Component INIT called!!!");
		console.log(initialValues);
	}

	setx(newX) {
		this.x = newX
	}

	

}

PositionComponent.properties = {
	x: 0,
	y: 0,
	name: ""
}


PositionComponent.changeEvents = true;

exports.PositionComponent = PositionComponent;