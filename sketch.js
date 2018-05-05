var trees = [];
var canvas;
var isInit = false;
var d_bg = 235;
var d_max = 225;
var d_min = 175;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  noStroke();
  ellipseMode(CENTER);
  if(displayDensity() >= 2 && width < 600)
     textSize(16);
  else textSize(26);
  textAlign(CENTER);
  textFont("Palatino");
  pixelDensity(displayDensity());
}

function draw() {
  if (!isInit){
      background(d_bg);
      fill(175);
      text("随便点", width/2, height/2 - textSize());
      text("click at will.", width/2, height/2 + 0.75 * textSize());
      noLoop();
      return;
  }
  
  var i;
  for (i = 0; i < trees.length; i++) {
    trees[i].render();
    trees[i].update();
    if(trees[i].isDead)
      trees.splice(i--, 1);
  }
}

function mousePressed() {
  if(!isInit){
    background(d_bg);
    isInit = true;
    loop();
  }
  var l = createVector(mouseX, mouseY);
  var v = createVector(0, -1);
  var r = (4 + 10 * mouseY / height);
  if(displayDensity() >= 2 && width < 600)
    r /= displayDensity();
  var root = new Tree(l, v, r, r, 1, 0, d_max - (d_max - d_min) * mouseY / height, 0);
  trees.push(root);
  //console.log(trees.length);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  trees = [];
  isInit = false;
}