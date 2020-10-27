
let myFont;
function preload() {
  myFont = loadFont('Ligconsolata-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight,WEBGL);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  textFont(myFont, 36);
  textSize(36);

}

function draw() {
  background(10);

  fill(255);
  text('Z '+  rotationZ,0,0);
  stroke(255,0,0);
line(0,0,1000,1000);

  /*
  text("ax: " + accelerationX, 100, 100);
  text("ay: " + accelerationY, 100, 150);
  text("az: " + accelerationZ, 100, 200);
 */
  //rotateX(radians(rotationX));
  //rotateY(radians(rotationY));

}