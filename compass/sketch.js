
let myFont;
function preload() {
  myFont = loadFont('../../assets/Ligconsolata-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight,WEBGL);
  textAlign(CENTER, CENTER);
  //angleMode(DEGREES);
  textFont(myFont, 36);
}

function draw() {
  background(0);

 
  textSize(36);
  fill('magenta');
  ellipse(width / 2, height / 2, accelerationZ);
  fill(255);
  text( rotationX + ' ' + rotationY+ ' ' + rotationZ,0,0);
  text("ax: " + accelerationX, 100, 100);
  text("ay: " + accelerationY, 100, 150);
  text("az: " + accelerationZ, 100, 200);
  //rotateX(radians(rotationX));
  //rotateY(radians(rotationY));

}