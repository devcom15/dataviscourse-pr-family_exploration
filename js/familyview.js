class FamilyView {
    constructor(idMap, parentMap) {
        this.idMap = idMap;
        this.parentMap = parentMap;
        this.rootPath = "/data/photos/";
        if(!this.imageExists("clintonr87")) {
            this.rootPath = "/dataviscourse-pr-family_exploration" + this.rootPath;
        }
        this.altBoy = this.rootPath + "boy_alt.jpg";
        this.altGirl = this.rootPath + "girl_alt.jpg";
        this.altFamily = this.rootPath + "family_alt.jpg";

        this.loadView("clintonr87");
    }

    loadView(id) {
        let self = this;
        d3.selectAll("img").remove();
        let root = this.idMap[id];

        let middle = d3.select("#middle");
        let bottom = d3.select("#bottom");
        let left = d3.select("#left");

        if(root.spouse || root.children.length > 0) {
            if(root.familypath) {
                middle.append("img")
                    .attr("src",self.rootPath + root.familypath)
            } else {
                middle.append("img")
                    .attr("src",self.rootPath + id + ".jpg");
            }
            if(root.children.length > 0) {
                root.children.forEach(function(c) {
                    bottom.append("img")
                        .attr("src", function() {
                            return self.rootPath + c + ".jpg";
                        })
                        .attr("alt", self.idMap[c].firstname)
                        .on('click', function() {
                            self.loadView(c);
                        });
                })
            }
            console.log("id is " + id);
            if(this.parentMap[id]) {
                let p = this.idMap[this.parentMap[id][0]];
                if(root.gender == "M") {
                    this.addLeftFamily(p);
                } else {
                    this.addrightFamily(p);
                }
            }
            if(root.spouse && this.parentMap[root.spouse]) {
                let p = this.idMap[this.parentMap[root.spouse][0]];
                console.log("Checking gender forspouse of " + root.id);
                if(self.idMap[root.spouse].gender == "M") {
                    this.addLeftFamily(p);
                } else {
                    this.addrightFamily(p);
                }
            }
        } else {
            middle.append("img")
                .attr("src",this.rootPath + id + ".jpg");
            if(this.parentMap[id]) {
                let p1 = this.idMap[this.parentMap[id][0]];
                let p2 = this.idMap[this.parentMap[id][1]];
                this.addParent(p1);
                this.addParent(p2);
            }
        }
    }

    addParent(p) {
        if(p) {
            if(p.gender == "M")
                this.addLeftParent(p);
            else
                this.addRightParent(p);
        }
    }

    addLeftFamily(parent) {
        let self = this;
        let left = d3.select("#left");
        left.append("img")
            .attr("src", function() {
                if(parent.familypath) {
                    return self.rootPath + parent.familypath;
                }
                else {
                    return self.altFamily;
                }
            })
            .on('click', function() {
                self.loadView(parent.id);
            })
    }

    addrightFamily(parent) {
        let self = this;
        let left = d3.select("#right");
        left.append("img")
            .attr("src", function() {
                if(parent.familypath) {
                    return self.rootPath + parent.familypath;
                }
                else {
                    return self.altFamily;
                }
            })
            .on('click', function() {
                self.loadView(parent.id);
            })
    }

    addLeftParent(id) {
        let self = this;
        let left = d3.select("#left");
        left.append("img")
            .attr("src",function() {
                if(self.imageExists(id.id)) {
                    return self.rootPath + id.id + ".jpg"
                }
                else {
                    return self.altBoy;
                }
            })
            .on('click', function() {
                self.loadView(id.id);
            })
    }
    addRightParent(id) {
        let self = this;
        let right = d3.select("#right");
        right.append("img")
            .attr("src",function() {
                if(self.imageExists(id.id)) {
                    return self.rootPath + id.id + ".jpg"
                }
                else {
                    return self.altGirl;
                }
            })
            .on('click', function() {
                self.loadView(id.id);
            })
            .on('hover', function() {

            })
    }


    imageExists(id)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', "/data/photos/" + id + ".jpg", false);
        http.send();
        return http.status!=404;
    }
}
