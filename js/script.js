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

    // let mapView = new mapView(idMapArray)
    let treeView = null;
    let famView = null;

    treeView = new tree(idMapArray, parentMap, mapView);
    famView = new FamilyView(idMap,parentMap, treeView);


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