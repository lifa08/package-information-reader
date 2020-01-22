import * as fs from 'fs'
import * as readline from 'readline';
import * as path from "path";

const staticFilesPath = path.dirname(path.dirname(__dirname)) + "/public_html/";
const resourcesPath = path.dirname(path.dirname(__dirname)) + "/resources/";

let rl = readline.createInterface({
	input: fs.createReadStream(resourcesPath + 'status')
});

interface SinglePackageInfo {
	Description: string;
	Package: string;
	Depends: string;
}

interface PackagesInfo {
	packages: SinglePackageInfo[]
}

let pkgInfo = <PackagesInfo>{ packages: [] };
let singlePackage = <SinglePackageInfo>{};
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

	if(line.indexOf(':') > -1) {
		let lineParts = line.split(':');
		switch(lineParts[0]) {
			case "Package:":
				singlePackage.Package = lineParts[1];
				break;
			case "Depends:":
				singlePackage.Depends = lineParts[1];
				break;
		}
	}

	// an empty line indicating new package
	if (!line) {
		pkgInfo.packages.push(singlePackage);
		singlePackage =  <SinglePackageInfo>{}
	}
});


rl.on('close', function () {
	pkgInfo.packages.push(singlePackage);
	// console.log(pkgInfo);
	fs.writeFile(staticFilesPath + 'statusJson.js',
		"const packageData = " + JSON.stringify(pkgInfo) + ";",
		function (error) {
		if(error) {
			return console.log(error);
		}
	});
});
