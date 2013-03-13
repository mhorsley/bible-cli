var assert = require('assert');
var utils = require('../lib/utils');

var books = {
				'John': {},
				'Revelations':{}
			};

describe('utils', function() {
	describe('.parse(stringref)', function() {
		it('should return an object representing the full reference', function() {
			var ref = utils.parse('John 3:16', books);
			assert.equal(ref.book, 'John');
			assert.equal(ref.chapter, 3);
			assert.equal(ref.verse, 16);
		});
		it('should return an object with null verse if omitted', function() {
			var ref = utils.parse('John 3', books);
			assert.equal(ref.book, 'John');
			assert.equal(ref.chapter, 3);
			assert.equal(ref.verse, null);
		});
		it('should return an object with null chapter/verse if omitted', function() {
			var ref = utils.parse('John', books);
			assert.equal(ref.book, 'John');
			assert.equal(ref.chapter, null);
			assert.equal(ref.verse, null);
		});
	});
});
