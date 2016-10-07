"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = EndPipe;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function EndPipe(parm) {
  this.x = parm.x; 
  this.y = parm.y; 
  this.pipes = new Image();
  this.pipes.src = 'assets/endPipe.png';
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
EndPipe.prototype.render = function(time, ctx) {
	ctx.drawImage(
        // image
        this.pipes,
        // source rectangle
        0, 0, 30, 30,
        // destination rectangle
        this.x, this.y, 60, 60
      );
}