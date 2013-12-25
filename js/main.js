$(document).ready(function() {
	console.log('!! ready');

	drawing.initCanvas();
});

var drawing = {

	mContext : null,
	mIsLineStarted: false,
	mIsMouseDown: false,
	mCountPixelsX: 32,
	mCountPixelsY: 32,

	initCanvas :function() {
		console.log('# initCanvas');

		var canvas = document.getElementById('canvas_draw');
		drawing.mContext = canvas.getContext('2d');
		if(!drawing.mContext) {
			console.log('!! Error: failed to getContext');
			return;
		}

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

	onMouseMoveOverCanvasDraw :function(e) {
		// console.log(e.pageX+', '+e.pageY);

		var x = e.pageX - $(e.target).offset().left;
		var y = e.pageY - $(e.target).offset().top; 

		if(drawing.mIsMouseDown) {
			console.log(Math.floor(x/10)+', '+Math.floor(y/10));
		}

		/*if(!drawing.mIsLineStarted) {
			drawing.mContext.beginPath();
			drawing.mContext.moveTo(x, y);
			drawing.mIsLineStarted = true;
		} else {
			drawing.mContext.lineTo(x, y);
			drawing.mContext.stroke();
		}*/
	}

};