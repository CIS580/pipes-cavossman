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
}

StraightPipe.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

StraightPipe.prototype.rotate = function(){
	if(this.state == 'empty'){
		this.rotation++;
		if(this.rotation == 4) this.rotation = 0;
	}
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
StraightPipe.prototype.render = function(time, ctx) {
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
}