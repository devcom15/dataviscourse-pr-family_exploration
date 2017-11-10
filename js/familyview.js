class FamilyView {
    constructor(idMap, parentMap) {
        this.idMap = idMap;
        this.parentMap = parentMap;

        this.loadView("clintonr87");
    }

    loadView(id) {
        let rootPath = "/data/photos/";
        let root = this.idMap[id];
        let middle = d3.select("#middle");
        middle.append("img")
            .attr("src",rootPath + id + ".jpg");

        let left = d3.select("#left");
       // left.append("img")
       //     .attr("src",this.idMap[this.parentMap[id][0]].id)

        console.log(this.parentMap);

        console.log(root);
        console.log(this.idMap[this.parentMap[id][0]].id)
    }
}