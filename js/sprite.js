function Sprite(index, actionIndex) {

	this.index = index;
	this.actionIndex = actionIndex;

	this.PENCIL = 'pencil';
	this.ERASER = 'eraser';
	// checkerboard (transparency) rgba
	this.CHECK_LT_COLOR = '(254,254,254,1)';
	this.CHECK_DK_COLOR = '(201,201,201,1)';

	this.context = null;
	this.isLineStarted = false;
	this.isMouseDown = false;
	//* Number of sprite 'pixels' wide and high.
	this.countPixelsX = 32;
	this.countPixelsY = 32;
	//* Number of screen pixels per sprite 'pixel'.
	this.pixelSize = 10;

	this.selTool = null;

	//* 3D array representing the pixel grid.
	this.pxArr = [];
	//* RGBA value of transparent (erased) color. Hex transparencies range 00 - FF. Variable to accommodate colored backgrounds.
	this.transColor = '(0,0,0,0)';
	//* RGBA value of WIP pencil color.
	this.lastPencilColor = '(0,0,0,1)';
	//* RGBA value of currently selected color.
	this.selColor = null;
	//* Array of RGBA values of colors used in sprite.
	this.usedColorArr = [];

	this.init = function() {
		this.initPixelArray();
		this.initCanvas();
		this.initCheckerboard();
		this.initTools();
		this.initControls();
		this.initColorPicker();
	}

	/**
	*	Initialize grid with transparent pixels at all locations.
	**/
	this.initPixelArray = function() {
		var i, j;

		for(i=0; i<this.countPixelsX; i++) {
			this.pxArr[i] = [];
			for(j=0; j<this.countPixelsY; j++) {
				this.pxArr[i][j] = this.transColor;
			}
		}
	}

	this.initCanvas = function() {
		console.log('# initCanvas');

		var canvas = document.getElementById('canvas_draw');
		this.context = canvas.getContext('2d');
		if(!this.context) {
			console.log('!! Error: failed to getContext');
			return;
		}

		// set sprite pixel size based on number of sprite pixels and width of canvas
		this.pixelSize = $('#canvas_draw').width() / this.countPixelsX;

		// set initial selected color
		this.onSelectColor(this.lastPencilColor);

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

		for(i=0; i<this.countPixelsX*2; i++) {
			for(j=0; j<this.countPixelsY*2; j++) {
				if((i+j)%2 == 0) {
					color = this.CHECK_LT_COLOR;
				} else {
					color = this.CHECK_DK_COLOR;
				}
				context.fillStyle = 'rgba'+color;
				context.fillRect(i*this.pixelSize/2, j*this.pixelSize/2, this.pixelSize/2, this.pixelSize/2);
			}
		}
	}

	this.initTools = function() {
		this.selTool = this.PENCIL;

		$('#b_tool_pencil').click({toolType: this.PENCIL}, $.proxy(this.onToolClick, this));
		$('#b_tool_eraser').click({toolType: this.ERASER}, $.proxy(this.onToolClick, this));
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

		if(this.isMouseDown) {
			// changes value in pixel color array
			pxX = Math.floor(x / this.pixelSize);
			pxY = Math.floor(y / this.pixelSize);
			// console.log(pxX+', '+pxY);
			this.pxArr[pxX][pxY] = this.selColor;

			// draw sprite pixel
			// first clear - necessary when using colors with less than full transparency
			this.context.clearRect(pxX*this.pixelSize, pxY*this.pixelSize, this.pixelSize, this.pixelSize);
			if(this.selTool != this.ERASER) {
				// is sprite
				this.context.fillRect(pxX*this.pixelSize, pxY*this.pixelSize, this.pixelSize, this.pixelSize);
				
				// attempt to add color to palette
				this.addColorToPalette(this.selColor);
			}
		}
	}

	this.onMouseDownOverCanvasDraw = function(e) {
		this.isMouseDown = true;
		this.onMouseMoveOverCanvasDraw(e);
	}

	this.onMouseUpOverDoc = function(e) {
		this.isMouseDown = false;

		State.updateSprite(this.pxArr, this.index, this.actionIndex);
	}

	this.onToolClick = function(e) {
		if(e.data.toolType != this.selTool) {
			this.selTool = e.data.toolType;

			$('.tool-button').removeAttr('disabled');

			switch(this.selTool) {
				case this.PENCIL:
					this.onSelectColor(this.lastPencilColor, false);
					$('#b_tool_pencil').attr('disabled','disabled');
					break;
				case this.ERASER:
					this.onSelectColor(this.transColor, true);
					$('#b_tool_eraser').attr('disabled','disabled');
					break;
			};
		}
	}

	this.onSelectColor = function(rgbaStr, isEraser) {
		// console.log('#onSelectColor');
		if(isEraser) {
			this.lastPencilColor = this.selColor;
		}

		this.selColor = rgbaStr;
		this.context.fillStyle = 'rgba'+rgbaStr;
	}

	this.clearCanvas = function(context) {
		context.clearRect(0, 0, 320, 320);
	}

	this.drawCanvasFromPixelArray = function(pxArr, context) {
		var cw = pxArr.length;
		var ch = pxArr.length;
		var i,j;

		// clear color palette in preparation of adding colors used in pxArr
		this.usedColorArr = [];
		$('.color-palette').empty();

		for(i=0; i<cw; i++) {
			for(j=0; j<ch; j++) {
				this.pxArr[i][j] = pxArr[i][j];
				context.fillStyle = 'rgba'+pxArr[i][j];
				context.fillRect(i*this.pixelSize, j*this.pixelSize, this.pixelSize, this.pixelSize);
				// add color to palette
				this.addColorToPalette(pxArr[i][j]);
			}
		}
	}

	this.addColorToPalette = function(colorStr) {
		if(colorStr != this.transColor && this.usedColorArr.indexOf(colorStr) == -1) {
			this.usedColorArr.push(colorStr);

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