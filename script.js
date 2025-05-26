// Create the Map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json', // Default MapLibre style
    center: [0, 20], // [Longitude, Latitude]
    zoom: 1.5,
    pitch: 0,
    bearing: 0,
    antialias: true,
    maxZoom: 10,
    minZoom: 1.5
});


// Sample demand data with country colors and links
const countryData = {
    "Albania": { "color": "#B2D8B2", "link": "https://transparency.entsoe.eu/load-domain/r2/totalLoadR2/show?name=&defaultValue=false&viewType=TABLE&areaType=CTY&atch=false&dateTime.dateTime=13.03.2025+00:00|CET|DAY&biddingZone.values=CTY|10YAL-KESH-----5!CTY|10YAL-KESH-----5&dateTime.timezone=CET_CEST&dateTime.timezone_input=CET+(UTC+1)+/+CEST+(UTC+2) "},
    "Canada": { "color": "#B2D8B2", "link": "https://energy-information.canada.ca/en/resources/high-frequency-electricity-data"},
    "Argentina": { "color": "#B2D8B2", "link": "https://cammesaweb.cammesa.com/" }, 
    "Brazil": { "color": "#0D400D", "link": "https://dados.ons.org.br/dataset/curva-carga" },
    "Chile": { "color": "#0D400D", "link": "https://www.coordinador.cl/operacion/graficos/operacion-real/demanda-real/" },    
    "Peru": { "color": "#0D400D", "link": "https://www.coes.org.pe/Portal/portalinformacion/demanda" }
};

// Load country boundaries from GeoJSON
map.on('load', function () {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(data => {
            map.addSource('countries', {
                'type': 'geojson',
                'data': data
            });

            map.addLayer({
                'id': 'country-fills',
                'type': 'fill',
                'source': 'countries',
                'layout': {},
                'paint': {
                    'fill-color': [
                        'match',
                        ['get', 'name'],
                        ...Object.entries(countryData).flatMap(([name, info]) => [name, info.color]),
                        "#AAAAAA" // Default color for unlisted countries
                    ],
                    'fill-opacity': 1.0
                }
            });

            // Add country borders
            map.addLayer({
                'id': 'country-borders',
                'type': 'line',
                'source': 'countries',
                'layout': {},
                'paint': {
                    'line-color': '#000',
                    'line-width': 1
                }
            });

            // Click Event for Countries
            map.on('click', 'country-fills', function (e) {
                const countryName = e.features[0].properties.name;
                const countryInfo = countryData[countryName];

                if (countryInfo) {
                    window.open(countryInfo.link, '_blank'); // Open demand data link
                } else {
                    alert("No demand data available for " + countryName);
                }
            });

            // Change cursor on hover
            map.on('mouseenter', 'country-fills', function () {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'country-fills', function () {
                map.getCanvas().style.cursor = '';
            });
        });
});     
