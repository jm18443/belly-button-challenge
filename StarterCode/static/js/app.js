// Initializing the page and calling the other functions
function startup() {

    // Grabbing the dropdown element
    var selector = d3.select('#selDataset');

    d3.json("samples.json").then(function(samplesData){
        var names = samplesData.names;

        selector.selectAll('option')
            .data(names)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d);

        // Take in the first name upon loading the page
        var starter = names[0];

        // Call other functions using starter name
        buildPlots(starter);
        demographics(starter);

    });
};

// Dynamic changing of plots and demographics upon change in dropdown
function optionChanged(newID){
    buildPlots(newID);
    demographics(newID);
};



// Building Bar Chart and Bubble Chart
function buildPlots(id) {
    // Reading in the json dataset
    d3.json("samples.json").then(function(samplesData){
        // console.log(samplesData);
        // Filtering for the id selected
        var filtered = samplesData.samples.filter(sample => sample.id == id);
        var result = filtered[0];
        // console.log(filtered)
        // console.log(result)

        // creating variables and storing the top 10 in an array

        Data = [];
        for (i=0; i<result.sample_values.length; i++){
            Data.push({
                id: `OTU ${result.otu_ids[i]}`,
                value: result.sample_values[i],
                label: result.otu_labels[i]
            });
        }
        // console.log(Data);

        // Sorting the data and slicing for top10
        var Sorted = Data.sort(function compareFunction(a,b){
            return b.value - a.value;
        }).slice(0,10);
        

        // Since horizontal bar chart, need to reverse to display from top to bottom in descending order
        var reversed = Sorted.sort(function compareFunction(a,b){
            return a.value - b.value;
        })
        
        var traceBar = {
            type: "bar",
            orientation: 'h',
            x: reversed.map(row=> row.value),
            y: reversed.map(row => row.id),
            text: reversed.map(row => row.label)
        };

        var data = [traceBar];

        var layout = {
            yaxis: {autorange: true},
        };

        // Creating the Horizontal Bar Chart
        Plotly.newPlot("bar", data, layout);

        // Bubble Chart
        var trace1 = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: 'markers',
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
                colorscale: 'Jet'
            },
        };

        var data1 = [trace1]

        var layout1 = {
            
            xaxis: {title:'OTU ID'},
            width: window.width
        };

        // Creating Bubble Chart
        Plotly.newPlot('bubble', data1, layout1);

    })
}

function demographics(id) {
    d3.json('samples.json').then(function(samplesData){
        var filtered = samplesData.metadata.filter(sample => sample.id == id);

        
        var selection = d3.select('#sample-metadata');

        
        selection.html('');

        // Appending data extracted into the panel
        Object.entries(filtered[0]).forEach(([k,v]) => {
            selection.append('h5')
                .text(`${k}: ${v}`);
        });
    })
}

startup();