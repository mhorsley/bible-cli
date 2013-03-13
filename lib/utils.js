var _ = require('underscore');

var utils = exports = module.exports = {};

utils.parse = function(stringRef, possibleBooks) {
	var ref = {};

	var split = stringRef.split(' ');
	if (split.length < 2) {
		ref.book = split[0];
		return ref;
	}

	ref.book = split[0].trim();
	var cv = split[1].split(':');
	if (cv[0]) ref.chapter = cv[0].trim();
	if (cv[1]) ref.verse = cv[1].trim();

	return ref;
};

utils.formatScripture = function(scripture) {
	var result = '';
	//books
	_.each(scripture, function(chapters, book) {
		_.each(chapters, function(verses, chapter) {
			result += '\n' + book + ' ' + chapter + '\n------';
			_.each(verses, function(text, verse) {
				result += '\n' + verse + ': ' + utils.smoosh(text, 30, '\t');
			});
		});
	});
	
	return result;
};

utils.smoosh = function(str, width, indent) {
	var result = indent;
	var original = str;
	
	while(original.length > width) {
		result += original.substring(0, width);
		original = original.substring(width).replace(' ', '\n' + indent);
	}
	result += original;
	
	return result;
};



