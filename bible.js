var complete = require('commander');
var fs = require('fs');
var _ = require('underscore');
var lr = require('line-reader');

var bible = module.exports = {};

bible.loadedversion = require('./versions/default.json');

bible.versions = function(cb) {
	fs.readdir('./versions', function(err, files) {
		cb(_.map(files, function(val) {
			return val.replace('.json', '');
		}));
	});
};

bible.parseReference = function(stringRef) {
	var splits = stringRef.split(' ');

	var bookname;
	var chapter;
	var verse;

	var splits2;

	if (bible.loadedversion.books[splits[0]]) bookname = splits[0].trim();
	if (splits && splits[1]) splits2 = splits[1].split(':');
	if (splits2) chapter = splits2[0].trim();
	if (splits2 && splits2[1]) verse = splits2[1].trim();
	return {
		bookname: bookname,
		chapter: chapter,
		verse: verse
	};
}

bible.reference = function(stringref, callback) {
	var ref = bible.parseReference(stringref);

	if (ref.bookname && ref.chapter && ref.verse) {
		callback(ref, bible.loadedversion.books[ref.bookname][ref.chapter][ref.verse]);
	} else if (ref.bookname && ref.chapter && !ref.verse) {
		callback(ref, bible.loadedversion.books[ref.bookname][ref.chapter]);
	} else {
		callback(ref, {
			error: 'uh oh'
		});
	}
};

bible.chapters = function(bookname) {
	return bible.loadedversion[bookname];
}

bible.unboundToJson = function(bookfile, biblefile) {
	var bible = {};
	var books = {};
	var bookslookup = {};
	var currentbook = '';

	lr.eachLine(bookfile, function(line, last) {
		var l = line.replace('\r', '');
		var split = l.split('\t');
		bookslookup[split[0]] = split[1];
	})
		.then(function() {
		lr.eachLine(biblefile, function(line, last) {

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
					console.log('Processing Book: ', o.book);
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

		})
			.then(function() {
			console.log('writing to file');

			bible.books = books;

			var outfilename = bible.version.replace(/ /g, '_')
				.replace(':', '');
			console.log(outfilename);

			fs.writeFile('./versions/' + outfilename + '.json', JSON.stringify(bible, null, 4), function(err) {
				if (err) console.log(err);
			});

			console.log('Done');
		});
	});
};
