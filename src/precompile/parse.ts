import * as fs from 'fs'
import * as readline from 'readline';
import * as path from "path";

const sourceResourcesPath = path.dirname(path.dirname(__dirname)) + "/src/resources/";

let rl = readline.createInterface({
    input: fs.createReadStream(sourceResourcesPath + 'status')
});

export type packageID = number;

export interface Dependency {
    name: string,
    id: packageID;
}


export class SinglePackageInfo {
    ID: packageID;
    PackageName: string;
    Description: string;
    Depends: (Dependency | null)[];

    constructor(id: number, packageName: string, description: string, depends: (Dependency | null)[]) {
        this.ID = id;
        this.Description = description;
        this.PackageName = packageName;
        this.Depends = depends;
    }
}

export interface PackagesInfo {
    packages: SinglePackageInfo[]
}

export interface CurrentPackageInfo {
    ID: number,
    Description: string;
    PackageName: string;
    Depends?: string;
}

let pkgInfo = <PackagesInfo>{packages: []};
let currentPackageInfo = <CurrentPackageInfo>{};
let accumulatedPackagesInfo: CurrentPackageInfo[] = [];
let readingDescription = false;
let descriptionLines = "";
let packageCounter = 0;

rl.on('line', (line) => {

    if ((line.indexOf('Description: ') > -1)) {
        readingDescription = true;
        descriptionLines = line.split(":")[1].trim();
    } else if (readingDescription && ((line.indexOf(':') > -1) || !line)) {
        readingDescription = false;
        currentPackageInfo.Description = descriptionLines;
        descriptionLines = ""
    } else if (readingDescription) {
        descriptionLines = descriptionLines.concat(line);
    }


    if (line.indexOf(':') > -1) {
        let lineParts = line.split(/:(.+)/);
        switch (lineParts[0]) {
            case "Package":
                currentPackageInfo.PackageName = lineParts[1].trim();
                break;
            case "Depends":
                currentPackageInfo.Depends = lineParts[1].trim();
                break;
        }
    }

    // an empty line indicating new package
    if (!line) {
        currentPackageInfo.ID = packageCounter;
        packageCounter++;
        accumulatedPackagesInfo.push(currentPackageInfo);
        currentPackageInfo = <CurrentPackageInfo>{}
    }
});

rl.on('close', function () {
    pkgInfo.packages = accumulatedPackagesInfo.map(currentPackageInfo => {
        let dependencies: (Dependency | null)[] | undefined = currentPackageInfo.Depends?.split(",").map(stringValue => {

            let possibleDependenciesString: string[] = stringValue.split("(")[0].trim().split("|");
            return possibleDependenciesString.map(dependencyName => {

                let matchingPackages = accumulatedPackagesInfo.filter(otherDependency => {
                    //console.log(dependencyName + " : " + otherDependency.PackageName)
                    return otherDependency.PackageName === dependencyName.trim();
                });
                if (matchingPackages.length > 0) {
                    return <Dependency>{name: dependencyName, id: matchingPackages[0].ID};
                } else {
                    return null;
                }
            }).filter(possibleDependency => possibleDependency !== null)[0]
        });
        return new SinglePackageInfo(
            currentPackageInfo.ID,
            currentPackageInfo.PackageName,
            currentPackageInfo.Description,
            dependencies ? dependencies : []
        );
    });

    //console.log(pkgInfo.packages)

    const moduleImportString = "import { PackagesInfo } from '../precompile/parse';";
    const variableDefinitionString = "export const packagesInfo : PackagesInfo = ";

    fs.writeFile(sourceResourcesPath + 'status.ts',
        moduleImportString + variableDefinitionString + JSON.stringify(pkgInfo) + ";",
        function (error) {
            if (error) {
                return console.log(error);
            }
        });
});
