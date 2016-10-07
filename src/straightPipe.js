"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = StraightPipe;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function StraightPipe(rotation) {
  this.x = 60; 
  this.y = 60; 
  this.rotation = rotation;
  this.pipes = new Image();
  this.pipes.src = 'assets/straightPipes.png';
  this.state = "empty";
  this.water = 0;
  this.direction;
  switch(this.rotation){
	  case 0:
	  case 2:
		this.direction = [-1,0,-1,0];
		break;
	  case 1:
	  case 3:
		this.direction = [0,-1,0,-1];
		break;
  }
}

StraightPipe.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

StraightPipe.prototype.rotate = function(){
	if(this.state == 'empty'){
		switch(this.rotation){
		  case 0:
		  case 2:
			this.direction = [0,-1,0,-1];
			break;
		  case 1:
		  case 3:
			this.direction = [-1,0,-1,0];
			break;
	    }
		this.rotation++;
		if(this.rotation == 4) this.rotation = 0;
	}
}

StraightPipe.prototype.fill = function(amount){
	if(this.state == 'filling'){
		this.waterLevel += amount;
		if(this.waterLevel > 60){
			overFlow = this.waterLevel - 60;
			this.waterLevel = 60;
			this.state = 'full';
		}
	}
}

StraightPipe.prototype.getState = function(){
	return this.state;
}

StraightPipe.prototype.getExits = function(){
	return this.direction;
}

StraightPipe.prototype.getName = function(){
	return "straight";
}

StraightPipe.prototype.startFill = function(entrance){
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
StraightPipe.prototype.render = function(time, ctx) {
	switch(this.state){
		case 'filling':
		case 'full':
			ctx.fillStyle = 'green';
			switch(this.direction[0]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+30,this.y+64-this.waterLevel,4,this.waterLevel-32);
					break;
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y,5,32);
					break;
			}
			switch(this.direction[1]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+32,this.y+26,this.waterLevel-32,4);
					break;
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x+64-this.waterLevel,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x+32,this.y+26,32,4)
					break;
			}
			switch(this.direction[2]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+30,this.y+32,4,this.waterLevel-32);
					break;
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y+64-this.waterLevel,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y+32,4,32);
					break;
			}
			switch(this.direction[3]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+63-this.waterLevel,this.y+26,this.waterLevel-32,4);
					break;
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x,this.y+26,32,4);
					break;
			}
		case 'empty':
			switch(this.rotation){
				case 0:
				case 2:
					//draws the pipe image
					ctx.drawImage(
						// image
						this.pipes,
						// source rectangle
						0, 0, 25, 33,
						// destination rectangle
						this.x + 3, this.y, 60, 60
					);
					break;
				case 1:
				case 3:
					//draws the pipe image
					ctx.drawImage(
						// image
						this.pipes,
						// source rectangle
						28, 0, 30, 30,
						// destination rectangle
						this.x, this.y, 60, 60
					);
					break;
			}
    }//end switch
}