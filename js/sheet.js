function Sheet() {

	// array of action objects
	this.mActionsArr = [];

	this.currentActionIndex = -1;

	this.init = function() {
		console.log('#Sheet.init');
		this.initControls();
	}

	this.initControls = function() {
		console.log('#Sheet.initControls');
		$('#i_choose_file').change($.proxy(this.loadSpriteSheet, this));
		$('#b_save_sheet').click($.proxy(this.saveSpriteSheet, this));
		$('#b_new_action').click($.proxy(this.onNewActionClick, this));
	}

	this.saveSpriteSheet = function() {
		var jsonObj = {};

		jsonObj.metadata = {};
		jsonObj.metadata.name = 'test_sheet';

		jsonObj.actions = {};
		jsonObj.actions = [];

		var action = {};
		action.metadata = {};
		action.metadata.name = 'action_1';
		action.sprites = [];

		var sprite = {};
		sprite.metadata = {};
		sprite.metadata.name = 'sprite_1';
		sprite.pixel_array = sprite.mPxArr;

		action.sprites.push(sprite);

		jsonObj.actions.push(action);

		var jsonText = JSON.stringify(jsonObj);

		var blob = new Blob([jsonText], {type: "text/plain;charset=utf-8"});
		saveAs(blob, 'test.sbs');
	}

	this.loadSpriteSheet = function(e) {
		var f = e.target.files[0];
		var r = new FileReader();
		r.onload = function(e) {
			var jsonObj = JSON.parse(e.target.result);
			sprite.clearCanvas(sprite.mContext);
			sprite.drawCanvasFromPixelArray(jsonObj.actions[0].sprites[0].pixel_array, sprite.mContext);
		};
		r.readAsText(f);
	}

	this.onNewActionClick = function() {
		var action = new Action(this.mActionsArr.length);
		this.mActionsArr.push(action);

		$('#action_thumbnail_container').one('domReady', $.proxy(this.onActionLoadComplete, this));
		$('#temp_container').load('action_thumbnail.html');

		try {
			State.addAction('action_'+State.mSheetObj.actions.length);
		} catch(err) {
			State.addAction('action_0');
		}
	}

	this.onActionLoadComplete = function() {
		$('.inline-js').remove();

		$('#action_thumbnail_container').append($('.action-thumbnail.temp'));

		this.mActionsArr[this.mActionsArr.length-1].init($('.action-thumbnail.temp'));
		
		$('.action-thumbnail.temp').removeClass('temp');
	}

};