$(document).ready(function() {
	console.log('!! ready');

	drawing.initPixelArray();
	drawing.initCanvas();
	drawing.initTools();
});

var drawing = {

	PENCIL : 'pencil',
	ERASER : 'eraser',

	mContext : null,
	mIsLineStarted : false,
	mIsMouseDown : false,
	//* Number of sprite 'pixels' wide and high.
	mCountPixelsX : 32,
	mCountPixelsY : 32,
	//* Number of screen pixels per sprite 'pixel'.
	mPixelSize : 10,

	//* 3D array representing the pixel grid.
	mPxArr : [],
	//* Hex value of transparent (erased) color. Hex transparencies range 00 - FF.
	mTransColor : '(0, 0, 0, 0)',
	//* Hex value of WIP pencil color.
	mPencilColor : '(0, 0, 0, 1)',
	//* Hex value of currently selected color.
	mSelColor : null,

	/**
	*	Initialize grid with transparent pixels at all locations.
	**/
	initPixelArray : function() {
		var i, j;

		for(i=0; i<drawing.mCountPixelsX; i++) {
			drawing.mPxArr[i] = [];
			for(j=0; j<drawing.mCountPixelsY; j++) {
				drawing.mPxArr[i][j] = drawing.mTransColor;
			}
		}
	},

	initCanvas : function() {
		console.log('# initCanvas');

		var canvas = document.getElementById('canvas_draw');
		drawing.mContext = canvas.getContext('2d');
		if(!drawing.mContext) {
			console.log('!! Error: failed to getContext');
			return;
		}

		// set sprite pixel size based on number of sprite pixels and width of canvas
		drawing.mPixelSize = $('#canvas_draw').width() / drawing.mCountPixelsX;

		// set initial selected color
		drawing.onSelectColor(drawing.mPencilColor);

		$('#canvas_draw').mousemove(function(e) {
			drawing.onMouseMoveOverCanvasDraw(e);
		});
		$('#canvas_draw').mousedown(function() {
			drawing.mIsMouseDown = true;
		});
		$(document).mouseup(function() {
			drawing.mIsMouseDown = false;
		});
	},

	initTools : function() {
		$('#a_tool_pencil').click({toolType: drawing.PENCIL}, drawing.onToolClick);
		$('#a_tool_eraser').click({toolType: drawing.ERASER}, drawing.onToolClick);
	},

	onMouseMoveOverCanvasDraw : function(e) {
		// console.log(e.pageX+', '+e.pageY);

		var x = e.pageX - $(e.target).offset().left;
		var y = e.pageY - $(e.target).offset().top;

		var pxX, pxY;

		if(drawing.mIsMouseDown) {
			// changes value in pixel color array
			pxX = Math.floor(x/10);
			pxY = Math.floor(y/10);
			// console.log(pxX+', '+pxY);
			drawing.mPxArr[pxX][pxY] = drawing.mSelColor;

			// draw sprite pixel
			if(drawing.mSelColor == drawing.mTransColor) {
				// is erasing
				drawing.mContext.clearRect(pxX*drawing.mPixelSize, pxY*drawing.mPixelSize, drawing.mPixelSize, drawing.mPixelSize);
			} else {
				// is drawing
				drawing.mContext.fillRect(pxX*drawing.mPixelSize, pxY*drawing.mPixelSize, drawing.mPixelSize, drawing.mPixelSize);
			}
		}
	},

	onToolClick : function(e) {
		console.log('# onToolClick: '+e.data.toolType);

		switch(e.data.toolType) {
			case drawing.PENCIL:
				drawing.onSelectColor(drawing.mPencilColor);
				break;
			case drawing.ERASER:
				drawing.onSelectColor(drawing.mTransColor);
				break;
		};
	},

	onSelectColor : function(rgbaStr) {
		console.log('# onSelectColor: '+rgbaStr);
		drawing.mSelColor = rgbaStr;
		drawing.mContext.fillStyle = 'rgba'+rgbaStr;
	}

};