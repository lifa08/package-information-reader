import {Dependency, SinglePackageInfo} from "../../precompile/parse";

interface DependencyClickCallback {
    (packageID: number): void
}

export class PackageInformation {
    packageInformation: SinglePackageInfo;
    dependencyClickCallback: DependencyClickCallback;
    scrollFromTopWhenClickingPackage: number;

    constructor(packageInformation: SinglePackageInfo, dependencyClickCallback: DependencyClickCallback, scrollFromTopWhenClickingPackage: number) {
        this.packageInformation = packageInformation;
        this.dependencyClickCallback = dependencyClickCallback;
        this.scrollFromTopWhenClickingPackage = scrollFromTopWhenClickingPackage;
    }

    elements() {
        let wrapperDiv = document.createElement("div");
        wrapperDiv.setAttribute("style", "margin-top: " + this.scrollFromTopWhenClickingPackage + "px;");
        let titleDiv = document.createElement("div");
        titleDiv.innerHTML = '<span class="header">Package name: </span>' + this.packageInformation.PackageName;
        titleDiv.className = "title";
        let descriptionDiv = document.createElement("div");
        descriptionDiv.innerHTML = '<span class="header">Description: </span>' + this.packageInformation.Description;
        descriptionDiv.className = "description";

        // Dependencies
        let dependenciesDiv = this.dependencyList("Depends: ", this.packageInformation.Depends);
        let reverseDependenciesDiv = this.dependencyList("Reverse depends: ", this.packageInformation.ReverseDepends);

        wrapperDiv.appendChild(titleDiv);
        wrapperDiv.appendChild(descriptionDiv);
        wrapperDiv.appendChild(dependenciesDiv);
        wrapperDiv.appendChild(reverseDependenciesDiv);
        return wrapperDiv
    }

    dependencyList(listTitle: string, dependencies: (Dependency | null)[]) {
        let dependenciesDiv = document.createElement("div");
        dependenciesDiv.className = "dependencies";
        let dependenciesTitleDiv = document.createElement("div");
        dependenciesTitleDiv.innerHTML = '<span class="header">' + listTitle + ' </span>';
        dependenciesDiv.appendChild(dependenciesTitleDiv);

        if (dependencies.length === 0) {
            let noDependencyDiv = document.createElement("div");
            noDependencyDiv.innerHTML = "No dependencies.";
            noDependencyDiv.className = "no-dependencies";
            dependenciesDiv.appendChild(noDependencyDiv);
        } else {
            let ulDiv = document.createElement("ul");
            dependenciesDiv.appendChild(ulDiv);

            dependencies.map((dependency: Dependency | null) => {
                if (dependency !== null) {
                    let liDiv = document.createElement("li");
                    liDiv.className = "dependency";
                    let aDiv = document.createElement("a");
                    aDiv.onclick = () => {
                        this.dependencyClickCallback(dependency.id);
                    };
                    aDiv.innerText = dependency.name;
                    liDiv.appendChild(aDiv);
                    ulDiv.appendChild(liDiv)
                }
            });
        }
        return dependenciesDiv;
    }
}