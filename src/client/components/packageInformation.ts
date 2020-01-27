import {Dependency, SinglePackageInfo} from "../../precompile/parse";

interface DependencyClickCallback {
    (packageID: number): void
}

export class PackageInformation {
    packageInformation : SinglePackageInfo;
    dependencyClickCallback : DependencyClickCallback;

    constructor(packageInformation: SinglePackageInfo, dependencyClickCallback: DependencyClickCallback) {
        this.packageInformation = packageInformation;
        this.dependencyClickCallback = dependencyClickCallback;
    }

    elements() {
        let wrapperDiv = document.createElement("div");
        let titleDiv = document.createElement("div");
        titleDiv.innerHTML = this.packageInformation.PackageName;
        let descriptionDiv = document.createElement("div");
        descriptionDiv.innerHTML = this.packageInformation.Description;
        let dependenciesDiv = document.createElement("div");
        this.packageInformation.Depends.map((dependency: Dependency | null) => {
            if(dependency !== null) {
                let linkDiv = document.createElement("div");
                let aDiv = document.createElement("a");
                aDiv.onclick = () => {
                    this.dependencyClickCallback(dependency.id);
                };
                aDiv.innerText = dependency.name;
                linkDiv.appendChild(aDiv);
                dependenciesDiv.appendChild(linkDiv)
            }
        });

        wrapperDiv.appendChild(titleDiv);
        wrapperDiv.appendChild(descriptionDiv);
        wrapperDiv.appendChild(dependenciesDiv);
        return wrapperDiv
    }
}