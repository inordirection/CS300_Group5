/* class: ship
 * 	has counters for energy and supplies
 * 	has an x,y position
 * 	has a upgradable engine and beacon */
function Ship(json) {
	var maxX = 127;
	var maxY = 127;

	// read ship from json if available
	if (json != null) {
		for (var key in json) this[key] = json[key];
	}

	// otherwise, default state of ship:
	else {
		this.energy = 1000;
		this.supplies = 100;
		this.credits = 1000;
		this.x = 0;
		this.y = 0;
		this.range = 2; // sensor initially has range 2
		this.engine = 10; // basic engine consumes 10 energy per unit traveled
		this.wormed = false; // indicates whether ship just passed through a wormhole
		// this.size = 127; // the size of the game map, default value is 127.
		this.isFIXW = false;
	}

	/* public methods */
	/* move: update ship position, energy */
	this.move = function(angle, distance, cm) {
		// update to final position
		this.x = Math.round(this.x + distance*Math.cos(angle * Math.PI/180));
		this.y = Math.round(this.y + distance*Math.sin(angle * Math.PI/180));

		// if going out of bounds, pass through wormhole
		if (!cm.Check_size(this.x, this.y)) {
			if (!this.isFIXW) {
				alert('normal wh');
				this.wormhole();
			} else {
				alert('special wh');
				this.DEV_fixed_wormhole();
			}
		}

		// update energy
		this.energy -= this.engine * distance;
	}

	// use the standard 2% of supplies
	this.useSupplies = function() {
		this.supplies -= 2;
	}

	/* warp to a random location */
	this.wormhole = function() {
		// alert('get max and min');
		this.x = parseInt(Math.random() * maxX);
		this.y = parseInt(Math.random() * maxY);
		alert(x);
		this.wormed = true;
	}

	/**
	 * FOR DEV MODE
	 * set new game size.
	 */
	this.DEV_set_size = function() {
		var size = parseInt(prompt('new game size = '));
		if (size < 0 || size > 128) {
			alert('The new size is wrong.');
			return ;
		}
		this.size = size;
		alert('already set size')
	}

	/**
	 * FOR DEV MODE
	 * fixed wormhole, set the ship to a special position.
	 */
	this.DEV_fixed_wormhole = function() {
		var x = parseInt(prompt('new x = '));
		var y = parseInt(prompt('new y = '));
		if (x < 0 || y < 0 || x > this.size || y > this.size) {
			alert('The new size is wrong');
			return ;
		}

		this.x = x;
		this.y = y;
		this.wormed = true;
	}

	/**
	 * FOR DEV MODE
	 * set ship to a special location
	 */
	this.DEV_set_location = function(cm) {
		var x = parseInt(prompt('x = '));
		var y = parseInt(prompt('y = '));

		if (!cm.Check_size(x, y)) {
			alert('the location is wrong');
			return ;
		}

		this.x = x;
		this.y = y;
		// alert('already set location.')
	}

	/**
	 * FOR DEV MODE
	 * set supplies, energy, and credits
	 */
	this.DEV_set_s = function() {
		supplies = parseInt(prompt('supplies = '));
		if (supplies == NaN || supplies < 0) {
			alert('the supplies is wrong');
			return ;
		}
		this.supplies = supplies;
		// alert('already set supplies')
	}

	this.DEV_set_e = function() {
		var energy = parseInt(prompt('energy = '));
		if (energy == NaN || energy < 0) {
			alert('the energy is wrong');
			return ;
		}
		this.energy = energy;
		// alert('already set energy.')
	}

	this.DEV_set_c = function() {
		var credits = parseInt(prompt('credits = '));
		if (credits == NaN || credits < 0) {
			alert('the credit is wrong');
			return ;
		}
		this.credits = credits;
		// alert('already set credits.')
	}
}
