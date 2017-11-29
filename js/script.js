d3.json('data/clint_family.json',function(data){
    let idMap = {};
    let parentMap = {};

    let idMapArray = [];

    data.forEach(function(d) {
        idMap[d.id] = d;
        idMapArray.push(d);
        d.children.forEach(function(child) {
            if(!parentMap[child]){
                parentMap[child] = [];
            }
           parentMap[child].push(d.id);
        });
    });

    let mapView = null
    let treeView = null;
    let famView = null;

    mapView = new USmap()
    famView = new FamilyView(idMap,parentMap);
    treeView = new tree(idMapArray, parentMap, famView);
    window.setTimeout(famView.setTree(treeView),1000);

});

/*
/*"id":
"firstname":
"lastname":
"birthdate":
"hobby":
"gender":
"city":
"state":
"pathindividualphoto":null,
"pathfamilyphoto":null,
"spouse":
"children": []
}/*
 */