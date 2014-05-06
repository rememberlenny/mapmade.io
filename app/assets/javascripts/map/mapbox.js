// var click = document.getElementById('click'),
//     mousemove = document.getElementById('mousemove');

var MapApp = function(){
  this.allGeoJSON = [];
}

MapApp.prototype.initialize = function(){
  this.loadMap();
  this.mouseActions();
}

MapApp.prototype.countMarkers = function(){
  var self = this;
  this._markers = [];
  this.markers  = [];
  this.map.eachLayer(
    function(marker){ self._markers.push(marker) }
  );
  this.saveMarkers();
}

MapApp.prototype.saveMarkers = function(){
  // Called by this.countMarkers()
  var self = this;
  for( var i = 0; i< self._markers.length; i++ ){
    // Defining variables inside if statements is bad practice
    // Nested code also sucks to read
    var hasGeoJSONprop = (self._markers[i]._geojson !== undefined);
    if( hasGeoJSONprop ){
      var geometryProp = self._markers[i]._geojson.geometry;
      var hasGeometryProp = (geometryProp !== undefined);
      if( hasGeometryProp ){
        var hasPoint = (geometryProp.type !== undefined );
        if( hasPoint ){
          var isPoint = (geometryProp.type === "Point" );
          if( isPoint ){
            if(location.search === "?test=true"){ console.log( self._markers[i] ); }
            self.markers.push(self._markers[i]);
          }
        }
      }
    }
  }
}

MapApp.prototype.loadMap = function(){
    this.map = L.mapbox
               .map('map', 'lkbgift.i30dhib8',  { zoomControl: false })
               .setView([40.714623, -74.00663], 16);

}

MapApp.prototype.mouseActions = function(){
  var self = this;
  this.map.on('mousemove', function(e) {
    if(location.search === "?test=true"){ console.log( e.containerPoint.toString() + ', ' + e.latlng.toString()); }
  });
  this.map.on('click', function(e) {
    if(location.search === "?test=true"){ $('#longitudeInput').val(e.latlng.lng); }
    if(location.search === "?test=true"){ $('#latitudeInput').val(e.latlng.lat); }

    // Creates map marker on click
    self.createMarker(e.latlng.lng, e.latlng.lat);
  });
}

MapApp.prototype.createMarker = function(lng, lat, title, desc){
  var args  = arguments;
  var lng   = args[0];
  var lat   = args[1];
  if(typeof args[2] === 'undefined'){ var desc  = ''; } else { var title  = args[2]; }
  if(typeof args[3] === 'undefined'){ var desc  = ''; } else { var desc   = args[3]; }

  new mapApp.MapboxMarker(lng, lat, title, desc);
}

MapApp.prototype.MapboxMarker = function (lng, lat, title, desc){
  var map = mapApp.map;
  var geoData = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [parseFloat(lng), parseFloat(lat)]
    },
    "properties": {
      "title": title,
      "description": desc,
      "marker-color": "#fc4353",
      "marker-size": "large",
      "marker-symbol": "harbor"
    }
  }
  L.mapbox.featureLayer(geoData).addTo(mapApp.map);
  var myLayer = L.mapbox.featureLayer().addTo(map);
}