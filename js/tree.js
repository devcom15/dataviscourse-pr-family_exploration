class tree{

    constructor(idMap, parentMap)
    {
        this.idMap = idMap;
        this.parentMap = parentMap;
        this.generations = [];
        this.dataToDisplay = [];

        this.buildInitialDataSets();

        this.drawAxis();
    }

    drawAxis()
    {
        var yearScale = d3.scaleLinear()
            .domain([1900, 2020])
            .range([0, 900]);

        var pixelToYear = d3.scaleLinear()
            .domain([50, 950])
            .range([1900, 2020]);

        let yearAxis = d3.axisTop(yearScale);

        let axisSVG = d3.select("#birth-year-selection").append("svg")
            .attr("width", 1000)
            .attr("height", 150);

        axisSVG.append("g").attr("width", 900)
            .attr("height", 150)
            .call(yearAxis).attr("transform", "translate(50,100)")
            .selectAll("text")
            .attr("font-size", "10");

        axisSVG.append('text').text('Birth Year Selector: ')
            .attr("x", 500)
            .attr('y', 50)
            .attr("dy", ".35em")
            .style("text-anchor", "middle");

        var filter = this.filterDrawData;

        var reDraw = this.drawTree;

        this.dataToDisplay = this.generations.slice();

        var reDrawData = this.dataToDisplay;

        //console.log(reDrawData);

        function brushed() {
            var selection = d3.event.selection;

            //console.log(selection);

            let minYearRange = pixelToYear(selection[0]);

            let maxYearRange = pixelToYear(selection[1]);

            //console.log('MinYear: ', minYearRange, ' MaxYear: ', maxYearRange)



            filter(minYearRange, maxYearRange, reDrawData);

            //console.log('JustBefore Draw', reDrawData);

            reDraw(reDrawData);
        }

        var brush = d3.brushX().extent([[50,75],[950,115]]).on("end", brushed);

        axisSVG.append("g").attr("class", "brush").call(brush);
    }

    filterDrawData(minYear, maxYear, data){
        for(let i = 0; i < data.length; i++)
        {
            for(let j = 0; j < data[i].length; j++)
            {
                if(!(data[i][j].birthdate >= minYear && data[i][j].birthdate <= maxYear))
                {
                    data[i].splice(j, 1);
                }
            }
        }

        //console.log('DataAfterEdit:, ',data);

    }

    drawTree(drawData)
    {
        //draw framing rectangles for generatinos
        d3.select('#tree').select('svg').remove();

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
                .attr('transform', 'translate(120,0)')
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

        this.drawTree(this.dataToDisplay);
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


