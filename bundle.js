(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/20;

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
var waterSpeed = 1;

var startTimer = 10;
var timer = 0;
var state = "start";
var score = 0;
var level = 1;

// SOUNDS
var backgroundMusic = new Audio();
backgroundMusic.src = 'assets/backgroundMusic.mp3';
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;
backgroundMusic.play();
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
  if(state == "start"){
	  state = 'countdown';
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
			
		case 1:
		case 2:
			next = new CrossPipe(0);
			break;
		case 3:
		case 4:
		case 5:
		case 6:
			next = new StraightPipe(Math.floor(Math.random()*4));
			break;
		case 7:
		case 8:
		case 9:
		case 10:
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
  switch(state){
	  case 'start':
		  break;
	  case 'countdown':
	  timer += elapsedTime;
		  if (timer > 1000){
			  timer = 0;
			  startTimer--;
		  }
		  
		  if(startTimer <= 0){
			  state = 'running';
		  }
		  break;
	  case 'won':
		  timer += elapsedTime;
		  if (timer > MS_PER_FRAME) {
			  timer = 0;
			  fillPipes();
			  state = 'start';
			  score += 10;
			  waterSpeed++;
			  levelScore = 23;
			  grid = new Array(169);
			  grid[29] = new PipeConnect({x: 388, y: 128, piece: 0});
			  grid[139] = new PipeConnect({x: 772, y: 640, piece: 1});
		  }
		  break;
	  case 'lost':
		  timer += elapsedTime;
		  if (timer > MS_PER_FRAME) {
			  timer = 0;
			  fillPipes();
			  flashTimer++;
			  if(flashTimer >= 20){
				  flashTimer = 0;
				  state = 'start';
				  score = 0;
				  waterSpeed = 1;
				  levelScore = 23;
				  grid = new Array(169);
				  grid[29] = new PipeConnect({x: 388, y: 128, piece: 0});
				  grid[139] = new PipeConnect({x: 772, y: 640, piece: 1});
				  next = new PipeCross(0);
			  }
		  }
		  break;
	  case 'running':
		  timer += elapsedTime;
		  if (timer > MS_PER_FRAME) {
			  timer = 0;
			  fillPipes();
		  }
		  break;
  }  
	if(grid[131] != null){
		state = 'win';
		backgroundMusic.volume = 0;
		win.play();
		timer += elapsedTime;
		  if (timer > 1000){
			  win.volume = 0;
		  }
	}
	if(grid[11] != null){
		state = 'lose';
		backgroundMusic.volume = 0;
		lose.play();
		timer += elapsedTime;
		  if (timer > 1000){
			  lose.volume = 0;
		  }
		  
	}
  
}


function fillPipes(){
	var lose = true;
	for(var i = 0; i < grid.length; i++){
		if(grid[i] != null){
			var exit = grid[i].getExits();
			switch(grid[i].getState()){
				case 'full':
					if(exit[0] == 0){
						if(i-13 >= 0){
							if(grid[i-13] != null && grid[i-13].getState() == 'empty'){
								grid[i-13].startFill(2);
								grid[i-13].fill(waterSpeed);
							}
						}
					}
					if(exit[1] == 0){
						if(i+1 < grid.length){
							if(grid[i+1] != null && grid[i+1].getState() == 'empty'){
								grid[i+1].startFill(3);
								grid[i+1].fill(0);
							}
						}
					}
					if(exit[2] == 0){
						if(i+13 < grid.length){
							if(grid[i+13] != null && grid[i+13].getState() == 'empty'){
								grid[i+13].startFill(0);
								grid[i+13].fill(0);
							}
						}
					}
					if(exit[3] == 0){
						if(i-1 >= 0){
							if(grid[i-1] != null && grid[i-1].getState() == 'empty'){
								grid[i-1].startFill(1);
								grid[i-1].fill(waterSpeed);
							}
						}
					}
					break;
				case 'filling':
					lose = false;
					var overFill = grid[i].fill(waterSpeed);
					if(overFill >= 0){
						if(exit[0] == 0){
							if(i-13 >= 0){
								if(grid[i-13] != null && grid[i-13].getState() != 'full'){
									grid[i-13].startFill(2);
									grid[i-13].fill(overFill);
								}
							}
						}
						if(exit[1] == 0){
							if(i+1 < grid.length){
								if(grid[i+1] != null && grid[i+1].getState() != 'full'){
									grid[i+1].startFill(3);
									grid[i+1].fill(overFill-waterSpeed);
								}
							}
						}
						if(exit[2] == 0){
							if(i+13 < grid.length){
								if(grid[i+13] != null && grid[i+13].getState() != 'full'){
									grid[i+13].startFill(0);
									grid[i+13].fill(overFill-waterSpeed);
								}
							}
						}
						if(exit[3] == 0){
							if(i-1 >= 0){
								if(grid[i-1] != null && grid[i-1].getState() != 'full'){
									grid[i-1].startFill(1);
									grid[i-1].fill(overFill);
								}
							}
						}
					}
					break;
			}
		}
	if(lose) {
		if(state == 'running') 
		lose.play();
		state = 'lost';
	}
	if(grid[143].getState() != 'empty') {
		win.play();
		state = 'won';
	}
}
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
  
  // WIN
  if(state == "win"){
	  ctx.fillText("WINNER", 745, 230);
  }
  
  // LOSE
  if(state == "lose"){
	  ctx.fillText("LOSER", 745, 230);
  }
  
  // COUNTDOWN
  if(startTimer > 0){
	  ctx.fillStyle = "black";
	  ctx.font = "12px Arial";
	  ctx.fillText("H2O INCOMING...",730, 680);
	  ctx.fillText(startTimer,765, 700);
  }
  
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
  this.water = 0;
  this.state = 'empty';
  this.direction = [0,-1,-1,-1];
}
EndPipe.prototype.fill = function(amount){
	if(this.state == 'filling'){
		this.waterLevel += amount;
		if(this.waterLevel > 30){
			overFlow = this.waterLevel - 30;
			this.waterLevel = 30;
			this.state = 'full';
		}
	}
}

EndPipe.prototype.startFill = function(entrance){
	if(entrance == 0 && this.state == 'empty'){
		this.direction[0] = 1;
		this.state = 'filling';
	}
}

EndPipe.prototype.getName = function(){
	return "connect";
}

EndPipe.prototype.getState = function(){
	return this.state;
}

EndPipe.prototype.rotate = function(){
	
}

EndPipe.prototype.getExits = function(){
	return this.direction;
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
},{}]},{},[1]);
