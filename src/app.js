"use strict";

/* Classes */
const Game = require('./game');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pipes.png';
var grid = new Array(144);


// SOUNDS
//var backgroundSound = new Audio();
//backgroundSound.src = 'assets/backgroundSound.wav';
//backgroundSound.loop = true;
//backgroundSound.volume = 0.3;
//backgroundSound.play();
var win = new Audio();
win.src = 'assets/win.wav';
var lose = new Audio();
lose.src = 'assets/lose.wav';
var place = new Audio();
place.src = 'assets/place.wav';
var rotate = new Audio();
rotate.src = 'assets/rotate.wav';

canvas.onclick = function(event) {
  event.preventDefault();
  // TODO: Place or rotate pipe tile
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // TODO: Advance the fluid
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#777777";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // TODO: Render the board
  ctx.fillStyle = 'black';
  ctx.fillRect(720,0,120,720);
  ctx.fillStyle = 'white';
  ctx.fillRect(722,2,116,716);
  
  
  var y = 0;
  var x = 0;
  for (var i = 0; i < grid.length; i++){
	if(i >= 11 && i % 12 == 0){
		y += 60;
		x = 0;
	}
	ctx.fillStyle = 'black';
	ctx.fillRect(x,y,60,60);
	ctx.fillStyle = "grey";
	ctx.fillRect(x+2,y+2,56,56)
	x += 60;
  }
  
}
