d3.json('data/clint_family.json',function(data){
    let idMap = {};
    let parentMap = {}

    data.forEach(function(d) {
        idMap[d.id] = d;
        d.children.forEach(function(child) {
            if(!parentMap[child]){
                parentMap[child] = [];
            }
           parentMap[child].push(d.id);
        });
    });

    let famView = new FamilyView(idMap,parentMap);
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