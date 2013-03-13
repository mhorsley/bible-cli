var fs = require('fs');
var _ = require('underscore');
var lr = require('line-reader');

var Library = exports = module.exports = {};

/**
 * Read translations from `../translations/`.
 */
Library.translations = function(fn) {
	fs.readdir('./translations', function(err, files) {
		var list = _.map(files, function(val) {
			return val.replace('.json', '');
		});
		fn(list);
	});
};

/**
 * Convert Unbound Format to json and write to file.
 */
Library.convert = function(bookfile, biblefile, fn, verbose) {
	var bookslookup = {};
	var bible = {};
	var books = {};
	var currentbook = '';

	function parseBookFileLine(line, last) {
		var l = line.replace('\r', '');
		var split = l.split('\t');
		bookslookup[split[0]] = split[1];
	}

	function parseBibleFileLine(line, last) {
		if (line.indexOf('#') != 0) {
			var l = line.replace('\r', '');
			var split = l.split('\t');
			if (split[0] == '79A') {
				console.log(line);
			}
			var o = {
				book: bookslookup[split[0]],
				chapter: split[1],
				verse: split[2],
				subverse: split[3],
				orderBy: split[4],
				text: split[5]
			};

			//console.log(o);

			if (currentbook != o.book) {
				if(verbose) console.log('Processing Book: ', o.book);
			}
			currentbook = o.book;

			if (!books[o.book]) books[o.book] = {};
			if (!books[o.book][o.chapter]) books[o.book][o.chapter] = {};
			if (!books[o.book][o.chapter][o.verse]) books[o.book][o.chapter][o.verse] = {};

			books[o.book][o.chapter][o.verse] = o.text;
		} else {
			if (line.indexOf('#name') == 0) {
				var name = line.replace('\r', '')
					.split('\t')[1];
				bible.version = name;
			}
		}
	}

	lr.eachLine(bookfile, parseBookFileLine)
		.then(function() {
		lr.eachLine(biblefile, parseBibleFileLine)
			.then(function() {
			bible.books = books;
			fn(bible);
		});
	});


};
