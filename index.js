#!/usr/bin/env node

/*
 * "I shall then suggest that ideology ‘acts’ or ‘functions’ in such a way that it ‘recruits’ subjects among the individuals (it recruits them all), or ‘transforms’ the individuals into subjects (it transforms them all) by that very precise operation which I have called interpellation or hailing, and which can be imagined along the lines of the most commonplace everyday police (or other) hailing: ‘Hey, you there!’"
 * 	- Louis Althusser, "Ideology and Ideological State Apparatuses", 1970
 *
 * This program works with three files:
 * 1) The 'policeman,' or the file to merge into.  It 'hails' the
 * 2) 'individual' file, which contains the code to execute, by way of the
 * 3) 'street' file, the mediator, which takes an array of character 
 * locations and then executes the recovered string within the policeman.
 *
 * Through this the individual is executed secretly in the context of the policeman.
 *
 * The program follows this order:
 * 1) Insert the 'street' (ex: test/street.js) into the file to merge into (hail)
 * 2) After insertion, get a random position for each char in the 'individual' file in policeman
 * 3) Insert the array of positions into the argument for 'street', repeat until char locations equal individual (respond)
 * 
 * Pseudocode:
 * 	insert(street, policeman)
 * 	until pos_string == individual:
 * 		forEach(char in individual) ->
 *	 		pos_array += get rand_pos in policeman
 *	 	insert(pos_array, street)
 *	 	policeman = updated_policeman // has the new inserted array
 *	 	pos_string = get_chars(pos_array)
*/

var fs 		= require('fs');
var cmd_args 	= require('commander');
var log 	= require('book');

var Hail 	= require('./hail.js');
var Respond 	= require('./respond.js');

var verbose	= false;

cmd_args.version('0.0.1')
	.option('-p, --policeman <path>', 'Policeman that hails individual')
	.option('-i, --individual <path>', 'Individual to interpellate')
	.option('-s, --street <path>', 'Street that is embedded into policeman, executes individual')
	.option('-o, --output <path>', 'Interpellated file output')
	.option('-v, --verbose', 'Verbose logging', function(){verbose=true;})
	.parse(process.argv);

var policeman	= cmd_args.policeman;
var individual	= cmd_args.individual;
var street	= cmd_args.street;
var output	= cmd_args.output;

var hail = new Hail(street, policeman, output, verbose);
hail.call(function(caller) {
	var respond = new Respond(individual, output, caller, verbose);
	respond.call(function(result) {
			//console.log('callback: ' + result.toString());
	});
});       

