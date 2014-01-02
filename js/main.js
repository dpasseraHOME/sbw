$(document).ready(function() {
	console.log('!! ready');

	drawing.initPixelArray();
	drawing.initCanvas();
	drawing.initTools();
	drawing.initColorPicker();
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

	mSelTool : null,

	//* 3D array representing the pixel grid.
	mPxArr : [],
	//* RGBA value of transparent (erased) color. Hex transparencies range 00 - FF.
	mTransColor : '(0,0,0,0)',
	//* RGBA value of WIP pencil color.
	mLastPencilColor : '(0,0,0,1)',
	//* RGBA value of currently selected color.
	mSelColor : null,
	//* Array of RGBA values of colors used in sprite.
	mUsedColorArr : [],

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
		drawing.onSelectColor(drawing.mLastPencilColor);

		$('#canvas_draw').mousemove(function(e) {
			drawing.onMouseMoveOverCanvasDraw(e);
		});
		$('#canvas_draw').mousedown(function(e) {
			drawing.mIsMouseDown = true;
			// console.log(e);
			drawing.onMouseMoveOverCanvasDraw(e);
		});
		$(document).mouseup(function() {
			drawing.mIsMouseDown = false;
		});
	},

	initTools : function() {
		drawing.mSelTool = drawing.PENCIL;

		$('#b_tool_pencil').click({toolType: drawing.PENCIL}, drawing.onToolClick);
		$('#b_tool_eraser').click({toolType: drawing.ERASER}, drawing.onToolClick);

		$('#b_test_redraw').click(drawing.testRedraw);
	},

	initColorPicker : function() {
		$('.color-box').colpick({
			layout : 'rgbhex',
			color : '000000',
			onSubmit : function(hsb, hex, rgb, el) {
				$(el).css('background-color', '#'+hex);
				$(el).colpickHide();
				drawing.onSelectColor('('+rgb.r+','+rgb.g+','+rgb.b+',1)');
			},
			onChange: function(hsb, hex, rgb, fromSetColor) {
				if(fromSetColor) {
					$('.colpick_submit').click();
				}
			}
		});
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
			// first clear - necessary when using colors with less than full transparency
			drawing.mContext.clearRect(pxX*drawing.mPixelSize, pxY*drawing.mPixelSize, drawing.mPixelSize, drawing.mPixelSize);
			if(drawing.mSelTool != drawing.ERASER) {
				// is drawing
				drawing.mContext.fillRect(pxX*drawing.mPixelSize, pxY*drawing.mPixelSize, drawing.mPixelSize, drawing.mPixelSize);
				// check if color has already been added to palette
				// if not, add to palette
				if(drawing.mUsedColorArr.indexOf(drawing.mSelColor) == -1) {
					drawing.mUsedColorArr.push(drawing.mSelColor);

					var $el = $('.color-palette-item.temp').clone();
					$('.color-palette').append($el);
					$el.css('background', 'rgba'+drawing.mSelColor);
					$el.data('rgba-str', drawing.mSelColor);
					$el.removeClass('hidden').removeClass('temp');
					$el.click(function(e) {
						$('.color-box').colpickSetColor(utils.rgbaStrToRGBObj($(e.target).data('rgba-str')), true);
					})
				}
			}
		}
	},

	onToolClick : function(e) {
		// console.log('# onToolClick: '+e.data.toolType);

		if(e.data.toolType != drawing.mSelTool) {
			drawing.mSelTool = e.data.toolType;

			$('.tool-button').removeAttr('disabled');

			switch(drawing.mSelTool) {
				case drawing.PENCIL:
					drawing.onSelectColor(drawing.mLastPencilColor, false);
					$('#b_tool_pencil').attr('disabled','disabled');
					break;
				case drawing.ERASER:
					drawing.onSelectColor(drawing.mTransColor, true);
					$('#b_tool_eraser').attr('disabled','disabled');
					break;
			};
		}
	},

	onSelectColor : function(rgbaStr, isEraser) {
		// console.log('# onSelectColor: '+rgbaStr);
		if(isEraser) {
			drawing.mLastPencilColor = drawing.mSelColor;
		}

		drawing.mSelColor = rgbaStr;
		drawing.mContext.fillStyle = 'rgba'+rgbaStr;
	},

	testRedraw : function() {
		drawing.mContext.clearRect(0, 0, 320, 320);
		application.drawSavedCanvas(drawing.mPxArr, drawing.mContext);
	}

};

var application = {

	saveCanvas : function() {

	},

	drawSavedCanvas : function(pxArr, context) {
		var cw = pxArr.length;
		var ch = pxArr.length;
		var i,j;

		for(i=0; i<cw; i++) {
			for(j=0; j<ch; j++) {
				context.fillStyle = 'rgba'+pxArr[i][j];
				context.fillRect(i*drawing.mPixelSize, j*drawing.mPixelSize, drawing.mPixelSize, drawing.mPixelSize);
			}
		}
	}

};

var utils = {

	rgbaStrToRGBObj : function(rgbaStr) {
		var str = rgbaStr.substring(1, rgbaStr.length-1);
		var strArr = str.split(',');

		return {r: strArr[0], g: strArr[1], b: strArr[2], a: strArr[3]};
	}

};