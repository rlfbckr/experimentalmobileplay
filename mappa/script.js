
const key = 'pk.eyJ1IjoicmxmYmNrciIsImEiOiJja2d0Ym5qbjkwc3poMzBreTBnMnM2Z3czIn0.6fZAUJL9xrsg5Mi-DHH-ZA';

// Options for map
const options = {
  lat: 0,
  lng: 0,
  zoom: 4,
 //style: 'mapbox://styles/mapbox/streets-v11',
 // style: 'mapbox://styles/rlfbckr/ckgtcdn6y0xc619p6xw4ncqtk',
  pitch: 50,
};

// Create an instance of Mapboxgl
const mappa = new Mappa('MapboxGL', key);
let myMap;

let canvas;
let meteorites;

function setup() {
//  canvas = createCanvas(800, 700).parent('canvasContainer');
  canvas = createCanvas(windowWidth, windowHeight);

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.onChange(drawMeteorites);
  // Load the data
  meteorites = loadTable('Meteorite_Landings.csv', 'csv', 'header');

  // Only redraw the meteorites when the map change and not every frame.


  fill(109, 255, 0);
  stroke(100);
}

// The draw loop is fully functional but we are not using it for now.
function draw() {


}

function drawMeteorites() {
  // Clear the canvas
  clear();

  for (let i = 0; i < meteorites.getRowCount(); i += 1) {
    // Get the lat/lng of each meteorite
    const latitude = Number(meteorites.getString(i, 'reclat'));
    const longitude = Number(meteorites.getString(i, 'reclong'));

    // Transform lat/lng to pixel position
    const pos = myMap.latLngToPixel(latitude, longitude);
    // Get the size of the meteorite and map it. 60000000 is the mass of the largest
    // meteorite (https://en.wikipedia.org/wiki/Hoba_meteorite)
    let size = meteorites.getString(i, 'mass (g)');
    size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
    ellipse(pos.x, pos.y, size, size);
    /*
    for (let j = 0; j < meteorites.getRowCount(); j += 1) {
      const latitude2 = Number(meteorites.getString(j, 'reclat'));
      const longitude2 = Number(meteorites.getString(j, 'reclong'));
      const pos2 = myMap.latLngToPixel(latitude2, longitude2);
      stroke(255,0,0);
      line(pos.x,pos.y,pos2.x,pos2.y)


    }
    */
  }
}