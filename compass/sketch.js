let myFont;
 

const key = 'pk.eyJ1IjoicmxmYmNrciIsImEiOiJja2d0Ym5qbjkwc3poMzBreTBnMnM2Z3czIn0.6fZAUJL9xrsg5Mi-DHH-ZA';
const mappa = new Mappa('MapboxGL', key);
let myMap;

let canvas;
// Options for map
const options = {
  lat: 0,
  lng: 0,
  zoom: 4,
 //style: 'mapbox://styles/mapbox/streets-v11',
 // style: 'mapbox://styles/rlfbckr/ckgtcdn6y0xc619p6xw4ncqtk',
  pitch: 50,
};

let uid = gen_uid(); // unique brower/user id wird als db key benutze...

let direction = -1; // wohin wird gekucked
let lat = -1; // wo bin ich
let long = -1;
var database; // db ref
var players; // alle spieler

function preload() {
  myFont = loadFont('Ligconsolata-Regular.otf');
}


 

function setup() {
 // canvas = createCanvas(windowWidth, windowHeight,WEBGL);
  canvas = createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  textFont(myFont, 36);
  textSize(36);
  rotateion = rotationZ;
  watchPosition(positionChanged);
  var firebaseConfig = {
    apiKey: "AIzaSyDdxhSS1i5bmGA8kcEZX6VARalGIU-_qZg",
    authDomain: "exmp-2c800.firebaseapp.com",
    databaseURL: "https://exmp-2c800.firebaseio.com",
    projectId: "exmp-2c800",
    storageBucket: "exmp-2c800.appspot.com",
    messagingSenderId: "654018842369",
    appId: "1:654018842369:web:bb5e82b2d5457ad1ed1500"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);
  console.log('uid:' + uid);
  database = firebase.database();
  maintenace();
  updatePlayerData();
  getAllPlayerData();
  setInterval(updateData, 5000); // daten mit server abgleichen
  meteorites = loadTable('Meteorite_Landings.csv', 'csv', 'header');
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.onChange(drawPlayer);

}

function draw() {
 
  // background(20);
  // drawPlayer();
   if (rotationZ != null) {
    direction  = rotationZ; 
   } else {
     direction = -1; /// not found
   }
  
   fill(255);
   text('z = ' + direction ,0,+20);
   stroke(255,0,255);
 
   if (geoCheck() == true) {
     text('g = '+lat+' '+long,0,-20);
   } else{
     text('geo KO',0,-20);
   }
   push();
 
   rotateZ(direction );
   line(0,0,0,1000);
   pop();
  
 
 }
 

function drawPlayer() {
  // Clear the canvas
  clear();
  /*
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

  }
 */
  // Transform lat/lng to pixel position
    var pos = myMap.latLngToPixel(lat, long);
    size = map(myMap.zoom(), 558, 60000000, 10, 25) ;
    stroke(255);
    fill(255,0,255)
    ellipse(pos.x, pos.y, size, size);
 
  
}

function updateData() {
  updatePlayerData(); // meine daten updaten
  maintenace();
  getAllPlayerData(); // alle anders player daten holen

}

function getAllPlayerData() {
  var ref = database.ref("player");
  ref.on("value", gotData, errData);
}

function errData(data) {

}

function gotData(data) {
 players = data.val();
}


function positionChanged(position){
  print("lat: " + position.latitude);
  print("long: " + position.longitude);
  lat = position.latitude;
  long = position.longitude;
}

function maintenace() {
  var ref = firebase.database().ref('player');
  var now = Date.now();
  var cutoff = now - 20 * 1000; // eine minute...
  var old = ref.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
  var listener = old.on('child_added', function(snapshot) {
      snapshot.ref.remove();
  });
}

function updatePlayerData() {
  console.log('updateplayerdata');
 // var player = database.ref('player');

  firebase.database().ref('player/' + uid).set({
    lat: lat,
    long: long,
    direction: direction,
    timestamp: Date.now()
  });
 

}



function gen_uid() {
  var navigator_info = window.navigator;
  var screen_info = window.screen;
  var uid = navigator_info.mimeTypes.length;
  uid += navigator_info.userAgent.replace(/\D+/g, '');
  uid += navigator_info.plugins.length;
  uid += screen_info.height || '';
  uid += screen_info.width || '';
  uid += screen_info.pixelDepth || '';

  return uid;
}