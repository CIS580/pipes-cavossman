"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = StartPipe;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function StartPipe(parm) {
  this.x = parm.x; 
  this.y = parm.y; 
  this.pipes = new Image();
  this.pipes.src = 'assets/StartPipe_green.png';
  this.connected = true;
  this.water = 0;
  this.state = 'filling';
  this.direction = [-1,-1,0,-1]; 
}



StartPipe.prototype.fill = function(amount){
	if(this.state == 'filling'){
		this.waterLevel += amount;
		if(this.waterLevel > 30){
			overFlow = this.waterLevel - 30;
			this.waterLevel = 30;
			this.state = 'full';
		}
	}
}

StartPipe.prototype.startFill = function(entrance){
	if(entrance == 0 && this.state == 'empty'){
		this.direction[0] = 1;
		this.state = 'filling';
	}
}

StartPipe.prototype.getName = function(){
	return "connect";
}

StartPipe.prototype.getState = function(){
	return this.state;
}

StartPipe.prototype.rotate = function(){
	
}

StartPipe.prototype.getExits = function(){
	return this.direction;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
StartPipe.prototype.render = function(time, ctx) {
	ctx.fillStyle = 'green';
	ctx.fillRect(this.x,this.y,50,this.waterLevel);
	ctx.drawImage(
        // image
        this.pipes,
        // source rectangle
        0, 0, 30, 32,
        // destination rectangle
        this.x, this.y, 60, 60
      );
}