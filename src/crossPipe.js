"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = CrossPipe;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function CrossPipe(rotation) {
  this.x = 60; 
  this.y = 60; 
  this.pipes = new Image();
  this.pipes.src = 'assets/pipes.png';
  this.water = 0;
  this.direction = [0,0,0,0]
  this.state = "empty";
}

CrossPipe.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

CrossPipe.prototype.rotate = function(){

}

CrossPipe.prototype.getName = function(){
	return "cross";
}

CrossPipe.prototype.fill = function(amount){
	this.waterLevel += amount;
	if(this.waterLevel > 60){
		overFlow = this.waterLevel - 60;
		this.waterLevel = 60;
		this.state = 'full';
	}
}

CrossPipe.prototype.getExits = function(){
	return this.direction;
}

CrossPipe.prototype.getState = function(){
	return this.state;
}

CrossPipe.prototype.setFilling = function(entrance){
	this.state = 'filling';
	switch(entrance){
		case 0:
			this.direction[0] = 1;
			break;
		case 1:
			this.direction[1] = 1;
			break;
		case 2:
			this.direction[2] = 1;
			break;
		case 3:
			this.direction[3] = 1;
			break;
	}
}


/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
CrossPipe.prototype.render = function(time, ctx) {
	switch(this.state){
		case 'filling':
		case 'full':
			ctx.fillStyle = 'green';
			switch(this.direction[0]){
				case 0:
					if(this.waterLevel >= 30) ctx.fillRect(this.x + 30, this.y + 60 - this.waterLevel, 4, this.waterLevel - 30);
					break;
				case 1:
					if(this.waterLevel < 30) ctx.fillRect(this.x + 30, this.y, 4, this.waterLevel);
					else ctx.fillRect(this.x + 30, this.y, 5, 30);
					break;
			}
			switch(this.direction[1]){
				case 0:
					if(this.waterLevel >= 30) ctx.fillRect(this.x + 30, this.y + 26, this.waterLevel - 30, 4);
					break;
				case 1:
					if(this.waterLevel < 30 ) ctx.fillRect(this.x + 60 - this.waterLevel, this.y + 26, this.waterLevel, 4);
					else ctx.fillRect(this.x + 30, this.y + 26, 30, 4)
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
			0, 0, 30, 30,
			// destination rectangle
			this.x, this.y, 60, 60
		  );
    }
}