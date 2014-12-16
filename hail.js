var fs = require('fs');
var falafel = require('falafel');
var esprima = require('esprima');
var log = require('book');

function hail(street, policeman, output) {
	this.street = fs.readFileSync(street, 'utf8');
	this.policeman = fs.readFileSync(policeman, 'utf8');
	this.output = output;
};

hail.prototype.countOccurences = function(str, value){
	var regExp = new RegExp(value, "gi");
	return str.match(regExp) ? str.match(regExp).length : 0;  
}

hail.prototype.call = function(callback) {
	log.info('Inserting street ...');
	var self = this;
	var updated = false;
	var count = self.countOccurences(JSON.stringify(esprima.parse(self.policeman)), 'FunctionDeclaration');
	var i = 0;
	var toIns = Math.abs(Math.floor(Math.random() * count - 5) + 1);
	var nodeParent = '';
	var hailed = falafel(self.policeman, function(node) {
		if(node.type === 'FunctionDeclaration' && updated == false) {
			if(i == toIns) {
				log.info('Inserted street after the %sth FunctionDeclaration', i);
				node.update(node.source() + self.street.substring(0, self.street.length -1));
			nodeParent = node.parent.parent.source();
			}
			i++;
		}
	});
	updated = true;
	fs.writeFileSync(self.output, hailed);
	callback(nodeParent);
};


module.exports = hail;
