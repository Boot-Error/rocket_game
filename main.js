//main game code
/*
author : Vighnesh SK; 
*/

var canvas = document.getElementById("main");
canvas.height = window.innerHeight;
canvas.width  = window.innerWidth;
var context= canvas.getContext("2d");
var t0 = new Date().getTime();
var keyStates = [];
var enemiesArray = [];
var explosionsArray = [];
var globalBulletArray = [];

var rocket = new Rocket();
var turret = new gun(rocket);

function addEnemy(count) {
	for (i=1; i<count+1; i++) {
		p = new Pirate();
		p.x_pos = 100;
		p.y_pos = canvas.height/2;
		g = new gun(p);
		profile = {
			body : p,
			gun  : g
		};
		enemiesArray.push(profile);
	}
}

rocket.x_pos = canvas.width/2;
rocket.y_pos = canvas.height/2;

//events
window.addEventListener("keydown", function (e) {
	e.preventDefault()
	var key = e.keyCode;
	if (key===38 || key===40) {
		keyStates.push(key);
	}
	if (key==39) {
		rocket.angle += 10;
	}
	if (key==37) {
		rocket.angle -= 10;
	}
}, false);

window.addEventListener("keyup", function (e) {
	keyStates = [];
}, false);

window.addEventListener("mousemove", function (e) {
	var x_dist = rocket.x_pos - e.clientX;
	var y_dist = rocket.y_pos - e.clientY;
	rocket.angle = (Math.atan2(y_dist, x_dist)*180/Math.PI)+180;
	console.log(rocket.angle);
})

//initializing
window.onload = loop;

//rocket object
function Rocket() {
	this.x_pos = 0;
	this.y_pos = 0;
	this.angle = 0;
	this.x_vel = 0;
	this.y_vel = 0;
	this.x_acc = 0;
	this.y_acc = 0;
	this.mass  = 20;
	this.life  = 200;
	this.max_vel = 3.2;
	this.pivot = [0, 0]
	this.draw  = function draw() {
		vertices = [10, 0, -10, 10, -5, 0, -10, -10];
		context.strokeStyle = "#FFF";
		//rotation
		var _x = Math.cos(this.angle*(Math.PI/180));
		var _y = Math.sin(this.angle*(Math.PI/180));
		context.beginPath();
		for (i=0; i<=vertices.length-2; i+=2) {
			//tilting the axis as for rotation
			var new_x = (vertices[i])*_x - (vertices[i+1])*_y;
			var new_y = (vertices[i+1])*_x + (vertices[i])*_y;
			if (i==0) {
				context.moveTo(new_x+this.x_pos, new_y+this.y_pos);
				//the pivot point <=== injected code for gun false damage
				this.pivot[0] = this.x_pos+new_x;
				this.pivot[1] = this.y_pos+new_y;
			}
			else {
				context.lineTo(new_x+this.x_pos, new_y+this.y_pos);
			}
		}
		context.closePath();
		context.stroke();
	}
}

//enemies
function Pirate() {
	this.x_pos = 0;
	this.y_pos = 0;
	this.x_vel = 0;
	this.y_vel = 0;
	this.a_vel = 0;
	this.angle = 0;
	this.max_vel = 1.2;
	this.range = 0;
	this.life  = 200;
	this.pivot = [0, 0];
	this.draw  = function draw() {
		vertices = [10, 0, -10, 10, -5, 0, -10, -10];
		context.strokeStyle = "#F00";
		//rotation
		var _x = Math.cos(this.angle*(Math.PI/180));
		var _y = Math.sin(this.angle*(Math.PI/180));
		context.beginPath();
		for (i=0; i<=vertices.length-2; i+=2) {
			//tilting the axis as for rotation
			var new_x = (vertices[i])*_x - (vertices[i+1])*_y;
			var new_y = (vertices[i+1])*_x + (vertices[i])*_y;
			if (i==0) {
				context.moveTo(new_x+this.x_pos, new_y+this.y_pos);
				//the pivot point <=== injected code for gun false damage
				this.pivot[0] = this.x_pos+new_x;
				this.pivot[1] = this.y_pos+new_y;
			}
			else {
				context.lineTo(new_x+this.x_pos, new_y+this.y_pos);
			}
		}
		context.closePath();
		context.stroke();
	}
	// a small AI for aiming and moving
	this.ai = function ai(aimingObject) {
		var x_dist = aimingObject.x_pos - this.x_pos;
		var y_dist = aimingObject.y_pos - this.y_pos;
		this.range = Math.hypot(y_dist, x_dist);
		if (this.range<500) {
			this.angle = Math.atan2(y_dist, x_dist)*180/Math.PI;
			this.x_vel = this.max_vel*Math.cos(this.angle*Math.PI/180);
			this.y_vel = this.max_vel*Math.sin(this.angle*Math.PI/180);
		}
		if (this.range<50) {
			this.x_vel = 0;
			this.y_vel = 0;
		}
	}
}

//gun object
function gun(rocket) {
	this.fire = function turret() {
		bullet = {
			bull_x   : rocket.pivot[0],
			bull_y   : rocket.pivot[1],
			heading  : rocket.angle,
			lifeTime : 40
		};
		globalBulletArray.push(bullet);
	}
}

//fancy bullet graphic previous a part of gun object dammit man i must use git .. maybe next it >_0
function BulletGraphics() {
		context.strokeStyle = "#FFF";
		for (i=0; i<globalBulletArray.length; i++) {
			var bullet = globalBulletArray[i];
			//i dont know why?... but i have to do this to get it work.. wtf?
			if (bullet===undefined) {
				continue;
			}
			context.beginPath();
			context.arc(bullet["bull_x"], bullet["bull_y"], 1, 0, 2*Math.PI, false);
			context.closePath()
			context.stroke();
			//movement part
			globalBulletArray[i]["bull_x"] += 20*Math.cos(bullet["heading"]*Math.PI/180);
			globalBulletArray[i]["bull_y"] += 20*Math.sin(bullet["heading"]*Math.PI/180);
			if (bullet["lifeTime"]<=0) {
				delete globalBulletArray[i];
			}
			else {
				globalBulletArray[i]["lifeTime"] -= 1;
			}
		}
	this.forceClear = function clearBullets() {
		globalBulletArray = [];
		console.log("lag!");
	}
}

//collsion and explosion callback
function damage(object, globalBulletArray) {
	for (var i=0; i<globalBulletArray.length; i++) {
		var b = globalBulletArray[i];
		//please someone help me with this... forever alone!
		if (b===undefined) {
			continue;
		}
		var x_dist = object.x_pos - b["bull_x"];
		var y_dist = object.y_pos - b["bull_y"];
		var t_dist = Math.hypot(x_dist, y_dist);
		if (t_dist<7) {
			object.life -= 1;
		}
		if (t_dist<2) {
			console.log("internal");
		}
	}
}

//Main game looop
function loop() {
	//events <= still under production
	for (x=0; x<keyStates.length; x++) {
		var key = keyStates[x];
		if (key==38) {
			rocket.y_acc = 0.2*Math.sin(rocket.angle*(Math.PI/180));
			rocket.x_acc = 0.2*Math.cos(rocket.angle*(Math.PI/180));
		}
		if (key==40) {
			turret.fire();
		}
	}
	//add enemies if not present
	if (enemiesArray.length<1) {
		addEnemy(2);
	}
	//time correction
	var t1 = new Date().getTime();
	var dt = t1 - t0;
	t0 = t1;
	//clearing the canvas for next draw
	context.clearRect(0, 0, canvas.width, canvas.height);
	rocket.draw();
	//enemies update code
	for (i=0; i<enemiesArray.length; i++) {
		var pirate = enemiesArray[i];
		if (pirate===undefined) {
			continue;
		}
		pirateBody = pirate["body"];
		pirateBody.draw();
		//movement
		pirateBody.x_pos += pirateBody.x_vel;
		pirateBody.y_pos += pirateBody.y_vel;
		//AI
		pirateBody.ai(rocket);
		pirateGun = pirate["gun"];
		if (pirateBody.range<200) {
			pirateGun.fire();
		}
		if (dt>1020) {
			globalBulletArray = [];
		}
		//keeping the pirate on the screen
		if (pirateBody.x_pos>canvas.width) pirateBody.x_pos = 0;
		if (pirateBody.x_pos<0) pirateBody.x_pos = canvas.width;
		if (pirateBody.y_pos>canvas.height) pirateBody.y_pos = 0;
		if (pirateBody.y_pos<0) pirateBody.y_pos = canvas.height;
		//damage
		var d = new damage(pirateBody, globalBulletArray);
		if (pirateBody.life<=0) {
			var e = new Explode(pirateBody.x_pos, pirateBody.y_pos);
			// delete enemiesArray[i];
			enemiesArray = [];
			explosionsArray.push(e);
		}
		if (pirateBody.life<30) {
			context.fillStyle = "#F00";
		}
		else {
			context.fillStyle = "#FFF"
		}
		context.font = "12px Arial";
		context.fillText("Health : "+pirateBody.life.toString(), pirateBody.x_pos-20, pirateBody.y_pos-20);

	}
	//keep the ship on the screen
	if (rocket.x_pos>canvas.width) rocket.x_pos = 0;
	if (rocket.x_pos<0) rocket.x_pos = canvas.width;
	if (rocket.y_pos>canvas.height) rocket.y_pos = 0;
	if (rocket.y_pos<0) rocket.y_pos = canvas.height;
	//angle correction
	if (Math.abs(rocket.angle)>360) rocket.angle -= 360;
	//velocity
	if (Math.hypot(rocket.x_vel, rocket.y_vel)>rocket.max_vel) {	
		rocket.x_vel = (rocket.max_vel-0.5)*Math.cos(rocket.angle*(Math.PI/180));
		rocket.y_vel = (rocket.max_vel-0.5)*Math.sin(rocket.angle*(Math.PI/180));
	}
	else {
		rocket.x_vel += rocket.x_acc;
		rocket.y_vel += rocket.y_acc;
	}
	rocket.y_pos += rocket.y_vel;
	rocket.x_pos += rocket.x_vel;
	//reset accel
	rocket.x_acc = 0;
	rocket.y_acc = 0;
	//gun properties
	BulletGraphics();
	//that explosion cuz games with strong enemies are cool
	var d1 = new damage(rocket, globalBulletArray);
	if (rocket.life<=0) {
		var e = new Explode(rocket.x_pos, rocket.y_pos);
		explosionsArray.push(e);
		rocket.x_pos = canvas.width/2;
		rocket.y_pos = canvas.height/2;
		rocket.life  = 200;
		rocket.x_vel = rocket.max_vel;
		rocket.y_vel = 0;
		rocket.angle = 0;
	}
	//explosion effect
	for (i=0; i<explosionsArray.length; i++) {
		var explosion = explosionsArray[i];
		if (explosion===undefined) {
			continue;
		}
		explosion.update();
		delete explosionsArray[i];
	}
	//data display
	if (rocket.life<30) {
		context.fillStyle = "#F00";
	}
	else {
		context.fillStyle = "#FFF"
	}
	context.font = "12px Arial";
	context.fillText("Health: " + rocket.life, 10, 40);
	context.fillStyle = "#FFF";
	context.fillText("FPS : " + Math.floor(1000/dt).toString(), 10, 20);
	//lag lag lag
	if (dt>70) {
		globalBulletArray = [];
	}
	//iterate
	window.requestAnimationFrame(loop, 1000/60);
}