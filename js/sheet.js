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
		sprite.pixel_array = frame.mPxArr;

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
			frame.clearCanvas(frame.mContext);
			frame.drawCanvasFromPixelArray(jsonObj.actions[0].sprites[0].pixel_array, frame.mContext);
		};
		r.readAsText(f);
	}

	this.onNewActionClick = function() {
		var action = new Action(this.mActionsArr.length);
		this.mActionsArr.push(action);

		$('#action_thumbnail_container').one('domReady', $.proxy(this.onActionLoadComplete, this));
		$('#temp_actions').load('action_thumbnail.html', function(){
			$('#action_thumbnail_container').append($('.action-thumbnail.temp'));
			$('.action-thumbnail.temp').removeClass('temp');
		});
	}

	this.onActionLoadComplete = function() {
		$('.inline-js').remove();

		this.mActionsArr[this.mActionsArr.length-1].init();
	}

};