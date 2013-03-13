var assert = require('assert');
var Bible = require('../lib/bible');

describe('Bible', function() {
	
	describe('()', function() {
		it('should return a new instance of a Bible', function() {
			var bible = new Bible();
			assert(bible);
			assert.equal(bible.translation, 'default');
		});
		it('should throw an error when requesting an unknown translation', function() {
			assert.throws(function() {
				var bible = new Bible({
					translation: 'unknown'
				});
			});
		});
	});
	
	describe('.lookup(stringref, fn)', function() {
		it('should return the full verse reference', function() {
			var bible = new Bible();
			bible.lookup('John 3:16', function(data, err) {
				assert.equal(data['John']['3']['16'], 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth on him should not perish, but have eternal life.');
			});
		});
		it('should return the full chapter when verse is omitted', function() {
			var bible = new Bible();
			bible.lookup('John 3', function(data, err) {
				assert.equal(Object.keys(data['John']['3']).length, 36);
			});
		});
		it('should return the full book when chapter and verse is omitted', function() {
			var bible = new Bible();
			bible.lookup('John', function(data, err) {
				assert.equal(Object.keys(data['John']).length, 21);
			});
		});
	});
	
});