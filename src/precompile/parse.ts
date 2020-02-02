import * as fs from 'fs'
import * as readline from 'readline';
import * as path from "path";
import {ReadStream} from "fs";

const sourceResourcesPath = path.dirname(path.dirname(__dirname)) + "/src/resources/";


let readStream: ReadStream;
if(fs.existsSync('/var/lib/dpkg/status')) {
    readStream =  fs.createReadStream('/var/lib/dpkg/status.real');
} else {
    readStream = fs.createReadStream(sourceResourcesPath + 'status')
}

let rl = readline.createInterface({
    input: readStream
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
    ReverseDepends: (Dependency | null)[];

    constructor(id: number, packageName: string, description: string, depends: (Dependency | null)[],  reverseDepends: (Dependency | null)[]) {
        this.ID = id;
        this.Description = description;
        this.PackageName = packageName;
        this.Depends = depends;
        this.ReverseDepends = reverseDepends;
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
    accumulatedPackagesInfo.sort(
        (a, b) =>
            (a.PackageName > b.PackageName) ? 1 : -1);

    pkgInfo.packages = accumulatedPackagesInfo.map(currentPackageInfo => {
        let dependencies: (Dependency | null)[] | undefined = currentPackageInfo.Depends?.split(",").map(stringValue => {

            let possibleDependenciesString: string[] = stringValue.trim().split("|");
            let matchFound = false;
            return possibleDependenciesString.map(dependencyName => {

                let matchingPackages = accumulatedPackagesInfo.filter(otherDependency => {
                    //console.log(dependencyName + " : " + otherDependency.PackageName)
                    return otherDependency.PackageName === dependencyName.split("(")[0].trim();
                });
                if (matchingPackages.length > 0 && !matchFound) {
                    matchFound = true;
                    return <Dependency>{name: possibleDependenciesString.join(" | "), id: matchingPackages[0].ID};
                } else {
                    return null;
                }
            }).filter(possibleDependency => possibleDependency !== null)[0]
        });
        return new SinglePackageInfo(
            currentPackageInfo.ID,
            currentPackageInfo.PackageName,
            currentPackageInfo.Description,
            dependencies ? dependencies : [],
            []
        );
    });

    pkgInfo.packages.forEach((singlePackageInfo) => {
        singlePackageInfo.Depends.forEach((dependency) => {
            let reverseDependencyPackages = pkgInfo.packages.filter((singlePackageInfo) => {
                return singlePackageInfo.ID === dependency?.id;
            });
            reverseDependencyPackages.forEach((reverseSinglePackageInfo) => {
                reverseSinglePackageInfo.ReverseDepends.push(<Dependency>{
                    id: singlePackageInfo.ID,
                    name: singlePackageInfo.PackageName
                });
            })
        });
    });

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
