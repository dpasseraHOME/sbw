function Frame() {

	this.PENCIL = 'pencil';
	this.ERASER = 'eraser';
	// checkerboard (transparency) rgba
	this.CHECK_LT_COLOR = '(254,254,254,1)';
	this.CHECK_DK_COLOR = '(201,201,201,1)';

	this.mContext = null;
	this.mIsLineStarted = false;
	this.mIsMouseDown = false;
	//* Number of sprite 'pixels' wide and high.
	this.mCountPixelsX = 32;
	this.mCountPixelsY = 32;
	//* Number of screen pixels per sprite 'pixel'.
	this.mPixelSize = 10;

	this.mSelTool = null;

	//* 3D array representing the pixel grid.
	this.mPxArr = [];
	//* RGBA value of transparent (erased) color. Hex transparencies range 00 - FF. Variable to accommodate colored backgrounds.
	this.mTransColor = '(0,0,0,0)';
	//* RGBA value of WIP pencil color.
	this.mLastPencilColor = '(0,0,0,1)';
	//* RGBA value of currently selected color.
	this.mSelColor = null;
	//* Array of RGBA values of colors used in sprite.
	this.mUsedColorArr = [];

	/**
	*	Initialize grid with transparent pixels at all locations.
	**/
	this.initPixelArray = function() {
		var i, j;

		for(i=0; i<this.mCountPixelsX; i++) {
			this.mPxArr[i] = [];
			for(j=0; j<this.mCountPixelsY; j++) {
				this.mPxArr[i][j] = this.mTransColor;
			}
		}
	}

	this.initCanvas = function() {
		console.log('# initCanvas');

		var canvas = document.getElementById('canvas_draw');
		this.mContext = canvas.getContext('2d');
		if(!this.mContext) {
			console.log('!! Error: failed to getContext');
			return;
		}

		// set sprite pixel size based on number of sprite pixels and width of canvas
		this.mPixelSize = $('#canvas_draw').width() / this.mCountPixelsX;

		// set initial selected color
		this.onSelectColor(this.mLastPencilColor);

		$('#canvas_draw').mousemove(
			$.proxy(this.onMouseMoveOverCanvasDraw, this)
		);
		$('#canvas_draw').mousedown(
			$.proxy(this.onMouseDownOverCanvasDraw, this)
		);
		$(document).mouseup(
			$.proxy(this.onMouseUpOverDoc, this)
		);
	}

	this.initCheckerboard = function() {
		var canvas = document.getElementById('canvas_checkerboard');
		var context = canvas.getContext('2d');
		if(!context) {
			console.log('!! Error: failed to getContext');
		}

		var i, j, color;

		for(i=0; i<this.mCountPixelsX*2; i++) {
			for(j=0; j<this.mCountPixelsY*2; j++) {
				if((i+j)%2 == 0) {
					color = this.CHECK_LT_COLOR;
				} else {
					color = this.CHECK_DK_COLOR;
				}
				context.fillStyle = 'rgba'+color;
				context.fillRect(i*this.mPixelSize/2, j*this.mPixelSize/2, this.mPixelSize/2, this.mPixelSize/2);
			}
		}
	}

	this.initTools = function() {
		this.mSelTool = this.PENCIL;

		$('#b_tool_pencil').click({toolType: this.PENCIL}, this.onToolClick);
		$('#b_tool_eraser').click({toolType: this.ERASER}, this.onToolClick);
	}

	this.initControls = function() {
		$('#b_toggle_checkerboard').click(this.toggleCheckerboard);
	}

	this.initColorPicker = function() {
		$('.color-box').colpick({
			layout : 'rgbhex',
			color : '000000',
			onSubmit : $.proxy(this.onColorPickerSubmit, this),
			onChange : $.proxy(this.onColorPickerChange, this)
		});
	}

	this.onColorPickerSubmit = function(hsb, hex, rgb, el) {
		$(el).css('background-color', '#'+hex);
		$(el).colpickHide();
		this.onSelectColor('('+rgb.r+','+rgb.g+','+rgb.b+',1)');
	}

	this.onColorPickerChange = function(hsb, hex, rgb, fromSetColor) {
		if(fromSetColor) {
			$('.colpick_submit').click();
		}
	}

	this.onMouseMoveOverCanvasDraw = function(e) {
		// console.log(e.pageX+', '+e.pageY);

		var x = e.pageX - $(e.target).offset().left;
		var y = e.pageY - $(e.target).offset().top;

		var pxX, pxY;

		if(this.mIsMouseDown) {
			// changes value in pixel color array
			pxX = Math.floor(x / this.mPixelSize);
			pxY = Math.floor(y / this.mPixelSize);
			// console.log(pxX+', '+pxY);
			this.mPxArr[pxX][pxY] = this.mSelColor;

			// draw sprite pixel
			// first clear - necessary when using colors with less than full transparency
			this.mContext.clearRect(pxX*this.mPixelSize, pxY*this.mPixelSize, this.mPixelSize, this.mPixelSize);
			if(this.mSelTool != this.ERASER) {
				// is frame
				this.mContext.fillRect(pxX*this.mPixelSize, pxY*this.mPixelSize, this.mPixelSize, this.mPixelSize);
				
				// attempt to add color to palette
				this.addColorToPalette(this.mSelColor);
			}
		}
	}

	this.onMouseDownOverCanvasDraw = function(e) {
		this.mIsMouseDown = true;
		this.onMouseMoveOverCanvasDraw(e);
	}

	this.onMouseUpOverDoc = function(e) {
		this.mIsMouseDown = false;
	}

	this.onToolClick = function(e) {
		if(e.data.toolType != this.mSelTool) {
			this.mSelTool = e.data.toolType;

			$('.tool-button').removeAttr('disabled');

			switch(this.mSelTool) {
				case this.PENCIL:
					this.onSelectColor(this.mLastPencilColor, false);
					$('#b_tool_pencil').attr('disabled','disabled');
					break;
				case this.ERASER:
					this.onSelectColor(this.mTransColor, true);
					$('#b_tool_eraser').attr('disabled','disabled');
					break;
			};
		}
	}

	this.onSelectColor = function(rgbaStr, isEraser) {
		console.log('#onSelectColor');
		if(isEraser) {
			this.mLastPencilColor = this.mSelColor;
		}

		this.mSelColor = rgbaStr;
		this.mContext.fillStyle = 'rgba'+rgbaStr;
	}

	this.clearCanvas = function(context) {
		context.clearRect(0, 0, 320, 320);
	}

	this.drawCanvasFromPixelArray = function(pxArr, context) {
		var cw = pxArr.length;
		var ch = pxArr.length;
		var i,j;

		// clear color palette in preparation of adding colors used in pxArr
		this.mUsedColorArr = [];
		$('.color-palette').empty();

		for(i=0; i<cw; i++) {
			for(j=0; j<ch; j++) {
				this.mPxArr[i][j] = pxArr[i][j];
				context.fillStyle = 'rgba'+pxArr[i][j];
				context.fillRect(i*this.mPixelSize, j*this.mPixelSize, this.mPixelSize, this.mPixelSize);
				// add color to palette
				this.addColorToPalette(pxArr[i][j]);
			}
		}
	}

	this.addColorToPalette = function(colorStr) {
		if(colorStr != this.mTransColor && this.mUsedColorArr.indexOf(colorStr) == -1) {
			this.mUsedColorArr.push(colorStr);

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

	this.toggleCheckerboard = function(e) {
		if($('#canvas_checkerboard').hasClass('hidden')) {
			$('#canvas_checkerboard').removeClass('hidden');
			$(e.target).html('Checkerboard off');
		} else {
			$('#canvas_checkerboard').addClass('hidden');
			$(e.target).html('Checkerboard on');
		}
	}

};