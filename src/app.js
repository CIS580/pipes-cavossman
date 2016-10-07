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