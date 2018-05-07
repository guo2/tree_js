var MAX_GEN = 7;
var MAX_AGE = 40;
var AGE_MATURE = 10;
var GROWTH = 0.04;
var localScale = 1;
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
    
    if (this.radius < 0.4)
    {
      this.isDead = true;
      return;
    }
      
    if(
		this.age > MAX_AGE * map(this.generation, 0, MAX_GEN, 2, 1, true) // 80-40
		|| this.age > AGE_MATURE * map(this.generation, 0, MAX_GEN, 5, 1, true) // 50 - 10
		&& random() < GROWTH * map(this.generation, 0, MAX_GEN, 1, 2, true)
		&& this.generation < MAX_GEN)
    {
      
      var split = (this.generation <= 2) ? random(0.15, 0.35) : random(0.2, 0.45);
      var splitAngle = PI * ((this.generation <= 2) ? random(0.2, 0.4) : random(0.4, 0.7) * map(this.generation, 3, MAX_GEN, 0.5, 0.2, true));
      if(random()<0.5)
        split = 1 - split;
      var newV = this.velocity.copy();
      newV.rotate(split * splitAngle);
      this.targetR = this.radius * sqrt(split);
      this.velocity.rotate((split - 1) * splitAngle);
      this.age = 0;
      this.generation++;
      
      this.left = new Tree(this.location, this.velocity, this.radius, this.targetR, this.generation, 0, this.depth + random(-20, 30)/this.generation, this.opacity, this.canvas);
      this.right = new Tree(this.location, newV, this.radius, this.radius * sqrt(1 - split), this.generation, 0, this.depth + random(-20, 30)/this.generation, this.opacity, this.canvas);
      this.grown = true;
      
      return;
    }

    if (this.radius > this.targetR || this.age > MAX_AGE * this.radius || this.generation >= MAX_GEN)
      this.radius*=0.97;
    else this.radius *= 0.992;
    
    this.location.add(this.velocity);
    var angle = PI * random(-0.01, 0.01) * map(this.generation, 0, MAX_GEN, 1, 2, true);
    this.velocity.rotate(angle);
	this.velocity.normalize();
    this.velocity.y -= 0.012;
    this.velocity.setMag(localScale);
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
      
    this.depth = constrain(this.depth, 80, 220);  
    this.opacity = constrain(this.opacity, 0, 100);
    this.canvas.fill(this.depth, this.opacity);
    this.canvas.ellipse(this.location.x, this.location.y, this.radius * 2 * localScale, this.radius * 2 * localScale);
  }
}