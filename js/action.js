function Action(index) {

	this.name = 'untitled';
	this.index = index;
	this.$element = null;
	this.isNewAction = true;

	// array of sprite objects
	this.spritesArr = [];

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
		if(this.spritesArr.length < 1) {
			// open action with new, blank sprite
			var sprite = new Sprite(0, this.index);
			this.spritesArr.push(sprite);
			State.addSprite(this.index);

			$('#temp_container').append(this.$element);

			$('#page_container').one('domReady', $.proxy(this.onDomReady, this));
			$('#page_container').load('sprite.html');
		}
	}

	this.onDomReady = function() {
		$('.inline-js').remove();

		if(this.isNewAction) {
			this.spritesArr[0].init();
		}

		$('#page_container').append(this.$element);
	}

};