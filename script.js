mapboxgl.accessToken = '<pk.eyJ1IjoibGltb25lbmUxMSIsImEiOiJjbDR4Z2tvOHcyaHFwM2Nuc2Zrb2NrMm13In0.omRJ961f0P_JXavuNRDWkA>';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});