$(document).ready(function() {
	console.log('!! ready');

	sheet.initControls();

	var frameo = new frame();

	frameo.initPixelArray();
	frameo.initCanvas();
	frameo.initCheckerboard();
	frameo.initTools();
	frameo.initColorPicker();
});

var sheet = {

	// array of action objects
	mActionsArr : [],

	initControls : function() {
		$('#i_choose_file').change(sheet.loadSpriteSheet);
		$('#b_save_sheet').click(sheet.saveSpriteSheet);
		$('#b_toggle_checkerboard').click(sheet.toggleCheckerboard);
	},

	saveSpriteSheet : function() {
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
	},

	loadSpriteSheet : function(e) {
		var f = e.target.files[0];
		var r = new FileReader();
		r.onload = function(e) {
			var jsonObj = JSON.parse(e.target.result);
			frame.clearCanvas(frame.mContext);
			frame.drawCanvasFromPixelArray(jsonObj.actions[0].sprites[0].pixel_array, frame.mContext);
		};
		r.readAsText(f);
	},

	toggleCheckerboard : function(e) {
		if($('#canvas_checkerboard').hasClass('hidden')) {
			$('#canvas_checkerboard').removeClass('hidden');
			$(e.target).html('Checkerboard off');
		} else {
			$('#canvas_checkerboard').addClass('hidden');
			$(e.target).html('Checkerboard on');
		}
	}

};