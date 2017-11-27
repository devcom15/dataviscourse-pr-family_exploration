class tree{

    constructor(idMap, parentMap)
    {
        this.idMap = idMap;
        this.parentMap = parentMap;
        this.generations = [];
        this.dataToDisplay = [];

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
            .domain([1900, 2020])
            .range([0, 900]);

        var pixelToYear = d3.scaleLinear()
            .domain([50, 950])
            .range([1900, 2020]);

        this.numOfGenderScale = d3.scaleLinear()
            .range([45, 90])
            .domain([(this.maxMales > this.maxFemales ? this.maxMales : this.maxFemales), 0]);

        this.avgLifeScale = d3.scaleLinear()
            .range([0, 45])
            .domain([(this.maxAvgMaleAge > this.maxAvgFemaleAge ? this.maxAvgMaleAge : this.maxAvgFemaleAge),
                (this.minAvgMaleAge > this.minAvgFemaleAge ? this.minAvgMaleAge : this.minAvgFemaleAge)]);

        console.log('maxAVGMaleAge: ', this.maxAvgMaleAge);
        console.log('minAVGMaleAge: ', this.minAvgMaleAge);
        console.log('maxAVGFeMaleAge: ', this.maxAvgFemaleAge);
        console.log('minAVGFeMaleAge: ', this.minAvgFemaleAge);

        let genderAxis = d3.axisLeft(this.numOfGenderScale);

        let avgLifeAxis = d3.axisLeft(this.avgLifeScale);

        let yearAxis = d3.axisBottom(this.yearScale);

        let axisSVG = d3.select("#birth-year-selection").append("svg")
            .attr("width", 1000)
            .attr("height", 150);

        //YEAR AXIS
        axisSVG.append("g").attr("width", 900)
            .attr("height", 150)
            .call(yearAxis).attr("transform", "translate(50,103)")
            .selectAll("text")
            .attr("font-size", "10");

        //AGE AXIS
        axisSVG.append('g')
            .attr('width', 50)
            .attr('height', 45)
            .call(avgLifeAxis.tickValues([14,30,46.6])).attr("transform", "translate(50, 3)")
            .selectAll("text")
            .attr("font-size", "10");

        axisSVG.append('line')
            .attr('x1', 50)
            .attr('y1', 48.7)
            .attr('x2', 950)
            .attr('y2', 48.7)
            .attr('stroke', 'black');


        //GENDER NUMBER AXIS
        axisSVG.append('g')
            .attr('width', 50)
            .attr('height', 45)
            .call(genderAxis.tickValues([0,11, 22])).attr("transform", "translate(50,13)")
            .selectAll("text")
            .attr("font-size", "10");

        //GENDER LINE GRAPHS
        console.log(this.maleNumPoints);

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
            .attr('transform', 'translate(50,13)');

        axisSVG.append('g').selectAll("path")
            .data([this.femaleNumPoints])
            .enter().append("path")
            .attr("class", "line")
            .attr("d", genderline)
            .attr('stroke', '#C6ABBD')
            .attr('transform', 'translate(50,13)');

        //AGE LINE GRAPHS
        yScale = this.avgLifeScale;

        axisSVG.append('g').selectAll("path")
            .data([this.maleAvgPoints])
            .enter().append("path")
            .attr("class", "line")
            .attr("d", genderline)
            .attr('stroke', '#7FB4C6')
            .attr('transform', 'translate(50,3)');

        axisSVG.append('g').selectAll("path")
            .data([this.femaleAvgPoints])
            .enter().append("path")
            .attr("class", "line")
            .attr("d", genderline)
            .attr('stroke', '#C6ABBD')
            .attr('transform', 'translate(50,3)');

        console.log('dataLength: ', this.idMap);

        //AGE LINE GRAPHS


        // axisSVG.append('text').text('Birth Year Selector: ')
        //     .attr("x", 500)
        //     .attr('y', 50)
        //     .attr("dy", ".35em")
        //     .style("text-anchor", "middle");

        var filter = this.filterDrawData;

        var reDraw = this.drawTree;

        var thisObject = this;

        this.dataToDisplay = this.generations.slice();

        var reDrawData = this.dataToDisplay;

        //console.log(reDrawData);

        function brushed() {
            var selection = d3.event.selection;

            //console.log(selection);

            let minYearRange = pixelToYear(selection[0]);

            let maxYearRange = pixelToYear(selection[1]);

            //console.log('MinYear: ', minYearRange, ' MaxYear: ', maxYearRange)

            console.log('RedrawData', reDrawData);

            let filteredData = filter(minYearRange, maxYearRange, reDrawData);

            //console.log('JustBefore Draw', reDrawData);

            reDraw(filteredData, thisObject);
        }

        var brush = d3.brushX().extent([[50,3],[950,103]]).on("end", brushed);

        axisSVG.append("g").attr("class", "brush").call(brush);
    }

    makeGenderNumPaths(gender)
    {
        let linePoints = [];

        //used for min/max for axis
        let calculatedValues = []


        for(let i = 1900; i < 2021; i++)
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

                //console.log(deathValue);


                if(+this.idMap[j].birthdate <= i && this.idMap[j].gender == gender && deathValue > i)
                {
                    countForYear += 1;
                }
            }

            linePoints.push({'x': i, 'y': countForYear});

            // if(i == 1900)
            // {
            //     path += 'M ' + this.yearScale(i) + ' ' + this.numOfGenderScale(countForYear) + ' ';
            // }
            // else if(i == 2020)
            // {
            //     path += 'L ' + this.yearScale(i) + ' ' + countForYear;
            // }
            // else
            // {
            //     path += 'L ' + this.yearScale(i) + ' ' + countForYear + ' ';
            // }

            calculatedValues.push(countForYear);
        }
        //console.log('LinePoints: ', linePoints);

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


        for(let i = 1900; i < 2021; i++)
        {
            let countForYear = 0;
            let agesSummed = 0;

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

                //console.log(deathValue);


                if(+this.idMap[j].birthdate <= i && this.idMap[j].gender == gender && deathValue > i)
                {
                    countForYear += 1;
                    agesSummed += (i - this.idMap[j].birthdate);
                }
            }

            linePoints.push({'x': i, 'y': (agesSummed / countForYear)});

            // if(i == 1900)
            // {
            //     path += 'M ' + this.yearScale(i) + ' ' + this.numOfGenderScale(countForYear) + ' ';
            // }
            // else if(i == 2020)
            // {
            //     path += 'L ' + this.yearScale(i) + ' ' + countForYear;
            // }
            // else
            // {
            //     path += 'L ' + this.yearScale(i) + ' ' + countForYear + ' ';
            // }

            calculatedValues.push(agesSummed / countForYear);
        }
        //console.log('LinePoints: ', linePoints);

        if(gender == 'M')
        {
            this.maxAvgMaleAge = calculatedValues.reduce(function(a, b) {
                return Math.max(a, b);});
            this.minAvgMaleAge = calculatedValues.reduce(function(a, b) {
                return Math.min(a, b);});
        }
        if(gender == 'F')
        {
            this.maxAvgFemaleAge = calculatedValues.reduce(function(a, b) {
                return Math.max(a, b);});
            this.minAvgFemaleAge = calculatedValues.reduce(function(a, b) {
                return Math.min(a, b);});
        }

        return linePoints;
    }

    filterDrawData(minYear, maxYear, data){

        /*var returnArray = data.slice();

        console.log('Data: ', data);

        console.log('Return Array', returnArray);*/

        return data.map(d => {
            return d.filter(innerD => {
                return innerD.birthdate >= minYear && innerD.birthdate <= maxYear;
            });
        });

        /*for(let i = 0; i < returnArray.length; i++)
        {
            for(let j = 0; j < returnArray[i].length; j++)
            {
                if(!(returnArray[i][j].birthdate >= minYear && returnArray[i][j].birthdate <= maxYear))
                {
                    returnArray[i].splice(j, 1);
                }
            }
        }

        //console.log('DataAfterEdit:, ',data);

        return returnArray;*/

    }

    drawTree(drawData, treeObject)
    {
        //draw framing rectangles for generatinos
        d3.select('#tree').select('svg').remove();

        var circleEvent = treeObject.circleOnClick;
        var thisObject = this;

        var treeSVG = d3.select("#tree").append('svg')
            .attr('width', 1000)
            .attr('height', 600);

        let generationRects = treeSVG.selectAll('rect').data(drawData);

        generationRects.exit().remove();

        generationRects.enter().append('rect').merge(generationRects)
            .attr('x', 100)
            .attr('y', (d,i) => (i * 140))
            .attr('height', 100)
            .attr('width', 800)
            .classed('generationFrame', true);

        for(let i = 0; i < drawData.length; i++)
        {
            //console.log(drawData);

            let genBlockCircles = treeSVG.append('g').attr('id', 'gen'+i).selectAll('circle').data(drawData[i]);

            genBlockCircles.exit().remove();



            genBlockCircles.enter().append('circle').merge(genBlockCircles)
                .attr('cx', (d,i) => (i * 50))
                .attr('cy', (i * 140) + 50)
                .attr('r', 12)
                .attr('id', d => d.id)
                .attr('transform', 'translate(120,0)')
                .on('click', d => circleEvent(d.id, thisObject))
                .style('fill', d => {
                    if(d.gender === 'M')
                    {
                        return '#7FB4C6';
                    }
                    else
                    {
                        return '#C6ABBD';
                    }
                });
                // .classed('treeCircle', true);


        }

        //this.dataToDisplay = this.generations.slice();
    }

    circleOnClick(id, treeObject)
    {
        let member = treeObject.getMemberEntry(id);

        d3.select('#tree').selectAll('line').remove();

        treeObject.drawLinesToChildren(member);

        treeObject.drawLinesToParents(member)

        //treeObject.drawTree(treeObject.dataToDisplay);

        console.log('CircleClicked: ', member);
    }

    drawLinesToChildren(member)
    {
        let parentCircle = d3.select('#' + member.id);

        console.log(member.id);

        let parentCircleX = parentCircle.attr('cx');

        console.log('ParentCircleX: ', parentCircleX);

        let parentCircleY = parentCircle.attr('cy');

        console.log('ParentCircleY: ', parentCircleY);

        //Draw line to each child
        for(let i = 0; i < member.children.length; i++)
        {
            let childCircle = d3.select('#' + member.children[i]);

            let childCircleX = childCircle.attr('cx');
            let childCircleY = childCircle.attr('cy');

            d3.select('#tree').select('svg').append('line')
                .attr('x1', parentCircleX)
                .attr('y1', parentCircleY)
                .attr('x2', childCircleX)
                .attr('y2', childCircleY)
                .attr('stroke', 'black')
                .attr('transform', 'translate(120,0)')
                .classed('line', true);

        }

    }

    drawLinesToParents(member)
    {

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

    buildInitialDataSets()
    {

        //console.log('idMap: ', this.idMap);

        //console.log('parentMap: ', this.parentMap)


        //build generation 0
        this.generations[0] = [];

        this.generations[0].push(this.idMap[50])

        //console.log('generation 0: ', this.generations[0])


        //console.log('gen0info', this.generations[0][0].children);

        //build generation 1
        this.generations[1] = [];
        for(let i = 0; i < this.generations[0][0].children.length; i++)
        {
            this.generations[1].push(this.getMemberEntry(this.generations[0][0].children[i]));
        }

        //console.log('generation 1: ', this.generations[1]);

        //build generation 2
        this.generations[2] = [];
        //for each member of gen 1
        for(let i = 0; i < this.generations[1].length; i++)
        {
            //add in each child of previous gen member
            for(let j = 0; j < this.generations[1][i].children.length; j++)
            {
                if(this.getMemberEntry(this.generations[1][i].children[j]).id !== -1) {
                    this.generations[2].push(this.getMemberEntry(this.generations[1][i].children[j]));
                }
            }
        }

        //console.log('generation 2: ', this.generations[2]);

        //build generation 3
        this.generations[3] = [];
        //for each member of gen 1
        for(let i = 0; i < this.generations[2].length; i++)
        {
            //add in each child of previous gen member
            for(let j = 0; j < this.generations[2][i].children.length; j++)
            {
                if(this.getMemberEntry(this.generations[2][i].children[j]).id !== -1) {
                    this.generations[3].push(this.getMemberEntry(this.generations[2][i].children[j]));
                }
            }
        }

        //console.log('generation 3: ', this.generations[3]);

        console.log(this.generations);

        this.dataToDisplay = this.generations.slice();

        this.drawTree(this.dataToDisplay, this);
        //
        //identify list of spouses who are not part of the core family line we are analyzing
        // for(let i = 0; i < this.generations.length; i++)
        // {
        //     for(let j = 0; j < this.generations[i].length; j++)
        //     {
        //         if(this.generations[i][j].spouse !== null) {
        //             if (this.getMemberEntry(this.generations[i][j].spouse).id !== -1) {
        //                 this.generations[i].splice(j + 1, 0, this.getMemberEntry(this.generations[i][j].spouse));
        //             }
        //         }
        //     }
        // }
        //
        // for(let i = 0; i < this.generations.length; i++)
        // {
        //     console.log('Generation: ' + i, this.generations[i]);
        // }
    }

}


