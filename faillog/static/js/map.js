var data = [];

function parseData(response) {
    for(var ip in response) {
        if (response.hasOwnProperty(ip)) {
            key = Object.keys(response[ip])[0];

            latitude = response[ip][key]['location']['latitude'];
            longitude = response[ip][key]['location']['longitude'];
            console.log(latitude);
            exists = false;
            for(var i = 0; i < data.length; i++) {
                if (data[i]['lat'] == latitude && data[i]['lng'] == longitude) {
                    data[i] = {
                        lat: latitude,
                        lng: longitude,
                        count: entry['count'] += 1
                    };
                    exists = true;
                }
            }
            if (!exists) {
                entry = {
                    lat: latitude,
                    lng: longitude,
                    count: 1
                };
                data.push(entry);
            }
        }
    }
    console.log(data);
}


window.onload = function() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                response = JSON.parse(xmlhttp.responseText);
                var testData = {
                    max: 8,
                    data: parseData(response)
                };
                var baseLayer = L.tileLayer(
                  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
                    maxZoom: 18
                  }
                );
                var cfg = {
                  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                  "radius": 2,
                  "maxOpacity": .8, 
                  // scales the radius based on map zoom
                  "scaleRadius": true, 
                  // if set to false the heatmap uses the global maximum for colorization
                  // if activated: uses the data maximum within the current map boundaries 
                  //   (there will always be a red spot with useLocalExtremas true)
                  "useLocalExtrema": true,
                  // which field name in your data represents the latitude - default "lat"
                  latField: 'lat',
                  // which field name in your data represents the longitude - default "lng"
                  lngField: 'lng',
                  // which field name in your data represents the data value - default "value"
                  valueField: 'count'
                };
                var heatmapLayer = new HeatmapOverlay(cfg);
                var map = new L.Map('map', {
                  center: new L.LatLng(25.6586, -80.3568),
                  zoom: 4,
                  layers: [baseLayer, heatmapLayer]
                });
                heatmapLayer.setData(testData);
                // make accessible for debugging
                layer = heatmapLayer;
            }
            else if (xmlhttp.status == 400) {
                alert('400: Bad Request');
            }
        }
    };

    xmlhttp.open("GET", "/api", true);
    xmlhttp.send();
};
