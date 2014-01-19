function SpriteThumbnail(index, $element) {
	
	this.index = index;
	this.$element = $element;

	this.init = function() {
		$(this.$element).click($.proxy(this.onMouseClick, this));
	};

	this.onMouseClick = function() {
		console.log('click '+this.index);
		$(this.$element).trigger('spriteThumbClick', [this.index]);
	};

	this.drawSprite = function(pxArr) {
		var cw = pxArr.length;
		var ch = pxArr.length;
		var i,j;

		for(i=0; i<cw; i++) {
			for(j=0; j<ch; j++) {
				this.pxArr[i][j] = pxArr[i][j];
				context.fillStyle = 'rgba'+pxArr[i][j];
				context.fillRect(i*this.pixelSize, j*this.pixelSize, this.pixelSize, this.pixelSize);
				// add color to palette
				this.addColorToPalette(pxArr[i][j]);
			}
		}
	};

	this.init();

}