// Mapbox default script for map
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/streets-v12", // style URL
	center: [-74.5, 40], // starting position [lng, lat]
	zoom: 4, // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker()
	.setLngLat([12.554729, 55.70651])
    .addTo(map);