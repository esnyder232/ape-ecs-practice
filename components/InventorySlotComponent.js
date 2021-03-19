const ApeECS = require('ape-ecs');

class InventorySlotComponent extends ApeECS.Component{}

InventorySlotComponent.properties = {
	name: 'Right Hand',
	slotType: 'any',
	slot: ApeECS.EntityRef
}

exports.InventorySlotComponent = InventorySlotComponent;