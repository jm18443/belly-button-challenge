function startup() {
    
    var selector = d3.select('#selDataset');

    d3.json("samples.json").then(function(samplesData){
        var names = samplesData.names;

        selector.selectAll('option')
            .data(names)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d);

        
        var initial = names[0];

        
        buildPlots(initial);
        demographics(initial);

    });
};

function optionChanged(newID){
    buildPlots(newID);
    demographics(newID);
};




function buildPlots(id) {
    
    d3.json("samples.json").then(function(samplesData){
        var filtered = samplesData.samples.filter(sample => sample.id == id);
        var result = filtered[0];

        Data = [];
        for (i=0; i<result.sample_values.length; i++){
            Data.push({
                id: `OTU ${result.otu_ids[i]}`,
                value: result.sample_values[i],
                label: result.otu_labels[i]
            });
        }

        var Sorted = Data.sort(function compareFunction(a,b){
            return b.value - a.value;
        }).slice(0,10);
        
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
        
        Plotly.newPlot("bar", data, layout);

    
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

      
        Plotly.newPlot('bubble', data1, layout1);

    })
}

function demographics(id) {
    d3.json('samples.json').then(function(samplesData){
        var filtered = samplesData.metadata.filter(sample => sample.id == id);

        
        var selection = d3.select('#sample-metadata');

        
        selection.html('');
        
        Object.entries(filtered[0]).forEach(([k,v]) => {
            selection.append('h5')
                .text(`${k}: ${v}`);
        });
    })
}

startup();