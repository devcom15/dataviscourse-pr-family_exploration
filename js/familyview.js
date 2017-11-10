class FamilyView {
    constructor(idMap, parentMap) {
        this.idMap = idMap;
        this.parentMap = parentMap;
        this.rootPath = "/dataviscourse-pr-family_exploration/data/photos/";
        this.altBoy = this.rootPath + "boy_alt.jpg";
        this.altGirl = this.rootPath + "girl_alt.jpg";
        this.loadView("clintonr87");
    }

    loadView(id) {

        d3.selectAll("img").remove();
        let root = this.idMap[id];
        let middle = d3.select("#middle");
        middle.append("img")
            .attr("src",this.rootPath + id + ".jpg");
        console.log(id);
        console.log(this.idMap[this.parentMap[id]]);
        let p1 = this.idMap[this.parentMap[id][0]];
        let p2 = this.idMap[this.parentMap[id][1]]
        this.addParent(p1);
        this.addParent(p2);
    }

    addParent(p) {
        if(p) {
            if(p.gender == "M")
                this.addLeft(p);
            else
                this.addRight(p);
        }
    }

    addLeft(id) {
        let self = this;
        let left = d3.select("#left");
        left.append("img")
            .attr("src",function() {
                  return self.rootPath + id.id + ".jpg";
            })
            .on('click', function() {
                self.loadView(id.id);
            })
    }
    addRight(id) {
        let self = this;
        let right = d3.select("#right");
        right.append("img")
            .attr("src",function() {
                    return self.rootPath + id.id + ".jpg";
            })
            .on('click', function() {
                self.loadView(id.id);
            })
            .on('hover', function() {

            })
    }


    imageExists(person)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', "/data/photos/" + person.id + ".jpg", false);
        http.send();
        return http.status!=404;
    }
}
