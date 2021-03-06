class tree{

    constructor(idMap, parentMap, mapView, famView)
    {
        this.idMap = idMap;
        this.parentMap = parentMap;
        this.generations = [];
        this.dataToDisplay = [];

        this.famView = famView;
        this.map = mapView;

        this.maxMales = 20;
        this.maxFemales = 30;

        this.minAvgMaleAge = 60;
        this.maxAvgMaleAge = 70;

        this.minAvgFemaleAge = 61;
        this.maxAvgFemaleAge = 72;

        this.yearScale = null;
        this.numOfGenderScale = null;
        this.avgLifeScale = null;


        this.buildInitialDataSets();

        this.femaleNumPoints = this.makeGenderNumPaths('F');
        this.maleNumPoints = this.makeGenderNumPaths('M');

        this.femaleAvgPoints = this.makeGenderAgePaths('F');
        this.maleAvgPoints = this.makeGenderAgePaths('M');

        this.drawAxis();
    }

    drawAxis()
    {
        this.yearScale = d3.scaleLinear()
            .domain([1865, 2020])
            .range([0, 480]);

        var pixelToYear = d3.scaleLinear()
            .domain([100, 581])
            .range([1865, 2020]);

        this.numOfGenderScale = d3.scaleLinear()
            .range([45, 90])
            .domain([(this.maxMales > this.maxFemales ? this.maxMales : this.maxFemales), 0]);

        this.avgLifeScale = d3.scaleLinear()
            .range([0, 45])
            .domain([(this.maxAvgMaleAge > this.maxAvgFemaleAge ? this.maxAvgMaleAge : this.maxAvgFemaleAge),
                (this.minAvgMaleAge > this.minAvgFemaleAge ? this.minAvgMaleAge : this.minAvgFemaleAge)]);

        let genderAxis = d3.axisLeft(this.numOfGenderScale);

        let avgLifeAxis = d3.axisLeft(this.avgLifeScale);

        let yearAxis = d3.axisBottom(this.yearScale);

        let axisSVG = d3.select("#birth-year-selection").append("svg")
            .attr("width", 1000)
            .attr("height", 150)
            .attr('transform', 'translate(0,0)');

        //YEAR AXIS
        axisSVG.append("g").attr("width", 900)
            .attr("height", 150)
            .call(yearAxis).attr("transform", "translate(100,103)")
            .selectAll("text")
            .attr("font-size", "10");

        //AGE AXIS
        axisSVG.append('g')
            .attr('width', 50)
            .attr('height', 45)
            .call(avgLifeAxis.tickValues([0,23.5,46.6])).attr("transform", "translate(100, 4)")
            .selectAll("text")
            .attr("font-size", "10");

        axisSVG.append('line')
            .attr('x1', 50)
            .attr('y1', 48.7)
            .attr('x2', 530)
            .attr('y2', 48.7)
            .attr('stroke', 'black')
            .attr('transform', 'translate(50,1)');


        //GENDER NUMBER AXIS
        axisSVG.append('g')
            .attr('width', 50)
            .attr('height', 45)
            .call(genderAxis.tickValues([0,11, 22])).attr("transform", "translate(100,14)")
            .selectAll("text")
            .attr("font-size", "10");

        var xScale = this.yearScale;
        var yScale = this.numOfGenderScale;

        var genderline = d3.line()
            .x(function(d) { return xScale(d.x);})
            .y(function(d) { return yScale(d.y);});

        axisSVG.append('g').selectAll("path")
            .data([this.maleNumPoints])
            .enter().append("path")
            .attr("class", "line")
            .attr("d", genderline)
            .attr('stroke', '#7FB4C6')
            .attr('transform', 'translate(100,14)');

        axisSVG.append('g').selectAll("path")
            .data([this.femaleNumPoints])
            .enter().append("path")
            .attr("class", "line")
            .attr("d", genderline)
            .attr('stroke', '#C6ABBD')
            .attr('transform', 'translate(100,14)');

        //AGE LINE GRAPHS
        yScale = this.avgLifeScale;

        axisSVG.append('g').selectAll("path")
            .data([this.maleAvgPoints])
            .enter().append("path")
            .attr("class", "line")
            .attr("d", genderline)
            .attr('stroke', '#7FB4C6')
            .attr('transform', 'translate(100,4)');

        axisSVG.append('g').selectAll("path")
            .data([this.femaleAvgPoints])
            .enter().append("path")
            .attr("class", "line")
            .attr("d", genderline)
            .attr('stroke', '#C6ABBD')
            .attr('transform', 'translate(100,4)');

        //LABELS
        axisSVG.append('text').text('Birth Year')
            .attr("x", 270)
            .attr('y', 130)
            .attr("dy", ".35em")
            .style('font-size', '12px')
            .style("text-anchor", "middle");

        axisSVG.append('text').text('Average Age')
            .attr("x", 10)
            .attr('y', 24)
            .attr("dy", ".35em")
            .style('font-size', '12px')
            .style("text-anchor", "start");

        axisSVG.append('text').text('Gender Count')
            .attr("x", 10)
            .attr('y', 81)
            .attr("dy", ".35em")
            .style('font-size', '12px')
            .style("text-anchor", "start");

        axisSVG.append('text').text('Male')
            .attr("x", 30)
            .attr('y', 120)
            .attr("dy", ".35em")
            .attr('fill', '#7FB4C6')
            .style('font-size', '12px')
            .style("text-anchor", "start");

        axisSVG.append('text').text('Female')
            .attr("x", 30)
            .attr('y', 132)
            .attr("dy", ".35em")
            .attr('fill', '#C6ABBD')
            .style('font-size', '12px')
            .style("text-anchor", "start");

        var filter = this.filterDrawData;

        var reDraw = this.drawTree;

        var thisObject = this;

        this.dataToDisplay = this.generations.slice();

        var reDrawData = this.dataToDisplay;

        var US = this.map
        function brushed() {
            var selection = d3.event.selection;

            console.log(selection);

            let minYearRange = pixelToYear(selection[0]);

            let maxYearRange = pixelToYear(selection[1]);

            let filteredData = filter(minYearRange, maxYearRange, reDrawData);

            reDraw(filteredData, thisObject);
            US.update(filteredData);
        }

        var brush = d3.brushX().extent([[100,3],[581,103]]).on("end", brushed);

        axisSVG.append("g").attr("class", "brush").call(brush);
    }

    makeGenderNumPaths(gender)
    {
        let linePoints = [];

        //used for min/max for axis
        let calculatedValues = []


        for(let i = 1865; i < 2021; i++)
        {
            let countForYear = 0;

            for(let j = 0; j < this.idMap.length; j++)
            {
                let deathValue = 0;

                if(this.idMap[j].death == null)
                {
                    deathValue = 2021;
                }
                else
                {
                    deathValue = this.idMap[j].death;
                }

                if(+this.idMap[j].birthdate <= i && this.idMap[j].gender == gender && deathValue > i)
                {
                    countForYear += 1;
                }
            }

            linePoints.push({'x': i, 'y': countForYear});

            calculatedValues.push(countForYear);
        }

        if(gender == 'M')
        {
            this.maxMales = calculatedValues.reduce(function(a, b) {
                return Math.max(a, b);});
        }
        if(gender == 'F')
        {
            this.maxFemales = calculatedValues.reduce(function(a, b) {
                return Math.max(a, b);});
        }

        return linePoints;
    }

    makeGenderAgePaths(gender)
    {
        let linePoints = [];

        //used for min/max for axis
        let calculatedValues = []

        for(let i = 1865; i < 2021; i++)
        {
            let countForYear = 0;
            let agesSummed = 0;

            for(let j = 0; j < this.idMap.length; j++)
            {
                let deathValue = 0;

                if(this.idMap[j].death === null)
                {
                    deathValue = 2021;
                }
                else
                {
                    deathValue = this.idMap[j].death;
                }

                if(+this.idMap[j].birthdate <= i && this.idMap[j].gender === gender && deathValue > i)
                {
                    countForYear += 1;
                    agesSummed += (i - this.idMap[j].birthdate);
                }
            }

            if(agesSummed === 0 || countForYear === 0)
            {
                linePoints.push({'x': i, 'y': 0});
                calculatedValues.push(0);
            }
            else
            {
                linePoints.push({'x': i, 'y': (agesSummed / countForYear)});
                calculatedValues.push(agesSummed / countForYear);
            }


        }

        if(gender === 'M')
        {
            this.maxAvgMaleAge = calculatedValues.reduce(function(a, b) {
                return Math.max(a, b);});
            this.minAvgMaleAge = calculatedValues.reduce(function(a, b) {
                return Math.min(a, b);});
        }
        if(gender === 'F')
        {
            this.maxAvgFemaleAge = calculatedValues.reduce(function(a, b) {
                return Math.max(a, b);});
            this.minAvgFemaleAge = calculatedValues.reduce(function(a, b) {
                return Math.min(a, b);});
        }

        return linePoints;
    }

    filterDrawData(minYear, maxYear, data){

        return data.map(d => {
            return d.filter(innerD => {
                return innerD.birthdate >= minYear && innerD.birthdate <= maxYear;
            });
        });
    }

    drawTree(drawData, treeObject)
    {
        //draw framing rectangles for generatinos
        d3.select('#tree').select('svg').remove();

        var circleEvent = treeObject.circleOnClick;
        var thisObject = treeObject;

        var treeSVG = d3.select("#tree").append('svg')
            .attr('width', 1000)
            .attr('height', 230)
            .attr('id', 'treeSVG')
            .attr('transform', 'translate(0,0)');

        let generationRects = treeSVG.selectAll('rect').data(drawData);

        generationRects.exit().remove();

        generationRects.enter().append('rect').merge(generationRects)
            .attr('x', 100)
            .attr('y', (d,i) => (i * 40))
            .attr('height', 25)
            .attr('width', 480)
            .classed('generationFrame', true);

        treeSVG.append('g').attr('id', 'links');

        for(let i = 0; i < drawData.length; i++)
        {
            let genBlockCircles = treeSVG.append('g').attr('id', 'gen'+i).selectAll('circle').data(drawData[i]);

            genBlockCircles.exit().remove();


            genBlockCircles.enter().append('circle').merge(genBlockCircles)
                .attr('cx', (d,i) => (i * 20))
                .attr('cy', (i * 40) + 12)
                .attr('r', 0)
                .attr('id', d => d.id)
                .attr('transform', 'translate(120,0)')
                .on('click', d => circleEvent(d.id, thisObject,true))
                .on('mouseover', function(d){
                    console.log(d)
                    if (d.death == null){
                        var testo = d.firstname + " " + d.lastname + ", " + d.birthdate + "-" + "Present";
                    } else{
                        var testo = d.firstname + " " + d.lastname + ", " + d.birthdate + "-" + d.death;
                    }

                    d3.select('#ttp')
                        .style("opacity", .9)
                        .style("left", (d3.event.pageX) + "px")     
                        .style("top", (d3.event.pageY - 28) + "px")
                        .text(testo);
                    })
                .on('mouseout', function(d){
                    console.log("C")
                    d3.select('#ttp')
                        .style("opacity", .0)
                        .style("left", (d3.event.pageX) + "px")     
                        .style("top", (d3.event.pageY - 28) + "px")
                        .text('ciao');
                    })
                .style('fill', d => {
                    if(d.gender === 'M')
                    {
                        return '#7FB4C6';
                    }
                    else
                    {
                        return '#C6ABBD';
                    }
                })
                .transition().duration(2000).attr('r', 8);
        }

        treeObject.drawLinesToSpouses();
    }

    circleOnClick(id, treeObject, callFam)
    {
        if(treeObject.famView && callFam) {
            treeObject.famView.loadView(id, true);
        }

        let member = treeObject.getMemberEntry(id);

        console.log('MemberClicked: ', member);

        d3.select('#tree').selectAll('circle').classed('selectedCircle', false);

        d3.select('#' + member.id).classed('selectedCircle', true);

        d3.select('#links').selectAll('line').remove();

        treeObject.drawLinesToChildren(member);

        treeObject.drawLinesToParents(member, treeObject);

        treeObject.drawLinesToSpouses();
        treeObject.map.tree_clicked(id);
    }

    drawLinesToChildren(member)
    {
        let parentCircle = d3.select('#' + member.id);

        if(parentCircle.empty())
        {
            return;
        }

        let parentCircleX = parentCircle.attr('cx');

        let parentCircleY = parentCircle.attr('cy');

        //Draw line to each child
        for(let i = 0; i < member.children.length; i++)
        {
            let childCircle = d3.select('#' + member.children[i]);

            if(!childCircle.empty()) {

                let childCircleX = childCircle.attr('cx');
                let childCircleY = childCircle.attr('cy');

                d3.select('#links').append('line')
                    .attr('x1', parentCircleX)
                    .attr('y1', parentCircleY)
                    .attr('x2', childCircleX)
                    .attr('y2', childCircleY)
                    .attr('transform', 'translate(120,0)')
                    .classed('links', true);
            }

        }

    }

    drawLinesToParents(member, treeObject)
    {
        if (treeObject.parentMap[member.id]) {

            let parents = []
            parents.push(treeObject.parentMap[member.id][0]);
            parents.push(treeObject.parentMap[member.id][1]);

            let childCircle = d3.select('#' + member.id);

            if(childCircle.empty())
            {
                return;
            }

            let childCircleX = childCircle.attr('cx');

            let childCircleY = childCircle.attr('cy');

            for(let i = 0; i < parents.length; i++)
            {
                let parentCircle = d3.select('#' + parents[i]);

                if(!parentCircle.empty()) {

                    let parentCircleX = parentCircle.attr('cx');
                    let parentCircleY = parentCircle.attr('cy');

                    d3.select('#links').append('line')
                        .attr('x1', parentCircleX)
                        .attr('y1', parentCircleY)
                        .attr('x2', childCircleX)
                        .attr('y2', childCircleY)
                        .attr('transform', 'translate(120,0)')
                        .classed('links', true);
                }
            }
        }
        else
        {
            //Do nothing
        }
    }

    drawLinesToSpouses()
    {
        for(let i = 0; i < this.idMap.length; i++)
        {
            let currentMember = this.getMemberEntry(this.idMap[i].id);

            let currentMemberCircle = d3.select('#' + this.idMap[i].id);

            if(currentMember.spouse !== null && !currentMemberCircle.empty())
            {
                let currentMemberSpouseCircle = d3.select('#' + currentMember.spouse);

                if(!currentMemberSpouseCircle.empty()) {

                    let cmcX = currentMemberCircle.attr('cx');
                    let cmcY = currentMemberCircle.attr('cy');

                    let cmcsX = currentMemberSpouseCircle.attr('cx');
                    let cmcsY = currentMemberSpouseCircle.attr('cy');

                    d3.select('#links').append('line')
                        .attr('x1', cmcX)
                        .attr('y1', cmcY)
                        .attr('x2', cmcX)
                        .attr('y2', cmcsY)
                        .attr('transform', 'translate(120,0)')
                        .classed('spouselinks', true)
                        .transition().duration(2000).attr('x2', cmcsX);
                }
            }
        }
    }

    getMemberEntry(memberId)
    {
        let member = {'id': -1}

        for(let i = 0; i < this.idMap.length; i++)
        {

            if(this.idMap[i].id === memberId)
            {
                member = this.idMap[i];
                break;
            }
        }


        return member;
    }

    buildInitialDataSets() {
        //build generation 0
        this.generations[0] = [];

        let genZeroIds = ['loiss72', 'johns71', 'charlottep76', 'levip66', 'vernab95', 'clintonb95',
            'bernicer98', 'jamesr97'];

        for (let i = 0; i < this.idMap.length; i++) {
            for (let j = 0; j < genZeroIds.length; j++) {
                if (this.idMap[i].id === genZeroIds[j]) {
                    this.generations[0].push(this.idMap[i]);
                }
            }
        }

        //build generation 1
        this.generations[1] = [];
        for (let k = 0; k < this.generations[0].length; k++)
        {
            for (let i = 0; i < this.generations[0][k].children.length; i++) {
                let member = this.getMemberEntry(this.generations[0][k].children[i]);

                if(!this.containsObject(member, this.generations[1])) {
                    this.generations[1].push(this.getMemberEntry(this.generations[0][k].children[i]));
                }
            }
        }

        //build generation 2
        this.generations[2] = [];
        //for each member of gen 1
        for(let i = 0; i < this.generations[1].length; i++)
        {
            //add in each child of previous gen member
            for(let j = 0; j < this.generations[1][i].children.length; j++)
            {
                let member = this.getMemberEntry(this.generations[1][i].children[j]);

                if(member.id !== -1) {
                    if(!this.containsObject(member, this.generations[2])) {
                        this.generations[2].push(this.getMemberEntry(this.generations[1][i].children[j]));
                    }
                }
            }
        }

        //build generation 3
        this.generations[3] = [];
        //for each member of gen 1
        for(let i = 0; i < this.generations[2].length; i++)
        {
            //add in each child of previous gen member
            for(let j = 0; j < this.generations[2][i].children.length; j++)
            {
                let member = this.getMemberEntry(this.generations[2][i].children[j]);

                if(this.getMemberEntry(this.generations[2][i].children[j]).id !== -1) {
                    if(!this.containsObject(member, this.generations[3])) {
                        this.generations[3].push(this.getMemberEntry(this.generations[2][i].children[j]));
                    }
                }
            }
        }

        //BUILD GEN 4
        //build generation 3
        this.generations[4] = [];
        //for each member of gen 1
        for(let i = 0; i < this.generations[3].length; i++)
        {
            //add in each child of previous gen member
            for(let j = 0; j < this.generations[3][i].children.length; j++)
            {
                let member = this.getMemberEntry(this.generations[3][i].children[j]);

                if(this.getMemberEntry(this.generations[3][i].children[j]).id !== -1) {
                    if(!this.containsObject(member, this.generations[4])) {
                        this.generations[4].push(this.getMemberEntry(this.generations[3][i].children[j]));
                    }
                }
            }
        }

        //ADD IN OTHER SPOUSES
        let newGen3 = []
        //for gen3, insert spouses
        for(let i = 0; i < this.generations[3].length; i++)
        {
            let currentMember = this.getMemberEntry(this.generations[3][i].id);
            newGen3.push(currentMember);

            if(currentMember.spouse != null) {
                let currentMemberSpouse = this.getMemberEntry(this.generations[3][i].spouse);
                newGen3.push(currentMemberSpouse);
            }

        }

        this.generations[3] = newGen3;

        //for each gen, place spouses together
        for(let i = 0; i < this.generations.length; i++)
        {
            let currentGen = this.generations[i];
            let newGen = []

            for(let j = 0; j < currentGen.length; j++)
            {
                let currentMember = this.getMemberEntry(currentGen[j].id);

                newGen.push(currentMember);

                if(currentMember.spouse != null)
                {
                    let currentMemberSpouse = this.getMemberEntry(currentMember.spouse);

                    newGen.push(currentMemberSpouse);

                    this.removeMemberFromList(currentMember.spouse, currentGen);
                }
            }

            this.generations[i] = newGen;
        }

        this.dataToDisplay = this.generations.slice();

        this.drawTree(this.dataToDisplay, this);
    }


    containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    }

    removeMemberFromList(objId, list)
    {
        for(let i = 0; i < list.length; i++)
        {
            if(list[i].id === objId)
            {
                list.splice(i,1);
                break;
            }
        }
    }
}


