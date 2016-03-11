function HeatMapTimeLine(parameters) {

  /*
  contains  object of the form:
  {'start': new Date(2012, 4, 25), 'content': 'First'},
  */

this.timelineElements = new vis.DataSet({}); //list of visJS map objects
this.drawTimeline = function (drawPoint) {
  const items = this.timelineElements;

    // create visualization
    var container = document.getElementById(drawPoint);
    var options = {
      height: '300px',
      start: new Date(1860, 0, 1),
      end: new Date(1864, 0, 1),
      min: new Date(1860, 0, 1),                // lower limit of visible range
      max: new Date(1864, 0, 1),                // upper limit of visible range
      zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
      zoomMax: 1000 * 60 * 60 * 24 * 31 * 3     // about three months in milliseconds
    };

    // create the timeline
    var timeline = new vis.Timeline(container);
    timeline.setOptions(options);
    timeline.setItems(items);

    //addEventListeners for timeline

    timeline.on('select', function (properties) {
        console.log(properties.nodes);
    });
    timeline.on('rangechanged',function (properties) {
      const start = properties.start;
      const end = properties.end;

    });
};
if(parameters.hasOwnProperty('mapId') && parameters.hasOwnProperty('timelineId')) {
var blur = document.getElementById('blur');
var radius = document.getElementById('radius');

var vector = new ol.layer.Heatmap({
  source: new ol.source.Vector({
    url: './data/fix.kml',
    projection: "EPSG:3857",
    format: new ol.format.KML({
      extractStyles: false
    })
  }),
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10)
});

vector.getSource().on('addfeature', function(event) {
  // our KML stores the weight of each feature in a
  // standards-violating  tag in each Placemark.  We extract it from
  // the Placemark's name instead.
  const featureDateRaw = event.feature["id_"]; //get date for timeline
  //process date into valid format
  const dateParts = featureDateRaw.split(" ");
  const month  = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(dateParts[1]) / 3 + 1; // convert month string into number
  const date = new Date(dateParts[0],Math.round(month),dateParts[2]);
  //add VisJS Object for feature
  this.timelineElements.add([{
    'start': date,
    'content': featureDateRaw
  }]);
    var name = event.feature.get('name');
    var magnitude = parseFloat(name.substr(2));
    event.feature.set('weight', magnitude*100 - 5);

},this);
//base layer
var raster = new ol.layer.Tile({
      source: new ol.source.OSM()
    });
//define map
var map = new ol.Map({
  layers: [raster, vector],
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});
console.log("bob");
this.drawTimeline(parameters.timelineId);
} else  {
  alert("invalid constructor");
}


blur.addEventListener('input', function() {
  vector.setBlur(parseInt(blur.value, 10));
});

radius.addEventListener('input', function() {
  vector.setRadius(parseInt(radius.value, 10));


});
};
var app =  new HeatMapTimeLine({mapId:"map",timelineId:"timeline"});
