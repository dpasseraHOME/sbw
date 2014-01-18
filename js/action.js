function Action(index) {

	this.name = 'untitled';
	this.index = index;
	this.$element = null;

	// array of sprite objects
	this.mSpritesArr = [];

	this.init = function($element) {
		// $element is the DOM element which this instanct of Action controls
		this.$element = $element;

		$(this.$element).on("mouseover", $.proxy(this.onMouseOver, this));
		$(this.$element).click($.proxy(this.onMouseClick, this));
	}

	this.onMouseOver = function() {
		// console.log('#onMouseOver : '+this.index);
	}

	this.onMouseClick = function() {
		var sprite = new Sprite(this.mSpritesArr.length);
		this.mSpritesArr.push(sprite);

		$('#temp_container').append(this.$element);

		$('#page_container').one('domReady', $.proxy(this.onDomReady, this));
		$('#page_container').load('sprite.html');
	}

	this.onDomReady = function() {
		$('.inline-js').remove();

		this.mSpritesArr[this.mSpritesArr.length-1].init();
		$('#page_container').append(this.$element);
	}

};