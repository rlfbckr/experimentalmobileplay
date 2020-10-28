let uid = gen_uid();
let myFont;
let rotation =0;
var database;
var players;

function preload() {
  myFont = loadFont('Ligconsolata-Regular.otf');
}



function setup() {
  createCanvas(windowWidth, windowHeight,WEBGL);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  textFont(myFont, 36);
  textSize(36);
  rotateion = rotationZ;

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

  setInterval(updateData, 5000);
 
}

function updateData() {
  updatePlayerData();
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

function gotDatattt(data) {
  players = data.val();
   // Grab the keys to iterate over the object
  var keys = Object.keys(players);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    // Look at each fruit object!
    var player = players[key];
    console.log("player"+i+";");
    console.log(player.uid);
    console.log(uid);

    //console.log(player.timestamp);
   if (player.uid == uid) {
    console.log("its ME");
   }
  }
}


function maintenace() {

  // remove old players
  var ref = firebase.database().ref('player');
  var now = Date.now();
  var cutoff = now - 60 * 1000; // eine minute...
  var old = ref.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
  var listener = old.on('child_added', function(snapshot) {
      snapshot.ref.remove();
  });
  

}

function updatePlayerData() {
  console.log('updateplayerdata');
 // var player = database.ref('player');

  firebase.database().ref('player/' + uid).set({
    lat: '2',
    lon: '3',
    heading: rotationZ,
    timestamp: Date.now()
  });
 

}

function draw() {
  background(20);
  rotation = rotationZ; 
  fill(255);
  text('z= ' + rotation,0,0);
  stroke(255,0,255);
  push();
  rotateZ(rotation);
  line(0,0,0,1000);
  pop();

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