var mapLayer = MQ.mapLayer(), map;

map = L.map('map', {
	layers: mapLayer,
	center: [39.723209, -104.963722],
	zoom: 12
})

//making boundaries
// map.fitBounds([
// 		[39.802437, -104.825213],
//     [39.653516, -105.086482]
//
// ]);
map.options.minZoom = 11.5;
//--->


var zombieIcon = L.icon({
    iconUrl: './images/zombie.png',

    iconSize:     [20, 60], // size of the icon
    iconAnchor:   [10, 50], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var heroIcon = L.icon({
    iconUrl: './images/bronco-icon.png',

    iconSize:     [25, 68], // size of the icon
    iconAnchor:   [10, 50], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
