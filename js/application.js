$(document).ready(function() {
	console.log('!! ready');

	/*sheet.initControls();

	var spriteo = new sprite();

	spriteo.initPixelArray();
	spriteo.initCanvas();
	spriteo.initCheckerboard();
	spriteo.initTools();
	spriteo.initColorPicker();*/

	application.init();

	$(window).on('beforeunload', function() {
		application.saveState();
	})
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

		$('#page_container').one('domReady', application.onDomReady);
		$('#page_container').load('sheet.html');
		//TODO: WHY CAN'T I GET AN EVENT WHEN THE DOM IS READY???

		State.init();
	},

	onDomReady : function() {
		$('.inline-js').remove();
		application.mSheet.init();
	},

	saveState : function() {
		console.log('#application.saveState');
	}

}