var MAX_GEN = 7;
var MAX_AGE = 70;
var AGE_MATURE = 10;
var GROWTH = 0.06;
//canvas c
function Tree(l, v, r, tr, g, a, d, o, c){
  this.left = {};
  this.right = {};
  this.location = l.copy();
  this.velocity = v.copy();
  this.velocity.setMag(1);
  this.radius = r;
  this.targetR = tr;
  this.generation = g;
  this.age = a;
  this.depth = d;
  this.grown = false;
  this.isDead = false;
  this.opacity = o;
  this.canvas = c;

  this.update = function() {
    if(this.grown){
      this.left.update();
      this.right.update();
      if(this.left.isDead && this.right.isDead)
        this.isDead = true;
      return;
    }
    
    if (this.radius < 0.6)
    {
      this.isDead = true;
      return;
    }
      
    if(this.age > AGE_MATURE * this.radius && this.age < MAX_AGE * this.radius && random() < GROWTH * sqrt(this.radius) && this.generation < MAX_GEN)
    {      
      var split = (this.generation <= 2)?random(0.15, 0.35):random(0.1, 0.4);
      var splitAngle = PI * ((this.generation <= 2) ? random(0.2, 0.4) : (random(0.4, 0.7) / sqrt(this.generation)));
      if(random()<0.5)
        split = 1 - split;
      var newV = this.velocity.copy();
      newV.rotate(split * splitAngle);
      this.targetR = this.radius * sqrt(split);
      this.velocity.rotate((split - 1) * splitAngle);
      this.age = 0;
      this.generation++;
      
      this.left = new Tree(this.location, this.velocity, this.radius, this.targetR, this.generation, 0, this.depth + random(-20, 30)/this.generation, this.opacity);
      this.right = new Tree(this.location, newV, this.radius, this.radius * sqrt(1 - split), this.generation, 0, this.depth + random(-20, 30)/this.generation, this.opacity);
      this.grown = true;
      
      return;
    }

    if (this.radius > this.targetR || this.age > MAX_AGE * this.radius || this.generation >= MAX_GEN)
      this.radius*=0.96;
    else this.radius *= 0.99;
    
    this.location.add(this.velocity);
    var angle = PI * random(-0.01, 0.01) * sqrt(this.radius);
    this.velocity.rotate(angle);
    this.velocity.y -= 0.025;
    this.velocity.setMag(1.2);
    this.depth += random(-4, 4);
    this.opacity += 8/this.radius;
    this.age++;
  }
  
  this.render=function(){
    if (this.isDead)
      return;
    
    if(this.grown)
    {
      this.left.render();
      this.right.render();
      return;
    }
      
    this.depth = constrain(this.depth, d_min, d_max);  
    this.opacity = constrain(this.opacity, 0, 100);
    fill(this.depth, this.opacity);
    ellipse(this.location.x, this.location.y, this.radius*2, this.radius*2);
  }
}