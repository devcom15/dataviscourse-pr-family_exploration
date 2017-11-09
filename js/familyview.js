class FamilyView {
    constructor(idMap, parentMap) {
        this.idMap = idMap;
        this.parentMap = parentMap;

        this.loadView("clintonr87");
    }

    loadView(id) {
        let root = this.idMap[id];
        console.log(root);
    }
}