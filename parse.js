const fs = require('fs');
const readline = require('readline');

rl = readline.createInterface({
	input: fs.createReadStream('status')
});

let pkgInfo = {
	packages: []
};

let singlePackage = {};
let readingDescription = false;
let descriptionLines = "";

rl.on('line', (line) => {
	if((line.indexOf('Description: ') > -1)) {
		readingDescription = true;
	} else if((line.indexOf(':') > -1) && readingDescription) {
		readingDescription = false;
		singlePackage['Description'] = descriptionLines;
		descriptionLines = ""
	} else {
		if(readingDescription) {
			descriptionLines = descriptionLines.concat(line);
		}
	}

	if ((line.indexOf('Package: ') > -1) ||
		(line.indexOf('Depends: ') > -1 )) {
		let lineParts = line.split(':');
		singlePackage[lineParts[0]] = lineParts[1]
	}

	// an empty line indicating new package
	if (!line) {
		pkgInfo.packages.push(singlePackage);
		singlePackage = {}
	}
});


rl.on('close', function () {
	pkgInfo.packages.push(singlePackage);
	// console.log(pkgInfo);
	fs.writeFile('statusJson.json',
		JSON.stringify(pkgInfo),
		function (error) {
		if(error) {
			return console.log(error);
		}
	});
});
