const viewer = new Cesium.Viewer('cesiumContainer', {
  baseLayerPicker: false,
  animation: false,
  timeline: false
});

// Set background and ocean color
viewer.scene.backgroundColor = Cesium.Color.BLACK;
viewer.scene.globe.baseColor = Cesium.Color.SKYBLUE;

// Custom country data: colors and links
const countryData = {
  "Albania": {
    color: "#B2D8B2",
    link: "https://transparency.entsoe.eu/load-domain/r2/totalLoadR2/show?name=&defaultValue=false&viewType=TABLE&areaType=CTY&atch=false&dateTime.dateTime=13.03.2025+00:00|CET|DAY&biddingZone.values=CTY|10YAL-KESH-----5!CTY|10YAL-KESH-----5&dateTime.timezone=CET_CEST&dateTime.timezone_input=CET+(UTC+1)+/+CEST+(UTC+2)"
  },
  "France": {
    color: "#FFCC99",
    link: "https://example.com/france"
  },
  "Germany": {
    color: "#99CCFF",
    link: "https://example.com/germany"
  }
};

// GeoJSON source for countries
const geojsonUrl = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

Cesium.GeoJsonDataSource.load(geojsonUrl, {
  stroke: Cesium.Color.YELLOW,
  strokeWidth: 2,
  fill: Cesium.Color.TRANSPARENT
}).then(dataSource => {
  viewer.dataSources.add(dataSource);
  viewer.zoomTo(dataSource);

  dataSource.entities.values.forEach(entity => {
    let name = "";
    if (entity.properties && entity.properties.NAME) {
      name = entity.properties.NAME.getValue();
    } else if (entity.properties && entity.properties.name) {
      name = entity.properties.name.getValue();
    }

    if (name && countryData[name]) {
      const cData = countryData[name];
      entity.polygon.material = Cesium.Color.fromCssColorString(cData.color).withAlpha(0.7);
      entity.polygon.outline = true;
      entity.polygon.outlineColor = Cesium.Color.YELLOW;
      // Assign link as a ConstantProperty for Cesium
      entity.properties.link = new Cesium.ConstantProperty(cData.link);
    } else {
      entity.polygon.material = Cesium.Color.GRAY.withAlpha(0.2);
      entity.polygon.outline = true;
      entity.polygon.outlineColor = Cesium.Color.DARKGRAY;
    }
  });

  // Add click handler to open country links
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  handler.setInputAction(click => {
    const pickedObject = viewer.scene.pick(click.position);
    if (
      Cesium.defined(pickedObject) &&
      pickedObject.id &&
      pickedObject.id.properties &&
      pickedObject.id.properties.link
    ) {
      const link = pickedObject.id.properties.link.getValue();
      if (link) {
        window.open(link, '_blank');
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}).otherwise(error => {
  console.error("Error loading GeoJSON:", error);
});
