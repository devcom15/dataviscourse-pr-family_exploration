class FamilyView {
    constructor(idMap, parentMap, treeView) {
        this.idMap = idMap;
        this.parentMap = parentMap;
        this.treeView = treeView;
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
        console.log("Starting loadview with id: " + id);
        let self = this;
        d3.selectAll(".child").remove();
        d3.selectAll("img").remove();
        d3.selectAll(".text").remove();
        let root = this.idMap[id];

        let middle = d3.select(".middle");
        let bottom = d3.select(".bottom");
        let left = d3.select(".left");
        let right = d3.select(".right");

        let idText = root.firstname;
        if(root.spouse) {
            idText += " and " + this.idMap[root.spouse].firstname;
        }
        idText += " " + root.lastname;

        if(root.spouse || root.children.length > 0) {
            console.log("id is: " + id + " familypath ahoy is: " + root.familypath);
            if(root.familypath) {
                middle.append("img")
                    .attr("src",self.rootPath + root.familypath)
                    .classed("unclickable",true);

            } else {
                middle.append("img")
                    .attr("src",self.rootPath + id + ".jpg")
                    .classed("unclickable",true)
            }

            middle.append("div")
                .classed("text",true)
                .text(idText);

            if(root.children.length > 0) {
                root.children.forEach(function(c) {
                    let id = self.idMap[c];
                    let div = bottom.append("div")
                        .classed("child",true);

                    div.append("div")
                        .classed("childtext", true)
                        .text(id.firstname)

                        div.append("img")
                        .attr("src", function() {
                            return self.rootPath + c + ".jpg";
                        })
                        .attr("alt", id.firstname)
                        .on('click', function() {
                            self.loadView(c);
                        });
                })
            }
            if(root.gender == "M") {
                if (this.parentMap[id]) {
                    let p = this.idMap[this.parentMap[id][0]];
                    self.addLeftFamily(p);
                }
                left.append("img")
                    .attr("src", self.rootPath + id + ".jpg")
                    .on('click', function() {
                        self.showIndividual(id)
                    });
                if(!this.parentMap[id]) {
                    left.select("img")
                        .attr("id","addmargin");
                }
                left.append("div")
                    .classed("text",true)
                    .classed("singleperson",true)
                    .text(self.idMap[id].firstname);

                if(root.spouse) {
                    if(this.parentMap[root.spouse]) {
                        let p = this.idMap[this.parentMap[root.spouse][0]];
                        self.addrightFamily(p)
                    }
                    right.append("img")
                        .attr("src", self.rootPath + root.spouse + ".jpg")
                        .on('click', function() {
                            self.showIndividual(root.spouse)
                        })
                    right.append("div")
                        .classed("text",true)
                        .classed("singleperson",true)
                        .text(self.idMap[root.spouse].firstname);
                    if(!this.parentMap[root.spouse]) {
                        right.select("img")
                            .attr("id","addmargin")
                    }
                }
            } else {
                if (this.parentMap[id]) {
                    let p = this.idMap[this.parentMap[id][0]];
                    self.addrightFamily(p);
                }
                right.append("img")
                    .attr("src", self.rootPath + id + ".jpg")
                    .on('click', function() {
                        self.showIndividual(id)
                    })
                right.append("div")
                    .classed("text",true)
                    .classed("singleperson",true)
                    .text(root.firstname);
                if (!this.parentMap[id]) {
                    right.select("img")
                        .attr("id","addmargin");
                }
                if(root.spouse) {
                    if(this.parentMap[root.spouse]) {
                        let p = this.idMap[this.parentMap[root.spouse][0]];
                        self.addLeftFamily(p)
                    }
                    left.append("img")
                        .attr("src", self.rootPath + root.spouse + ".jpg")
                        .on('click', function() {
                            self.showIndividual(root.spouse)
                        })
                    left.append("div")
                        .classed("text",true)
                        .classed("singleperson",true)
                        .text(self.idMap[root.spouse].firstname);
                    if(!this.parentMap[root.spouse]) {
                        left.select("img")
                            .attr("id","addmargin");
                    }
                }
            }
        } else {
            this.showIndividual(id);
        }
    }

    showIndividual(id) {
        let self = this;
        let root = this.idMap[id];

        d3.selectAll("img").remove();
        d3.selectAll(".child").remove();
        d3.selectAll(".text").remove();

        let middle = d3.select(".middle");
        let bottom = d3.select(".bottom");

        middle.append("img")
            .attr("src", this.rootPath + id + ".jpg");

        if(root.familypath) {
            middle.select("img")
                .on('click', function() {
                self.loadView(id);
            })
        } else if(root.children[0]) {
            middle.select("img")
                .on('click', function() {
                    self.loadView(id)
                })
        } else {
            middle.select("img")
                .classed("unclickable",true);
        }

        if (this.parentMap[id]) {
            let p1 = this.idMap[this.parentMap[id][0]];
            let p2 = this.idMap[this.parentMap[id][1]];
            this.addParent(p1);
            this.addParent(p2);
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
        let left = d3.select(".left");
        left.append("img")
            .attr("src", function() {
                if(parent.familypath) {
                    return self.rootPath + parent.familypath;
                }
                else {
                    return self.rootPath + parent.id + ".jpg";
                }
            })
            .on('click', function() {
                self.loadView(parent.id);
            })

        let text = parent.firstname;
        if(parent.spouse) {
            text += " and " + this.idMap[parent.spouse].firstname;
        }
        text += " " + parent.lastname;

        left.append("div")
            .classed("text",true)
            .classed("sidefamily",true)
            .text(text);
    }

    addrightFamily(parent) {
        let self = this;
        let right = d3.select(".right");
        right.append("img")
            .attr("src", function() {
                if(parent.familypath) {
                    return self.rootPath + parent.familypath;
                }
                else {
                    return self.rootPath + parent.id + ".jpg";
                }
            })
            .on('click', function() {
                self.loadView(parent.id);
            })

        let text = parent.firstname;
        if(parent.spouse) {
            text += " and " + this.idMap[parent.spouse].firstname;
        }
        text += " " + parent.lastname;

        right.append("div")
            .classed("text",true)
            .classed("sidefamily",true)
            .text(text);
    }

    addLeftParent(id) {
        let self = this;
        let left = d3.select(".left");
        left.append("img")
            .attr("src",function() {
                return self.rootPath + id.id + ".jpg"
            })
            .on('click', function() {
                self.loadView(id.id);
            })
    }
    addRightParent(id) {
        let self = this;
        let right = d3.select(".right");
        right.append("img")
            .attr("src",function() {
                return self.rootPath + id.id + ".jpg"
            })
            .on('click', function() {
                console.log("calling load on " + id.id);
                self.loadView(id.id);
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
