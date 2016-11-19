var mapLayer = MQ.mapLayer(), map;

map = L.map('map', {
	layers: mapLayer,
	center: [39.7439, -105.0201],
	zoom: 11
});


var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);
