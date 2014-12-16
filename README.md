![Louis Althusser](https://raw.github.com/grayleonard/interpellate/master/althusser.jpg)
Interpellate
============

Novel Approach to JS Obfuscation by Inter(pell | pol)ation

Live Example: https://grayleonard.github.io/interpellate/

> I shall then suggest that ideology ‘acts’ or ‘functions’ in such a way that it ‘recruits’ subjects among the individuals (it recruits them all), or ‘transforms’ the individuals into subjects (it transforms them all) by that very precise operation which I have called interpellation or hailing, and which can be imagined along the lines of the most commonplace everyday police (or other) hailing: ‘Hey, you there!’

 - Louis Althusser, "Ideology and Ideological State Apparatuses", 1970

About
=====
[Interpellate](https://github.com/grayleonard/interpellate/) dynamically inserts a self-executing stub into any - ideally large - minified javascript library (tested with jQuery.min.js, Facebook's sdk.js, and Google's ga.js).  The stub contains pointers to character locations in the library and, using `arguments.callee.caller`, which returns source code without any network calls, the stub self-referentially rebuilds the injected javascript and then executes it.  This is intended for small javascript snippets that are typically included inside of `<script>` tags or from a small file.

It takes the three file locations for arguments:

- The 'policeman', or the library to merge into (examples in police/)
- The 'individual', which contains the code to execute (examples in individuals/)
- The 'street', the self-executing stub (examples in streets/, streets/template.min.js is provided & recommended)

Here is the process in pseudocode:

```
insert(street, policeman)                   //the initial insertion of the stub

individual = 'alert(1);'

until pos_string == individual:
	forEach(char in individual) ->            //'a', 'l', 'e', and so on
		pos_array += rand_pos(char, policeman)// get random character position in policeman 
	insert(pos_array, policeman)              // insert new array into policeman
	pos_string = get_chars(pos_array)         // searches for chars in the updated policeman
```

Usage
=====
Requirements: Node.js 0.10+

Download with `git clone https://github.com/grayleonard/interpellate.git`

```
Usage: ./index.js [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -p, --policeman <path>   Policeman that hails individual
    -i, --individual <path>  Individual to interpellate
    -s, --street <path>      Street that is embedded into policeman, executes individual
    -o, --output <path>      Interpellated file output
    -v, --verbose            Verbose logging
```

Example Use:

`./index.js -p police/ga.js -i individuals/citizen.js -s streets/template.min.js -o subjects/jquery_alert.js -v`

Output:
```
[info]	Inserting street ...
[info]	Inserted street after the 35th FunctionDeclaration
[info]	Finding char locations ...
[info]	New iteration: eu=)tB1E)
[info]	New iteration: al.vpoHL!
[info]	New iteration: ratru(){t
[info]	New iteration: alert(1);
[info]	Found match, writing to file subjects/jquery_alert.js
```

The file from this example is provided at subjects/jquery_alert.js and you can test it immediately by opening `test.html` in the root directory of this repo.  Tested as of now in latest Chrome and Safari.

Alternatively, visit https://grayleonard.github.io/interpellate/ for a live example.

It works with some libraries better than others, so you may need to retry a few times before it works.
