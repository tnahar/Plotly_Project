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
    });
};

function optionChanged() {
    d3.select('select').on('change', function () {
        showData();
    })
}

