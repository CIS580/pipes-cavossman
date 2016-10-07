"use strict";

/* Classes */
const Game = require('./game');
const StartPipe = require('./startPipe.js');
const EndPipe = require('./endPipe.js');
const CornerPipe = require('./cornerPipe.js');
const StraightPipe = require('./straightPipe.js');
const CrossPipe = require('./crossPipe.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pipes.png';
var grid = new Array(144);
grid[0] = new StartPipe({x: 0, y: 0});
grid[143] = new EndPipe({x: 660, y: 660});
var next = new CornerPipe(0);

var score = 0;
var level = 1;

// SOUNDS - ADD BACKGROUND SOUND TO ASSETS
var backgroundSound = new Audio();
backgroundSound.src = 'assets/backgroundMusic.mp3';
backgroundSound.loop = true;
backgroundSound.volume = 0.3;
backgroundSound.play();
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
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  if (grid[findGrid({x: x, y: y})] == null && x < 720){
	placeNext(findGrid({x: x, y: y}));
	place.play();
  }
}

canvas.oncontextmenu = function (event)
{
    event.preventDefault();
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	
	var gridNumber = findGrid({x: x, y: y});
	if(grid[gridNumber] != null) {
		grid[gridNumber].rotate();
		rotate.play();
	}
}

function findGrid(position){
	var x = position.x;
	var y = position.y;
	if(x < 0) return -1;
	var gridX = 0;
	var gridY = 0;
	while(x > 60){
		x -= 60;
		gridX++;
	}
	while(y > 60){
		y-=60;
		gridY++;
	}
	return gridX + (gridY * 12);
}

function placeNext(number){
	grid[number] = next;
	grid[number].place({x:((number%12)*60), y: Math.floor((number/12))*60});
	switch(Math.floor(Math.random()*13))
	{
		case 0:
			next = new CrossPipe(0);
			break;
		case 1:
		case 2:
		case 3:
			next = new StraightPipe(Math.floor(Math.random()*4));
			break;
		case 4:
		case 5:
		case 6:
			next = new CornerPipe(Math.floor(Math.random()*4));
			break;
		case 7:
		case 8:
		case 9:
			next = new CornerPipe(Math.floor(Math.random()*4));
			break;
		case 10:
			next = new CornerPipe(Math.floor(Math.random()*4));
			break;
		case 11:
		case 12:
			next = new CornerPipe(Math.floor(Math.random()*4));
			break;
	}
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
  
  // SIDE PANEL
  ctx.fillStyle = 'black';
  ctx.fillRect(720,0,120,720);
  ctx.fillStyle = 'white';
  ctx.fillRect(722,2,116,716);
  
  // NEXT
  ctx.fillStyle = "black";
  ctx.font = "bold 23px Arial";
  ctx.fillText("NEXT", 747, 40);
  ctx.fillStyle = 'black';
  ctx.fillRect(745,50,70,70);
  ctx.fillStyle = 'white';
  ctx.fillRect(747,52,66,66);
  
  // LEVEL
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("LEVEL",749, 360);
  ctx.fillText(level,760, 390);
  
  // SCORE
  ctx.fillText("SCORE", 745, 530);
  ctx.fillText(score,760, 560);
  
  // GRID
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
  
  // PARTS
  for(var i = 0; i < grid.length; i++){
	  if(grid[i] != null) grid[i].render(elapsedTime,ctx);
  }
  next.place({x: 750, y: 52})
  next.render(elapsedTime,ctx);
}
