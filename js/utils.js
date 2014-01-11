var utils = {

	rgbaStrToRGBObj : function(rgbaStr) {
		var str = rgbaStr.substring(1, rgbaStr.length-1);
		var strArr = str.split(',');

		return {r: strArr[0], g: strArr[1], b: strArr[2], a: strArr[3]};
	}

};