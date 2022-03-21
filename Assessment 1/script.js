// define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiMjYwMjI3MmwiLCJhIjoiY2t6eTcxeHN1MDhuZDJvbGpibHEzNmRhMSJ9.WwKdRu8sLN88Eg9L816oWg';
 
// create map
const map = new mapboxgl.Map({
container: 'map', // container id
style: 'mapbox://styles/2602272l/cl0yqrbkl002014lpi1mpmoac' // map style URL from Mapbox Studio
});



// wait for map to load before adjusting it
map.on('load', () => {
// make a pointer cursor
map.getCanvas().style.cursor = 'default';
 
// set map bounds to the continental US
map.fitBounds([
[-4.1518, 55.9642],
[-4.3518, 55.7642]
]);

const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places in Glasgow", // Placeholder text for the search bar
  proximity: {
    longitude: 55.8642,
    latitude: 4.2518
  } // Coordinates of Glasgow center
});

map.addControl(geocoder, "top-left");
  
map.addControl(new mapboxgl.NavigationControl(), "top-left");

map.addControl(
new mapboxgl.GeolocateControl({
positionOptions: {
enableHighAccuracy: true
},
trackUserLocation: true,
showUserHeading: true
}),
"top-left"
);

const scale = new mapboxgl.ScaleControl({
  maxWidth: 80, //size of the scale bar
  unit: "metric"
});
map.addControl(scale); 
  
// define layer names
const layers = [
'Extremely low',
'Relatively low',
'Average',
'Relatively high',
'Extremely high',
'Acute'
];
const colors = [
'#2166ac',
'#92c5de',
'#fddbc7',
'#d6604d',
'#b2182b',
'#67001f'
];
 
// create legend
const legend = document.getElementById('legend');
 
layers.forEach((layer, i) => {
const color = colors[i];
const item = document.createElement('div');
const key = document.createElement('span');
key.className = 'legend-key';
key.style.backgroundColor = color;
 
const value = document.createElement('span');
value.innerHTML = `${layer}`;
item.appendChild(key);
item.appendChild(value);
legend.appendChild(item);
});
  
map.addSource("hover", {
type: "geojson",
data: { type: "FeatureCollection", features: [] }
});
map.addLayer({
id: "dz-hover",
type: "line",
source: "hover",
layout: {},
paint: {
"line-color": "black",
"line-width": 4
}
});
 
// change info window on hover
map.on('mousemove', (event) => {
const areas = map.queryRenderedFeatures(event.point, {
layers: ['flooding-glasgow']
});
document.getElementById('pd').innerHTML = areas.length
? `<h3>CODE: ${areas[0].properties.DZ_CODE}</h3><p>Level of exposure:<strong><em>${areas[0].properties.Zexp_cl}</strong> </p>`
: `<p>Hover over an areas!</p>`;

map.getSource("hover").setData({
type: "FeatureCollection",
features: areas.map(function (f) {
return { type: "Feature", geometry: f.geometry };
})
});
});
});