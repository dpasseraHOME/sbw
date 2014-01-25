function Action(index) {

	this.name = 'untitled';
	this.index = index;
	this.$element = null;
	this.isNewAction = true;

	// array of sprite objects
	this.spritesArr = [];
	this.spriteThumbArr = [];

	this.curSpriteIndex = 1;

	this.init = function($element) {
		// $element is the DOM element which this instance of Action controls
		this.$element = $element;

		$(this.$element).on("mouseover", $.proxy(this.onMouseOver, this));

		this.addNewSprite();

		this.initControls();
	};

	this.initControls = function() {
		$('#b_prev_sprite').click($.proxy(this.onPrevSpriteClick, this));
		$('#b_next_sprite').click($.proxy(this.onNextSpriteClick, this));
		$('#b_new_sprite').click($.proxy(this.onNewSpriteClick, this));
		$('#b_play_action').click($.proxy(this.onPlayActionClick, this));
	};

	this.onMouseOver = function() {
		// console.log('#onMouseOver : '+this.index);
	};

	this.onDomReady = function() {
		$('.inline-js').remove();

		if(this.isNewAction) {
			this.spritesArr[0].init();
		}

		$(this.$element).find('.controls').removeClass('hidden');
		$('#page_container').append(this.$element);
	};

	this.addNewSprite = function() {
		var sprite = new Sprite(0, this.index);
		this.spritesArr.push(sprite);
		State.addSprite(this.index);

		this.addNewSpriteThumbnail();
		this.updateSpriteCount();
	};

	this.addNewSpriteThumbnail = function() {
		var $spriteThumb = $('.sprite-thumbnail.temp').clone().appendTo('.sprite-thumbnail-group').removeClass('temp').removeClass('hidden');
		var spriteThumb = new SpriteThumbnail(this.spriteThumbArr.length, $spriteThumb);

		$($spriteThumb).on('spriteThumbClick', $.proxy(this.onSpriteThumbClick, this));
		this.spriteThumbArr.push(spriteThumb);
	};

	this.onSpriteThumbClick = function(e, index) {
		console.log('#onSpriteThumbClick '+index);

		this.curSpriteIndex = index;

		$('#temp_container').append($(this.$element));

		$('#page_container').one('domReady', $.proxy(this.onDomReady, this));
		$('#page_container').load('sprite.html');
	};

	this.onPrevSpriteClick = function() {

	};

	this.onNextSpriteClick = function() {
		
	};

	this.onNewSpriteClick = function() {
		this.addNewSprite();
	};

	this.onPlayActionClick = function() {

	};

	this.updateSpriteCount = function() {
		$('.sprite-count').html('Sprite '+(this.curSpriteIndex+1)+' of '+this.spritesArr.length);
	};

};