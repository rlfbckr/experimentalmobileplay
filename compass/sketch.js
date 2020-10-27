
let myFont;
let rotation =0;
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
}

function draw() {
  background(128);
  rotation = rotationZ; // (rotation*0.9) + (rotationZ*0.1);
  fill(255);
  text('Z ' + nf(rotation,3,3),0,0);
  stroke(255,0,0);
  push();
  rotateZ(rotation);
  line(0,0,0,1000);
  pop();
  /*
  text("ax: " + accelerationX, 100, 100);
  text("ay: " + accelerationY, 100, 150);
  text("az: " + accelerationZ, 100, 200);
 */
  //rotateX(radians(rotationX));
  //rotateY(radians(rotationY));

}