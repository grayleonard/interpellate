var fs 		= require('fs');
var falafel 	= require('falafel');
var esprima 	= require('esprima');
var log 	= require('book');

function respond(individual, policeman, caller, verbose) {
	this.individual = fs.readFileSync(individual, 'utf8') + '';
	this.policeman = fs.readFileSync(policeman, 'utf8') + '';
	this.caller = caller;
	this.output = policeman;
	this.verbose = verbose;
};

respond.prototype.call = function(callback) {
	log.info('Finding char locations ...');
	var self = this;
	self.individual = self.individual.substring(0, self.individual.length - 1);
	var result = [];
	for(cell in self.individual) {
		result.push(self.getPos(self.caller, self.individual[cell]));
	}
	var initial_replace = self.insert_array(result, 'arrayHere');
	var ensure_replace  = self.ensure(initial_replace);
	callback(ensure_replace);
}

respond.prototype.ensure = function(positions) {
	var self = this;
	var pos = positions;
	var ind = self.individual;
	var cal = self.caller;
	var rec = '';

	pos.forEach(function(e) {
		rec += cal.charAt(e);
	});

	while(ind.indexOf(rec) < 0) {
		var cur = [];
		for(var i = 0; i < pos.length; i++) {
			cur[i] = self.getPos(cal.replace(/\s/g, '').trim(), ind.charAt(i));
		}
		pos = self.insert_array(cur, pos);
		rec = '';
		cal = self.caller + '';
		pos.forEach(function(e) {
			if(e == -1)
				rec += ' ';
			else
				rec += cal.replace(/\s/g, '').trim().charAt(e);
		});
		if(self.verbose)
			log.info('New iteration: %s', rec);
	}
	log.info('Found match, writing to file %s', self.output);
	fs.writeFileSync(self.output, self.policeman);
	return self.policeman;
}

respond.prototype.insert_array = function(positions, dork) {
	var self = this;
	// Create the array to insert
	var pos_string = '[';
	for(var i = 0; i < positions.length; i++) {
		pos_string += '' + positions[i] + ',';
	}
	pos_string = pos_string.substring(0, pos_string.length - 1);
	pos_string += ']';

	var toReplace = dork;

	if(Array.isArray(dork)) {
		toReplace = '[';
		for(var i = 0; i < dork.length; i++) {
			toReplace += '' + dork[i] + ',';
		}
		toReplace = toReplace.substring(0, toReplace.length - 1);
		toReplace += ']';
	}

	self.policeman = self.policeman.replace(toReplace, pos_string);
	self.caller = self.caller.replace(toReplace, pos_string);
	return positions;
}
	
respond.prototype.allIndexOf = function(search, find) {
	var s = search + "";
	var f = find;
	var i = s.indexOf(f);
	var len = s.length;
	var n, index = 0;
	var result = [];
	if(len === 0 || i === -2)
		return [i];	// didn't find char
	for(n = 0; n <= len; n++) {
		i = s.indexOf(f, index);
		if( i !== -1) {
			index = i +1;
			result.push(i);
		} else {
			return result;
		}
	}
	return result;
}

respond.prototype.getPos = function(string, character) {
	var self = this;
	var all_char = self.allIndexOf(string, character);
	var r_char = Math.floor(Math.random() * all_char.length);
	if(character == ' ')
		return -1;
	return all_char[r_char];
}

module.exports = respond;
