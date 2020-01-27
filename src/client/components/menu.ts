interface MenuItemCallback {
    (): void
}

export interface MenuItem {
    name : string,
    url: string,
    clickAction: MenuItemCallback
}

export class Menu {
    items : MenuItem[];

    constructor(items: MenuItem[]) {
        this.items = items;
    }

    elements() {
        let ulElement = document.createElement("ul");
        this.items.forEach(menuItem => {
            let liElement = document.createElement("li");
            let aElement = document.createElement("a");
            aElement.onclick = menuItem.clickAction;
            aElement.innerHTML = menuItem.name;
            liElement.appendChild(aElement);
            ulElement.appendChild(liElement);
        });
        return ulElement;
    }
}