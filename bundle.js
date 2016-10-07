(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./cornerPipe.js":2,"./crossPipe.js":3,"./endPipe.js":4,"./game":5,"./startPipe.js":6,"./straightPipe.js":7}],2:[function(require,module,exports){
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
}

CornerPipe.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

CornerPipe.prototype.rotate = function(){
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
CornerPipe.prototype.render = function(time, ctx) {
	ctx.drawImage(
        // image
        this.pipes,
        // source rectangle
        this.rotation * 27, 0, 27, 27,
        // destination rectangle
        this.x, this.y, 60, 60
      );
}
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],6:[function(require,module,exports){
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
  this.pipes.src = 'assets/startPipe.png';
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
StartPipe.prototype.render = function(time, ctx) {
	ctx.drawImage(
        // image
        this.pipes,
        // source rectangle
        0, 0, 30, 32,
        // destination rectangle
        this.x, this.y, 60, 60
      );
}
},{}],7:[function(require,module,exports){
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
},{}]},{},[1]);
