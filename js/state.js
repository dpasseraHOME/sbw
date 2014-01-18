var State = {

	sheetObj : {},

	init : function() {
		console.log('#State.init');
		State.sheetObj = {};
		State.sheetObj.metaData = {};
		State.sheetObj.actions = [];
	},

	addAction : function(nameStr) {
		var action = {};
		action.metadata = {};
		action.metadata.name = nameStr;
		action.sprites = [];

		State.sheetObj.actions.push(action);
	},

	removeAction : function() {
		//TODO:
	},

	addSprite : function(actionIndex) {
		var sprite = {};
		sprite.metadata = {};
		sprite.pixel_array = [];

		State.sheetObj.actions[actionIndex].sprites.push(sprite);
	},

	updateSprite : function(pixelArr, spriteIndex, actionIndex) {
		State.sheetObj.actions[actionIndex].sprites[spriteIndex].pixel_array = pixelArr;
	},

	removeSprite : function() {
		//TODO:
	}

};