var frame = {

	PENCIL : 'pencil',
	ERASER : 'eraser',
	// checkerboard (transparency) rgba
	CHECK_LT_COLOR : '(254,254,254,1)',
	CHECK_DK_COLOR : '(201,201,201,1)',

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
	//* RGBA value of transparent (erased) color. Hex transparencies range 00 - FF. Variable to accommodate colored backgrounds.
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

		for(i=0; i<frame.mCountPixelsX; i++) {
			frame.mPxArr[i] = [];
			for(j=0; j<frame.mCountPixelsY; j++) {
				frame.mPxArr[i][j] = frame.mTransColor;
			}
		}
	},

	initCanvas : function() {
		console.log('# initCanvas');

		var canvas = document.getElementById('canvas_draw');
		frame.mContext = canvas.getContext('2d');
		if(!frame.mContext) {
			console.log('!! Error: failed to getContext');
			return;
		}

		// set sprite pixel size based on number of sprite pixels and width of canvas
		frame.mPixelSize = $('#canvas_draw').width() / frame.mCountPixelsX;

		// set initial selected color
		frame.onSelectColor(frame.mLastPencilColor);

		$('#canvas_draw').mousemove(function(e) {
			frame.onMouseMoveOverCanvasDraw(e);
		});
		$('#canvas_draw').mousedown(function(e) {
			frame.mIsMouseDown = true;
			// console.log(e);
			frame.onMouseMoveOverCanvasDraw(e);
		});
		$(document).mouseup(function() {
			frame.mIsMouseDown = false;
		});
	},

	initCheckerboard : function() {
		var canvas = document.getElementById('canvas_checkerboard');
		var context = canvas.getContext('2d');
		if(!context) {
			console.log('!! Error: failed to getContext');
		}

		var i, j, color;

		for(i=0; i<frame.mCountPixelsX*2; i++) {
			for(j=0; j<frame.mCountPixelsY*2; j++) {
				if((i+j)%2 == 0) {
					color = frame.CHECK_LT_COLOR;
				} else {
					color = frame.CHECK_DK_COLOR;
				}
				context.fillStyle = 'rgba'+color;
				context.fillRect(i*frame.mPixelSize/2, j*frame.mPixelSize/2, frame.mPixelSize/2, frame.mPixelSize/2);
			}
		}
	},

	initTools : function() {
		frame.mSelTool = frame.PENCIL;

		$('#b_tool_pencil').click({toolType: frame.PENCIL}, frame.onToolClick);
		$('#b_tool_eraser').click({toolType: frame.ERASER}, frame.onToolClick);
	},

	initColorPicker : function() {
		$('.color-box').colpick({
			layout : 'rgbhex',
			color : '000000',
			onSubmit : function(hsb, hex, rgb, el) {
				$(el).css('background-color', '#'+hex);
				$(el).colpickHide();
				frame.onSelectColor('('+rgb.r+','+rgb.g+','+rgb.b+',1)');
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

		if(frame.mIsMouseDown) {
			// changes value in pixel color array
			pxX = Math.floor(x / frame.mPixelSize);
			pxY = Math.floor(y / frame.mPixelSize);
			// console.log(pxX+', '+pxY);
			frame.mPxArr[pxX][pxY] = frame.mSelColor;

			// draw sprite pixel
			// first clear - necessary when using colors with less than full transparency
			frame.mContext.clearRect(pxX*frame.mPixelSize, pxY*frame.mPixelSize, frame.mPixelSize, frame.mPixelSize);
			if(frame.mSelTool != frame.ERASER) {
				// is frame
				frame.mContext.fillRect(pxX*frame.mPixelSize, pxY*frame.mPixelSize, frame.mPixelSize, frame.mPixelSize);
				
				// attempt to add color to palette
				frame.addColorToPalette(frame.mSelColor);
			}
		}
	},

	onToolClick : function(e) {
		if(e.data.toolType != frame.mSelTool) {
			frame.mSelTool = e.data.toolType;

			$('.tool-button').removeAttr('disabled');

			switch(frame.mSelTool) {
				case frame.PENCIL:
					frame.onSelectColor(frame.mLastPencilColor, false);
					$('#b_tool_pencil').attr('disabled','disabled');
					break;
				case frame.ERASER:
					frame.onSelectColor(frame.mTransColor, true);
					$('#b_tool_eraser').attr('disabled','disabled');
					break;
			};
		}
	},

	onSelectColor : function(rgbaStr, isEraser) {
		if(isEraser) {
			frame.mLastPencilColor = frame.mSelColor;
		}

		frame.mSelColor = rgbaStr;
		frame.mContext.fillStyle = 'rgba'+rgbaStr;
	},

	clearCanvas : function(context) {
		context.clearRect(0, 0, 320, 320);
	},

	drawCanvasFromPixelArray : function(pxArr, context) {
		var cw = pxArr.length;
		var ch = pxArr.length;
		var i,j;

		// clear color palette in preparation of adding colors used in pxArr
		frame.mUsedColorArr = [];
		$('.color-palette').empty();

		for(i=0; i<cw; i++) {
			for(j=0; j<ch; j++) {
				frame.mPxArr[i][j] = pxArr[i][j];
				context.fillStyle = 'rgba'+pxArr[i][j];
				context.fillRect(i*frame.mPixelSize, j*frame.mPixelSize, frame.mPixelSize, frame.mPixelSize);
				// add color to palette
				frame.addColorToPalette(pxArr[i][j]);
			}
		}
	},

	addColorToPalette : function(colorStr) {
		if(colorStr != frame.mTransColor && frame.mUsedColorArr.indexOf(colorStr) == -1) {
			frame.mUsedColorArr.push(colorStr);

			var $el = $('.color-palette-item.temp').clone();
			$('.color-palette').append($el);
			$el.css('background', 'rgba'+colorStr);
			$el.data('rgba-str', colorStr);
			$el.removeClass('hidden').removeClass('temp');
			$el.click(function(e) {
				$('.color-box').colpickSetColor(utils.rgbaStrToRGBObj($(e.target).data('rgba-str')), true);
			})
		}
	}

};