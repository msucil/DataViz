let data = [4, 8, 15, 16, 23, 42, 100];
let widthScale = d3.scaleLinear().domain([0, d3.max(data)]).range([0, 500]);


let chart = d3.select("#barchart");
let bars = chart.selectAll("div");
let barupdate = bars.data(data);

let barEnter = barupdate.enter().append("div");
barEnter
    .style("width", function (d) {
        return widthScale(d) + 'px';
    })
    .text(function (d) {
        return d;

    });


let width = 500;
let height = 20;
let svgWidthScale = d3.scaleLinear().domain([0, d3.max(data)]).range([0, width]);

let svgBarChart = d3.select('#svgChart').attr('width', width).attr('height', height * data.length);

let svgBars = svgBarChart.selectAll('g').data(data).enter().append('g').attr('transform', function (d, i) {
    return 'translate(0,' + i * height + ')';
});

svgBars.append("rect").attr('width', svgWidthScale).attr('height', height - 1);
svgBars.append('text').attr("x", function (d) {
    return svgWidthScale(d) - 3;
})
    .attr("y", height / 2)
    .attr("dy", ".35em")
    .text(function (d) {
        return d;
    });

/** Character Frequency **/
let barHeight = 500;
let chartWidth = 960;
let margin = {top: 20, right: 30, bottom: 30, left: 40};

let contentWidth = chartWidth - margin.left - margin.right;
let contentHeight = barHeight - margin.bottom - margin.top;

let y = d3.scaleLinear().rangeRound([contentHeight, 0]);
let x = d3.scaleBand().rangeRound([0, contentWidth]).padding(0.1);

let charFreq = d3.select('#charFreq').attr('width', chartWidth).attr('height', barHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

let xAxis = d3.axisBottom(x);
let yAxis = d3.axisLeft(y).ticks(10, '%');

d3.tsv('../dataset/charFrequency.tsv').then(function (data) {
    y.domain([0, d3.max(data, function (d) {
        return d.frequency;
    })]);

    x.domain(data.map((d) => {return d.letter;}));

    charFreq.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + contentHeight + ')')
        .call(xAxis);
    charFreq.append('g').attr('class', 'y axis').call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    let freqBar = charFreq.selectAll('.bar').data(data).enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.letter)})
        .attr('y', function(d) { return y(d.frequency)})
        .attr('width', x.bandwidth())
        .attr('height', function (d) {
            return contentHeight - y(d.frequency);
        });

    charFreq.selectAll('.value').data(data).enter().append('text').attr('class', 'value')
        .attr('x', function (d) {
            return x(d.letter) + x.bandwidth();
        })
        .attr('y', function (d) {
            return y(d.frequency) - 10;
        })
        .attr('text-anchor', 'start')
        .attr('dy', '.75em')
        .text(function (d) {
            return d.frequency;
        });
}, function (error) {
    console.log(error);
});