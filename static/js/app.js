showOptions();
showData();
optionChanged();

function showOptions() {
    d3.json('/samples').then(data => {

        var { names } = data;
        names.forEach(name => {
            d3.select('select').append('option').text(name);
        });
    });
};

function showData() {
    d3.json('/samples').then(data => {
        var { metadata, samples } = data;
        var selection = d3.select('select').property('value');

        d3.select('.panel-body').html('');
        metadata = metadata.filter(obj => obj.id == selection)[0];
        Object.entries(metadata).forEach(([key, val]) => {
            d3.select('.panel-body').append('h5').text(`${key.toUpperCase()}: ${val}`);
        });

        samples = samples.filter(obj => obj.id == selection)[0];
        var { otu_ids, otu_labels, sample_values } = samples;

        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            }
        }];

        Plotly.newPlot('bubble', bubbleData);

        // BAR

        d3.json("/samples").then((sdata) => {
            subject_id = selection;
            var samples = sdata['samples'];
            var filtered_samples = samples.filter(s => s['id'] == subject_id);
            var sample_values = filtered_samples.map(s => s['sample_values']);
            var otu_ids = filtered_samples.map(s => s['otu_ids']);
            var otu_labels = ''
            var x = sample_values[0].slice(0,10).reverse();
            var y = otu_ids[0].slice(0,10).map(o => `OTU ${o}`).reverse();
            var data = [{
              type: 'bar',
              x: x,
              y: y,
              orientation: 'h'
            }];
            
            Plotly.newPlot('bar', data);
        });
         // gauge chart

         var gaugeData = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: metadata.wfreq,
              title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 400 },
              gauge: { axis: { range: [0, 9] } }
            }
          ];
          
          var layout = { width: 600, height: 400 };
          Plotly.newPlot('gauge', gaugeData, layout);
   

    });
}
function optionChanged() {
    d3.select('select').on('change', function () {
        showData();
    })
}