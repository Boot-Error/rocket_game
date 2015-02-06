//explosion particle code for the main game...
/*
author : Vighnesh SK
*/
var particleArray = [];

function Particle() {
	this.x_pos = 0;
	this.y_pos = 0;
	this.x_vel = 0;
	this.y_vel = 0;
	this.angle = 0;
	this.life  = 100;
	this.size  = 2;
	this.draw  = function draw() {
		context.fillStyle = "rgba(255, 255, 255, 0.5)";
		context.beginPath();
		context.arc(this.x_pos, this.y_pos, this.size, 0, 2*Math.PI, true);
		context.closePath();
		context.fill();
	}
	this.update = function update() {
		this.draw();
		this.x_pos += this.x_vel;
		this.y_pos += this.y_vel;
	}
}

//explosion particle effect
function Explode(x, y) {
	var count = 200;
	for (i=0; i<count; i++) {
		p = new Particle();
		p.x_pos = x;
		p.y_pos = y;
		p.life = 200*Math.random();
		p.angle = (360/count)*i*Math.PI/180;
		p.x_vel = (0.2+1*Math.random())*Math.cos(p.angle);
		p.y_vel = (0.2+1*Math.random())*Math.sin(p.angle);
		particleArray.push(p);
	}
	this.update = function update() {
		for (i=0; i<particleArray.length; i++) {
			particle = particleArray[i];
			if (particle===undefined) {
				continue;
			}
			particle.update();
			if (particleArray[i].life<0) {
				delete particleArray[i];
			}
			else {
				particleArray[i].life -= 1;
			}
		}
	}
}

//experimental thrust particle effect
function thrust(x, y, angle) {
	var count = 10;
	for (i=0; i<count; i++) {
		p = new Particle();
		p.size = 1;
		p.x_pos = x;
		p.y_pos = y;
		p.angle = angle;
		p.life  = 10;
		p.x_vel = (12+5*Math.random())*Math.cos(p.angle);
		p.y_vel = (12+5*Math.random())*Math.sin(p.angle);
		particleArray.push(p);
	}
	this.update = function update() {
		for (i=0; i<particleArray.length; i++) {
			particle = particleArray[i];
			if (particle===undefined) {
				continue;
			}
			particle.update();
			if (particleArray[i].life<0) {
				delete particleArray[i];
			}
			else {
				particleArray[i].life -= 1;
			}
		}
	}
}