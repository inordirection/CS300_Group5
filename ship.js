/* class: ship
 * 	has counters for energy and supplies
 * 	has an x,y position
 * 	has a upgradable engine and beacon */
function Ship(json) {
	var maxX = 127;
	var maxY = 127;

	// read ship from json if available
	if (json != null && json != undefined) {
		for (var key in json) this[key] = json[key];
	}

	// otherwise, default state of ship:
	else {
		this.energy = 1000;
		this.supplies = 100;
		this.x = 0;
		this.y = 0;
		this.range = 2; // sensor initially has range 2
		this.engine = 10; // basic engine consumes 10 energy per unit traveled
		this.wormed = false; // indicates whether ship just passed through a wormhole
	}

	/* public methods */
	/* move: update ship position, energy */
	this.move = function(angle, distance) {
		// update to final position
		this.x = Math.round(this.x + distance*Math.cos(angle * Math.PI/180));
		this.y = Math.round(this.y + distance*Math.sin(angle * Math.PI/180));

		// if going out of bounds, pass through wormhole
		if (this.x < 0 || this.x > maxX || this.y < 0 || this.y > maxY)
			this.wormhole();

		// update energy
		this.energy -= this.engine * distance;
	}

	// use the standard 2% of supplies
	this.useSupplies = function() {
		this.supplies -= 2;
	}

	/* warp to a random location */
	this.wormhole = function() {
		this.x = Math.round(Math.random() * maxX);
		this.y = Math.round(Math.random() * maxY);
		this.wormed = true;
	}
}
