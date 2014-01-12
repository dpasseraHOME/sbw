$(document).ready(function() {
	console.log('!! ready');

	/*sheet.initControls();

	var frameo = new frame();

	frameo.initPixelArray();
	frameo.initCanvas();
	frameo.initCheckerboard();
	frameo.initTools();
	frameo.initColorPicker();*/

	application.init();
});

var application = {

	sheet : {},

	init : function() {
		$('#page_container').load('application.html', application.onApplicationLoadComplete);
	},

	onApplicationLoadComplete : function() {
		application.initControls();
	},

	initControls : function() {
		$('#b_new_sheet').click(application.onNewSheetClick);
	},

	onNewSheetClick : function() {
		application.createNewSheet();
	},

	createNewSheet : function() {
		sheet = new Sheet();
		$('#page_container').load('sheet.html'/*, sheet.init()*/);
		//TODO: WHY CAN'T I GET AN EVENT WHEN THE DOM IS READY???
		// Temporary solution is to use inline JS to call init on sheet
	}

}