
// Adding tile layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});


var map = L.map("map", {
  center: [30.0997, -94.5786],
  zoom: 4,
  layers: [lightmap]
});

function chooseSize(mag) {
  return int(mag);
}


function color_options(xx){
  var clr="yellow"
  var colors=["#62DD0F","#9CC97E","#D8DB30","#D3952A","#D36B2A","#D62620"]
  x=xx[2];

  if (x>=-10 && x<=10){
    clr=colors[0]
    console.log("Hello")
  }
  else if (x>10 && x<=30){
    clr=colors[1]
  }
  else if (x>30 && x<=50){
    clr=colors[2]
  }
  else if (x>50 && x<=70){
    clr=colors[3]
  }
  else if (x>70 && x<=90){
    clr=colors[4]
  }
  else if(x>90){
    clr=colors[5]
  }
  return clr
   
}

function get_color(d){
  var colors=["#62DD0F","#9CC97E","#D8DB30","#D3952A","#D36B2A","#D62620"]
  return d==='-10 to 10' ? colors[0]:
        d==='10 to 30' ? colors[1]:
        d==='30 to 50' ? colors[2]:
        d==='50 to 70' ? colors[3]:
        d==='70 to 90' ? colors[4]:
        d==='90+' ? colors[5]:
        "yellow";
}

var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Legend</strong>'],
    categories = ['-10 to 10','10 to 30','30 to 50','50 to 70','70 to 90','90+'];

    for (var i = 0; i < categories.length; i++) {
             
            labels.push(
              "<i class=\"square\" style=\"background-color: " + get_color(categories[i]) + "\">"+categories[i]+"</i>");
        }

        div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map)

// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link).then(function (data) {
  console.log(data)
  console.log(data.features[0].properties.mag)
  console.log(data.features[0].geometry.coordinates[2])
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius:3*feature.properties.mag,
        fillColor:color_options(feature.geometry.coordinates),
        color:"black",
        weight: 0.1,
        opacity: 5,
        fillOpacity:0.8
        
      });
    },
    onEachFeature: function(feature, layer){
      layer.bindPopup("Place: "+feature.properties.place + "<br>" + "Magnitude: "+feature.properties.mag)
    }
  }).addTo(map);
});




