/* William Zhang */

function parseData(data, response, callback) {
    for (var ip in response) {
        if (response.hasOwnProperty(ip)) {
            city = response[ip]['city'];
            country = response[ip]['country']['name'];
            latitude = response[ip]['location']['latitude'];
            longitude = response[ip]['location']['longitude'];
            console.log([ip, city, country, latitude, longitude].join(", "));

            exists = false;
            for (var i = 0; i < data.length; i++) {
                if (data[i]['lat'] == latitude && data[i]['lng'] == longitude) {
                    data[i] = {
                        ip: ip,
                        city: city,
                        country: country,
                        lat: latitude,
                        lng: longitude,
                        count: entry['count'] += 1
                    };
                    exists = true;
                }
            }
            if (!exists) {
                entry = {
                    ip: ip,
                    city: city,
                    country: country,
                    lat: latitude,
                    lng: longitude,
                    count: 1
                };
                data.push(entry);
            }
        }
    }
    callback(data);
}

function putData(data) {
    var baseLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            minZoom: 2,
            maxZoom: 18
        }
    );
    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        "radius": 2,
        "maxOpacity": .6,
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
    if(map_type === 'heatmap' || map_type === 'heat') {
        var heatmapLayer = new HeatmapOverlay(cfg);
        var map = new L.Map('map', {
            center: new L.LatLng(38.9072, -77.0369),
            zoom: 4,
            layers: [baseLayer, heatmapLayer]
        });
        var testData = {
            max: 8,
            data: data
        };
        heatmapLayer.setData(testData);
        // make accessible for debugging
        layer = heatmapLayer;
    } else {
        //var popupLayer = new 
        var map = new L.Map('map', {
            center: new L.LatLng(38.9072, -77.0369),
            zoom: 4,
            layers: [baseLayer]
        });
        for(var d = 0; d < data.length; d++) {
            var latlng = L.latLng(data[d].lat, data[d].lng);
            //L.popup().setLatLng(latlng).setContent('<p>' + data[d]['ip'] + '</p>').openOn(map);
            var marker = new L.Marker(latlng);
            //marker.bindPopup('<p>' + data[d]['ip'] + '</p>');
            var popup = new L.popup();
            popup.setLatLng(latlng);
            popup.setContent('<p>' + data[d].ip + ': ' + data[d].city + ', ' + data[d].country + '</p>')
            marker.bindPopup(popup).openPopup();
            map.addLayer(marker);
        }
    }
}


window.onload = function() {
    var xmlhttp = new XMLHttpRequest();
    var data = [];

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                response = JSON.parse(xmlhttp.responseText);
                parseData(data, response, function() {
                    putData(data);
                })
            } else if (xmlhttp.status == 400) {
                alert('400: Bad Request');
            }
        }
    };

    xmlhttp.open("GET", "/api", true);
    xmlhttp.send();
};
