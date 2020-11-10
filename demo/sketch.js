const mappakey = 'pk.eyJ1IjoicmxmYmNrciIsImEiOiJja2d0Ym5qbjkwc3poMzBreTBnMnM2Z3czIn0.6fZAUJL9xrsg5Mi-DHH-ZA';
const mappa = new Mappa('MapboxGL', mappakey);
const version = "12";
let myMap;
let canvas;
let myFont;


// Options for map
const options = {
  lat: 53.0793, // center in bremen
  lng: 8.8017,
  zoom: 6,
  style: 'mapbox://styles/mapbox/dark-v9',
  //style: 'mapbox://styles/mapbox/streets-v11',
  // style: 'mapbox://styles/rlfbckr/ckgtcdn6y0xc619p6xw4ncqtk',
  pitch: 0,
};

let uid = gen_uid(); // unique brower/user id wird als db key benutze...
let name = "-"; // player name
let direction = -1; // wohin wird gekucked
let lat = -1; // wo bin ich
let long = -1;
var database; // db ref
var players; // liste alle spieler

function preload() {
  myFont = loadFont('Ligconsolata-Regular.otf');
}


function setup() {
  // canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas = createCanvas(windowWidth, windowHeight);
  // textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  textFont(myFont, 30);
  textSize(20);
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
  name = createInput();
  name.position(20, 30);
  name.value(getItem('demoName')); // holt namen aus coookie

  maintenace();
  updatePlayerData();
  getAllPlayerData();
  setInterval(updateData, 5000); // daten mit server abgleichen

  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  // myMap.onChange(drawPlayer);
}


function draw() {
  drawPlayer();
}


function drawPlayer() {
  clear();

  var pos = myMap.latLngToPixel(lat, long);
  size = map(myMap.zoom(), 1, 6, 5, 7);
  textSize(20);
  stroke(255);
  fill(255, 0, 255)
  ellipse(pos.x, pos.y, size, size);
  noStroke();
  text("me: " + name.value(), pos.x + 20, pos.y);

  line(pos.x, pos.y, pos.x+ (cos(rotationZ - 90) * (windowWidth * 0.4)),pos.y + (sin(rotationZ - 90) * (windowWidth * 0.4)));

  if (players != null) {

    var keys = Object.keys(players);

    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      // console.log("Key: " + k + "   lat: " + players[k].lat + "   Name: " + players[k].long);
      if (k != uid) {
        // not mee
        var pos = myMap.latLngToPixel(players[k].lat, players[k].long);
        size = map(myMap.zoom(), 1, 6, 5, 7);
        stroke(255);
        fill(0, 255, 255)
        ellipse(pos.x, pos.y, size, size);
        fill(255);
        //  if (players[k] != null) {
        text("other: " + players[k].name, pos.x + 20, pos.y);
        //  }
        for (var j = 0; j < keys.length; j++) {
          var ko = keys[j];
          if (ko != k) {
            console.log("Key: " + ko + "   lat: " + players[ko].lat + "   lat: " + players[ko].long + "   name: " + players[ko].name);
            var pos_other = myMap.latLngToPixel(players[ko].lat, players[ko].long);
            line(pos.x, pos.y, pos_other.x, pos_other.y)
          }
        }
      }
    }
  }

  drawGui();
}

function drawGui() {
  textSize(15);
  fill(0);
  noStroke();
  rect(0, (windowHeight * 0.90), windowWidth, windowHeight);
  noStroke();
  fill(255);
  var info ="version = " + version + "\ndirection = " + rotationZ + "\n";
  if (geoCheck() == true) {
    info += 'lat = ' + lat + '\nlong = ' + long;
  } else {
    info += 'no geo';
  }
  text(info, 30, (windowHeight * 0.90) + 20);
  stroke(0, 255, 0);
  if (rotationZ != null) {
    line((width / 2), (height / 2), (width / 2) + (cos((rotationZ - 90)) * (windowWidth * 0.4)), (height / 2) + (sin((rotationZ - 90)) * (windowWidth * 0.4)));
  }
}

function updateData() {
  updatePlayerData(); // meine daten updaten
  maintenace();
  getAllPlayerData(); // alle anders player daten holen
  storeItem('demoName', name.value()); // player namen im coookie speichern
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


function positionChanged(position) {
  print("lat: " + position.latitude);
  print("long: " + position.longitude);
  lat = position.latitude;
  long = position.longitude;
}

function maintenace() {
  var ref = firebase.database().ref('player');
  var now = Date.now();
  var cutoff = now - 20 * 1000; // 20 sekunden.
  var old = ref.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
  var listener = old.on('child_added', function (snapshot) {
    snapshot.ref.remove();
  });
}

function updatePlayerData() {
  if (rotationZ != null) {
    direction = rotationZ;
  } else {
    direction = -1; /// not found
  }
  firebase.database().ref('player/' + uid).set({
    lat: lat,
    long: long,
    direction: direction,
    name: name.value(),
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