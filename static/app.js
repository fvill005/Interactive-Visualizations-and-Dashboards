  //reading in the data from the json file
    //using oject.entries to add a key value an pair to the meta panel
    function updatemetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filterArray[0];
        var metaPanel = d3.select("#sample-metadata");
        metaPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })
    
    });
  }
  
  function update_charts(sample) {    
   //importing data from json file
   //filtering the array and declaring var to build plots

    d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = filterArray[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;   
    
    // declaring trace for bubble chart
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"cyl"
        }
    };
    var data = [trace1];
    //formatting chart with layout 
    var layout = {
        title: 'Bacteria per Sample',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU ID " +sample},
        margin: {t:30}
    };
    //building plot 
    Plotly.newPlot('bubble', data, layout); 
    
    //seting up trace for the horizontal bar chart 
    //slicing the array since we only need top 10
    //reversing labels so we can get results in descending order
    //changing color of bar graph for fun
    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {
            color: 'rgb(100,200,189)',
            opacity: 0.7,
          }
    
    };
    var data = [trace1];
    var layout = {
        title: "Top Ten OTUs " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100}
       
    };
    Plotly.newPlot("bar", data, layout);  
    });
  }
  
  function init() {

  // Select the dropdown element
  var selector = d3.select("#selDataset");
    
  // add IDs to the dropdown from the list of sample Names
    d3.json("data/samples.json").then((data) => {
      var subject_Ids = data.names;
      subject_Ids.forEach((id) => {
        selector
        .append("option")
        .text(id)
        .property("value", id);
      });
    
    // Use the first subject ID from the names to build initial plots
    var firstID = subject_Ids[0];
    update_charts(firstID);
    updatemetadata(firstID);
  });

  // updating and fetching new data when a different value is selected in the drop down 
  }
  function optionChanged(newID) {
    update_charts(newID);
     updatemetadata(newID);
   }
  // Initialize the dashboard
  init();


  

