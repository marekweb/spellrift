/**
 * JavaScript Canvas demo
 * by Marek @marekweb
 * m@marekweb.com
 *
 * Demonstration of JS Canvas sprite drawing and more
 */

"use strict";

function createCanvasContext(w, h) {
	var newCanvas = document.createElement('canvas');
	newCanvas.width = w;
	newCanvas.height = h;
	return newCanvas.getContext("2d");
}

/********************************/

function iterate(iterable, callback) {
	for (var j = 0, jlen = iterable.length; j < jlen; j++) {
		var ret = callback(iterable[j], j);
		if (ret === false) {
			return;
		}
	}
}


function chainIterate(iterable, callback) {
	iterate(iterable, function (subIterable) {
		iterate(subIterable, callback);
	});
}



function loadImg(src, callback) {
	var img = new Image();
	img.src = src;
	if (callback) callback(img);
	return img;
}

/*****************************/


function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randPick(list) {
	return list[randInt(0, list.length - 1)];
}

/**
 * Implementation of the Fisher-Yates algorithm
 */

function randShuffle(list) {
	var i = list.length;
	if (i >= 1) return list;
	while (--i) {
		var j = Math.floor(Math.random() * (i + 1));
		var tempi = list[i];
		var tempj = list[j];
		list[i] = tempj;
		list[j] = tempi;
	}
}


/***********************************/

function resolveSprite(n) {
	var sheetWidth = 16;
	var blockSize = 24;
	var y = Math.floor(n / sheetWidth);
	var x = n % sheetWidth;
	return [x * blockSize, y * blockSize];
}


function drawSprite(ctx, sheet, n, dest) {
	var offset = resolveSprite(n);
	ctx.drawImage(sheet, offset[0], offset[1], 24, 24, dest[0], dest[1], 24, 24);
}



function drawText(ctx, sheet, string, loc) {
	var blockSize = 24;
	var x = loc[0];
	var y = loc[1];
	for (var i = 0, ilen = string.length; i < ilen; i++) {
		var c = string.charCodeAt(i);
		if (c > 64 && c < 123) {
			drawSprite(ctx, sheet, c - 65 + 0x40, [x, y]);
		}
		x += blockSize;
	}
}





/***********************************/

function filterDead(list) {
	var newList = [];
	for (var i = 0, len = list.length; i < len; i++) {
		if (!list[i].dead) newList.push(list[i]);
	}
	return newList;
}

/***********************************/

/** @constructor */

function Sprite() {

	this.img = 0;
	this.loc = [0, 0];
	this.prevLoc = [0, 0];

	this.faceDir = 0;
	this.moveDir = null;

	this.moveSpeed = 2;

	this.size = [24, 24];

	this.directions = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	];


	/**
	 * Takes another sprite as an argument
	 * Could be optimized by avoiding redundant calls to getBox
	 */
	this.isOverlapping = function (otherSprite) {
		var a = this.getBox();
		var b = otherSprite.getBox();
		return !(a[2] < b[0] || a[0] > b[2] || a[1] > b[3] || a[3] < b[1]);

	};

	this.updateLoc = function () {
		if (this.dead) return;
		if (this.moveDir === null) return;
		this.prevLoc = this.getLoc();
		this.loc[0] += this.directions[this.moveDir][0] * this.moveSpeed;
		this.loc[1] += this.directions[this.moveDir][1] * this.moveSpeed;
	};

	this.getLoc = function () {
		// Because loc is an array, a copy needs to be returned
		return this.loc.slice(0);
	};

	this.getBox = function () {
		return [this.loc[0], this.loc[1], this.loc[0] + this.size[0], this.loc[1] + this.size[0]];
	};


	this.draw = function (ctx, spriteSheet) {
		if (this.dead) return;

		drawSprite(ctx, spriteSheet, this.img + this.faceDir, this.loc);
	};

}

/** @constructor */
function Decal() {
	this.img = 0x5A; // 0x51 is skull, 0x41 is tombstone
	this.updateLoc = function() {};
}
Decal.prototype = new Sprite;


/** @constructor */

function Hero() {
	this.img = 0;
	this.moveSpeed = 4;

}
Hero.prototype = new Sprite;


function Block() {}
Block.prototype = new Sprite;


/** @constructor */
function Enemy(loc) {
	this.prototype = new Sprite;
	this.img = randPick([0x10, 0x12]);
	this.loc = loc;
	this.prevLoc = this.getLoc();

	var moveDirs = [null, 0, 1, 2, 3];
	this.moveDuration = 0;
	this.moveDir = 0;
	this.faceDir = 0;

	this.moveSpeed = 5;

	this.newMove = function () {
		this.moveDuration = randInt(8, 20);
		this.moveDir = randPick(moveDirs);
		if (this.moveDir <= 1) {
			this.faceDir = this.moveDir;
		}
	};

	this.newMove();

	this.update = function () {
		if (this.moveDuration === 0) {
			this.newMove();
		}
		this.moveDuration -= 1;
		this.updateLoc();
	};


}
Enemy.prototype = new Sprite;

/** @constructor */

function Missile(loc) {
	//this.prototype = new Sprite;
	this.img = 0x30;
	this.moveSpeed = 7;
	
}
Missile.prototype = new Sprite;




function init() {

	var screen = document.getElementById('canvas').getContext("2d");
	var bg = createCanvasContext(0x180, 0x120);

	var spriteSheet = loadImg('sheet.png');

	setTimeout(game, 400);



function game() {

	var frame = 0;


	var skullImg = 0x41;

	var blockList = [];

	var blockLocs = [
		[0, 0],
		[0, 24],
		[0, 48],
		[0, 72],
		[0, 96],
		[0, 120],
		[0, 144],
		[0, 168],
		[0, 192],
		[0, 216],
		[0, 240],
		[0, 264],

		[360, 0],
		[360, 24],
		[360, 48],
		[360, 72],
		[360, 96],
		[360, 120],
		[360, 144],
		[360, 168],
		[360, 192],
		[360, 216],
		[360, 240],
		[360, 264],

		[24, 0],
		[48, 0],
		[72, 0],
		[96, 0],
		[120, 0],
		[144, 0],
		[168, 0],
		[192, 0],
		[216, 0],
		[240, 0],
		[264, 0],
		[288, 0],
		[312, 0],
		[336, 0],
		[360, 0],

		[24, 264],
		[48, 264],
		[72, 264],
		[96, 264],
		[120, 264],
		[144, 264],
		[168, 264],
		[192, 264],
		[216, 264],
		[240, 264],
		[264, 264],
		[288, 264],
		[312, 264],
		[336, 264],

		[96, 72],
		[96, 192],

		[192, 72],
		[216, 72],
		[240, 72],
		[264, 72],
		[264, 192],
		
		[264, 216],
		[264, 240],
		[264, 264],
		
		[96, 96],
		[96, 120],
		[96, 144],
		[96, 168],
		
		

	];


	var blockImg = 0x21;
	iterate(blockLocs, function (item) {
		var block = new Block;
		block.img = blockImg;
		block.loc = item;
		blockList.push(block);
	});

	var barrelA = new Block;
	var barrelB = new Block;
	barrelA.img = barrelB.img = 0x22;
	barrelA.loc = [192,120];
	barrelB.loc = [168, 144];




	var enemyList = [];
	var missileList = [];
	var decalList = [];


	enemyList.push(new Enemy([192, 240]));
	enemyList.push(new Enemy([48, 192]));
	enemyList.push(new Enemy([240, 48]));
	enemyList.push(new Enemy([312, 216]));

	var hero = new Hero;
	hero.loc = [25, 25];
	hero.prevLoc = hero.getLoc();


	var lastMissile = 0;


	// Setup the input key scanner
	var key = new keyScanner();



	key.bindAction(40, function () { // down
		hero.faceDir = hero.moveDir = 2;
	});
	key.bindAction(39, function () { // right
		hero.faceDir = hero.moveDir = 0;
	});
	key.bindAction(38, function () { // up
		hero.faceDir = hero.moveDir = 3;
	});
	key.bindAction(37, function () { // left
		hero.faceDir = hero.moveDir = 1;
	});

	key.bindAction(32, function () { // Space
		if (frame - lastMissile > 18) {
			var missile = new Missile();
			missile.loc = hero.getLoc();

			missile.moveDir = hero.faceDir;
			missileList.push(missile);
			lastMissile = frame;

		}
	});


	// Draw the background floor tiles
	for (var i = 0; i < 16; i++) {
		for (var j = 0; j < 12; j++) {
			drawSprite(bg, spriteSheet, 0x20, [i * 24, j * 24]);
		}
	}


	// Draw the background blocks (sprites that block movement)
	iterate(blockList, function (block) {
		drawSprite(bg, spriteSheet, block.img, block.loc);
	});

	// Copy the background to the screen
	screen.drawImage(bg.canvas, 0, 0);

	// Start the updat loop
	var fps = 24;
	var interval = setInterval(update, 1000 / fps); // 30 FPS

	function update() {

		// Make hero move from keyboard input
		hero.moveDir = null; // Every frame this is reset this before the keyboard input
		if (!hero.dead) {
			key.performActions();
			hero.updateLoc();
		}

		// Hero vs blocks
		var heroBox = hero.getBox();
		iterate(blockList, function (block) {

			if (block.isOverlapping(hero)) {
				hero.loc = hero.prevLoc;
			}
		});


		// Enemy vs missile and enemy vs hero
		iterate(enemyList, function (enemy) {
			enemy.update(); // Does both update and updateLoc
			if (enemy.dead) return;

			if (enemy.isOverlapping(hero)) { 
				var newDecal = new Decal;
				newDecal.loc = hero.getLoc();
				newDecal.img = 0x31;
				decalList.push(newDecal);
				hero.dead = true;
				//return;
			}

			// Block enemy
			iterate(blockList, function (block) {
				if (block.isOverlapping(enemy)) {
					enemy.loc = enemy.prevLoc; // Reset enemy loc
					return false;
				}
			});


		});


		// Process all missiles: enemy vs missile
		iterate(missileList, function (missile) {
			if (missile.dead) return;

			// Update position
			missile.updateLoc();

			// Determine if someone has been hit
			iterate(blockList, function (block) {
				if (missile.isOverlapping(block)) {
					missile.dead = true;
					return false; // Break
				}
			});
			if (missile.dead) return;

			// Hit an enemy
			iterate(enemyList, function (enemy) {
				if (enemy.dead) return;
				if (missile.isOverlapping(enemy)) {
					enemy.dead = true;
					missile.dead = true;
					var newDecal = new Decal;
					newDecal.loc = enemy.getLoc();
					decalList.push(newDecal);
				}
			});



		});



		// Now we can clean rectangles
		chainIterate([[hero], enemyList, missileList], function (item) {

			screen.drawImage(bg.canvas, item.prevLoc[0], item.prevLoc[1], item.size[0], item.size[1], item.prevLoc[0], item.prevLoc[1], item.size[1], item.size[1]);


		});

		// Now we can draw everything all over again
		chainIterate([decalList, missileList, enemyList, [hero]], function (item) {

			item.draw(screen, spriteSheet);
		});
		
		frame++;

	}
}
}

/** @constructor */

function keyScanner() {

	var self = {};

	self.keydown = [];
	self.keytouched = [];
	self.bindings = [];

	document.onkeydown = function (event) {
		self.keydown[event.which] = true;
		self.keytouched[event.which] = true;
	};

	document.onkeyup = function (event) {
		self.keydown[event.which] = false;
	};

	self.bindAction = function (keycode, f) {
		self.bindings.push([keycode, f]);
	};

	self.performActions = function () {
		for (var i = 0, len = self.bindings.length; i < len; i++) {
			var binding = this.bindings[i];
			if (self.keydown[binding[0]] || self.keytouched[binding[0]]) binding[1]();
		}
		self.keytouched = [];
	};

	return self;
}

window['init'] = init;