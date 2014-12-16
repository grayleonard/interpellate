var fs = require('fs');
var Hail = require('../hail.js');
var Respond = require('../respond.js');

// hail arguments
var street = 'streets/template.min.js';
var policeman = 'police/jquery.min.js';
var output = 'examples/example_output.js';

// respond arguments
var citizen = 'individuals/alert.js';

var hail = new Hail(street, policeman, output);
hail.call(function(toSearch) {
	var respond = new Respond(citizen, output, toSearch);
	respond.call(function(callback) {
			console.log(callback.toString());
	});
});       

