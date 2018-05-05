var trees = [];
var canvases = [];
var band = 50;
var isInit = false;

var realWidth;
var realHeight;

function setup() {

  createCanvas(windowWidth, windowHeight);
  noStroke();
  ellipseMode(CENTER);
  textSize(26);
  textAlign(CENTER);
  textFont("Garamond");
  pixelDensity(displayDensity());
  
  realWidth = windowWidth * pixelDensity();
  realHeight = windowHeight * pixelDensity();
  
  var h = 0;
  var c;
  
  while(h < windowHeight)
  {
    c = createGraphics(realWidth, realHeight);
    c.noStroke();
    c.pixelDensity(displayDensity());
    canvases.push(c); // [band*i, band*(i+1))
    h += band;
  }
  //console.log(canvases.length);
  console.log(pixelDensity());
  console.log(displayDensity());
  console.log(windowWidth);
  console.log(canvases[0].width);
  
  background(235);
  fill(175);
  text("随便点", width/2, height/2 - 56);
  text("click at will.", width/2, height/2-18);
}

function draw() {
  if (!isInit)
    return;
  
  var i;
  for (i = 0; i < trees.length; i++) {
    trees[i].render();
    trees[i].update();
    if(trees[i].isDead)
      trees.splice(i--, 1);
  }
  
  background(235);
  //image(canvases[bandNUM], 0, 0)

  for (i = 0; i < canvases.length; i++) {
    image(canvases[i], 0, 0, realWidth, realHeight, 0, 0, windowWidth, windowHeight);
  }
}

function mousePressed() {
  isInit = true;
  var l = createVector(mouseX, mouseY);
  var v = createVector(0, -1);
  var r = (4 + 12 * mouseY / height) / displayDensity();

  var root = new Tree(l, v, r, r, 1, 0, 220 - 110 * mouseY / height, 0, canvases[Math.floor(mouseY/band)]);
  trees.push(root);
  //console.log(trees.length);
}