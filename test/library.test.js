var assert = require('assert');
var _ = require('underscore');
var Library = require('../lib/library');

describe('Library', function() {
	
	describe('.translations(fn)', function() {
		it('should return the list of translations', function() {
			Library.translations(function(list) {
				assert.equal(list.length, 2);
			});
		});
	});
	
	describe('.convert(bookfile, biblefile, fn)', function() {
		this.timeout(5000);
		it('should convert the unbound format to json', function(done) {
			Library.convert('./raw-translations/asv/book_names.txt', './raw-translations/asv/asv_utf8.txt', function(data) {
				assert.equal(_.size(data.books.Revelation), 22);
				done();
			});
		});
	});
	
});