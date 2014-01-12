function Action(index) {

	this.name = 'untitled';
	this.index = index;

	// array of frame objects
	this.mFramesArr = [];

	this.init = function() {
		console.log(this.index);
	}

};