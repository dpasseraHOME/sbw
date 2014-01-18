var State = {

	mSheetObj : {},

	init : function() {
		State.mSheetObj = {};
		State.mSheetObj.metaData = {};
		State.mSheetObj.actions = [];
	},

	addAction : function(nameStr) {
		var action = {};
		action.metadata = {};
		action.metadata.name = nameStr;
		action.sprites = [];

		State.mSheetObj.actions.push(action);
	},

	removeAction : function() {
		//TODO:
	},

	addSprite : function(pixelArr, actionIndex) {
		var sprite = {};
		sprite.metadata = {};
		sprite.pixel_array = pixelArr;

		State.mSheetObj.actions[actionIndex].sprites.push(sprite);
	},

	updateSprite : function(pixelArr, spriteIndex, actionIndex) {
		State.mSheetObj.actions[actionIndex].sprites[spriteIndex].pixel_array = pixelArr;
	},

	removeSprite : function() {
		//TODO:
	}

};