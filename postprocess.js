var fs = require('fs');

function removeDependency(filename, className) {
	var lines = fs.readFileSync(filename, "utf8");
	var regex = new RegExp('^.*require\\(".*' + className + '"\\);', 'm');
	var matches = lines.match(regex);
	if (matches != null) {
		var importStatement = matches[0];
		lines = lines.replace(regex, "");
		fs.writeFileSync(filename, lines + importStatement);
	}
}

// This removes circular dependencies and turns them into forward declarations

removeDependency('build/calculator/units/Unit.js', 'NamedUnit');
