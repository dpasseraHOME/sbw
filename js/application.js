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

	mSheet : {},

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
		application.mSheet = new Sheet();
		console.log(application.mSheet);

		$('#page_container').one('domReady', /*$.proxy(sheet.init, sheet)*/ application.onDomReady);
		$('#page_container').load('sheet.html');
		//TODO: WHY CAN'T I GET AN EVENT WHEN THE DOM IS READY???
	},

	onDomReady : function() {
		$('.inline-js').remove();
		application.mSheet.init();
	}

}