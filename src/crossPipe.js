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
}

CrossPipe.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

CrossPipe.prototype.rotate = function(){
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
CrossPipe.prototype.render = function(time, ctx) {
	ctx.drawImage(
        // image
        this.pipes,
        // source rectangle
        0, 0, 30, 30,
        // destination rectangle
        this.x, this.y, 60, 60
      );
}