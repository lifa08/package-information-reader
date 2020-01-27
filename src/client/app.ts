import { packagesInfo } from '../resources/status'
import {Menu, MenuItem} from './components/menu'
import { PackageInformation } from './components/packageInformation'
import {SinglePackageInfo} from "../precompile/parse";

class App {
    packageInfos: SinglePackageInfo[];

    constructor(packageInfos: SinglePackageInfo[]) {
        this.packageInfos = packageInfos;

        window.addEventListener('load', () => {
            this.initPage()
        });
    }

    initPage() {
        this.displayMenu()
    }

    private displayMenu() {
        let menuItems : MenuItem[] = this.packageInfos.map((singlePackageInfo) => {
            return <MenuItem>{
                name : singlePackageInfo.PackageName,
                url: "",
                clickAction: () => {
                    this.showPackageInformation(singlePackageInfo.ID)
                }}
        });
        let leftMenu = new Menu(menuItems);
        App.appendElementsAsChildren("menu", leftMenu.elements());
    }

    private showPackageInformation(packageID: number) {
        let matchingPackages: SinglePackageInfo[] = this.packageInfos.filter((singlePackage: SinglePackageInfo) => {
            return singlePackage.ID === packageID
        });
        if(matchingPackages.length == 1) {
            let packageInformation = new PackageInformation(matchingPackages[0], (packageID: number) => {
                this.showPackageInformation(packageID)
            });
            App.appendElementsAsChildren("package-information", packageInformation.elements());
        }
    }

    private static appendElementsAsChildren(elementId : string, elements : Element) {
        let possibleElement: HTMLElement | null = document.getElementById(elementId);
        if(possibleElement != null) {
            possibleElement.innerHTML = "";
            possibleElement.appendChild(elements);
        }
    }

}

new App(packagesInfo.packages);
