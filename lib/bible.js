var utils = require('./utils');
var _ = require('underscore');


//Expose Bible
module.exports = Bible;

/**
 * Initialize a new `Bible` with the given `options`.
 *
 * options:
 *	- translation
 *	- something else???
 *
 * @param {Object} options
 */

function Bible(options) {
	options = options || {
		translation: 'default'
	};

	this.translation = options.translation;

	//read in translation specified
	this.bible = require('../translations/' + this.translation + '.json');
}

/**
 * Lookup the given `stringref` reference in this bible and then call
 * fn with the scripture.
 * @param {String} stringref
 * @param {Function} fn(data, err)
 */
Bible.prototype.lookup = function(stringref, fn) {
	var ref = utils.parse(stringref);

	var result = {};

	if (ref.book && !ref.chapter) {
		result[ref.book] = this.bible.books[ref.book];
	}
	if (ref.book && ref.chapter && !ref.verse) {
		result[ref.book] = {};
		result[ref.book][ref.chapter] = this.bible.books[ref.book][ref.chapter];
	}
	if(ref.book && ref.chapter && ref.verse) {
		result[ref.book] = {};
		result[ref.book][ref.chapter] = {};
		result[ref.book][ref.chapter][ref.verse] = this.bible.books[ref.book][ref.chapter][ref.verse];
	}

	fn(result);
};
