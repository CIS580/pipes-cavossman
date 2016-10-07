"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = CornerPipe;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function CornerPipe(rotation) {
  this.x = 60; 
  this.y = 60; 
  this.rotation = rotation;
  this.pipes = new Image();
  this.pipes.src = 'assets/cornerPipes.png';
  this.state = "empty";
  this.water = 0;
  this.direction;
  switch(this.rotation){
	  case 0:
		this.direction = [-1,0,0,-1];
		break;
	  case 1:
		this.direction = [-1,-1,0,0];
		break;
	  case 2:
		this.direction = [0,-1,-1,0];
		break;
	  case 3:
		this.direction = [0,0,-1,-1];
		break;
  }
}

CornerPipe.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

CornerPipe.prototype.rotate = function(){
	if(this.state == 'empty'){
		switch(this.rotation){
		  case 0:
			this.direction = [-1,-1,0,0];
			break;
		  case 1:
			this.direction = [0,-1,-1,0];
			break;
		  case 2:
			this.direction = [0,0,-1,-1];
			break;
		  case 3:
			this.direction = [-1,0,0,-1];
			break;
	    }
		this.rotation++;
		if(this.rotation == 4) this.rotation = 0;
	}
}

CornerPipe.prototype.getName = function(){
	return "corner";
}

CornerPipe.prototype.fill = function(amount){
	if(this.state == 'filling'){
		this.waterLevel += amount;
		if(this.waterLevel > 60){
			overFlow = this.waterLevel - 60;
			this.waterLevel = 60;
			this.state = 'full';
		}
	}
}

CornerPipe.prototype.getExits = function(){
	return this.direction;
}

CornerPipe.prototype.getState = function(){
	return this.state;
}

CornerPipe.prototype.startFill = function(entrance){
	switch(entrance){
		case 0:
			if(this.direction[0] == 0) {
				this.direction[0] = 1;
				this.state = 'filling';
			}
			break;
		case 1:
			if(this.direction[1] == 0) {
				this.direction[1] = 1;
				this.state = 'filling';
			}
			break;
		case 2:
			if(this.direction[2] == 0) {
				this.direction[2] = 1;
				this.state = 'filling';
			}
			break;
		case 3:
			if(this.direction[3] == 0) {
				this.direction[3] = 1;
				this.state = 'filling';
			}
			break;
	}
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
CornerPipe.prototype.render = function(time, ctx) {
	switch(this.state){
		case 'filling':
		case 'full':
			ctx.fillStyle = 'green';
			switch(this.direction[0]){
				case 0:
					if(this.waterLevel >= 30) ctx.fillRect(this.x + 30, this.y + 60 - this.waterLevel, 4, this.waterLevel-30);
					break;
				case 1:
					if(this.waterLevel < 30) ctx.fillRect(this.x + 30, this.y, 4, this.waterLevel);
					else ctx.fillRect(this.x+30,this.y,5,30);
					break;
			}
			switch(this.direction[1]){
				case 0:
					if(this.waterLevel >= 30) ctx.fillRect(this.x + 30, this.y + 26, this.waterLevel - 30,4);
					break;
				case 1:
					if(this.waterLevel < 30 ) ctx.fillRect(this.x + 60 - this.waterLevel, this.y + 26,this.waterLevel, 4);
					else ctx.fillRect(this.x+30,this.y+26,30,4)
					break;
			}
			switch(this.direction[2]){
				case 0:
					if(this.waterLevel >= 30) ctx.fillRect(this.x + 30, this.y + 30, 4, this.waterLevel - 30);
					break;
				case 1:
					if(this.waterLevel < 30) ctx.fillRect(this.x + 30, this.y + 60 - this.waterLevel, 4, this.waterLevel);
					else ctx.fillRect(this.x + 30, this.y + 30, 4, 30);
					break;
			}
			switch(this.direction[3]){
				case 0:
					if(this.waterLevel >= 30) ctx.fillRect(this.x + 63 - this.waterLevel, this.y + 26, this.waterLevel - 30, 4);
					break;
				case 1:
					if(this.waterLevel < 30 ) ctx.fillRect(this.x, this.y + 26, this.waterLevel, 4);
					else ctx.fillRect(this.x, this.y + 26, 30, 4);
					break;
			}
		case 'empty':
			ctx.drawImage(
			// image
			this.pipes,
			// source rectangle
			this.rotation * 27, 0, 27, 27,
			// destination rectangle
			this.x, this.y, 60, 60
			);
			break;
    }
	
	
}