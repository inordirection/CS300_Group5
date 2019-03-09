/* class: ship
 * 	has counters for energy and supplies
 * 	has an x,y position
 * 	has a upgradable engine and beacon */
function Ship(json) {
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
		this.isFIXEDWH = false; // is 'fixed wormhole'
	}

	/* public methods */
	/* move: update ship position, energy */
	this.move = function(angle, distance, cm) {
		// update to final position
		this.x = Math.round(this.x + distance*Math.cos(angle * Math.PI/180));
		this.y = Math.round(this.y + distance*Math.sin(angle * Math.PI/180));

		// if going out of bounds, pass through wormhole
		if (!cm.checkSize([this.x, this.y])) {
			if (!this.isFIXEDWH) {
				this.wormhole(cm);
			} else {
				this.UsefixedWormhole(cm);
			}
		} else this.wormed = false;

		cm.ChangeVisible(this.x, this.y);
		// update energy
		this.energy -= this.engine * distance;
	}

	/**
	 * can pass negative value to gain money
	 */
	this.useCredits = function(used) {
		this.credits -= used;
		if (this.credits < 0) {
			this.credits = 0;
		}
	}

	// use the standard 2% of supplies
	this.useSupplies = function() {
		//this.supplies *= 0.98;
		this.supplies -= 2;
	}

	/* warp to a random location */
	this.wormhole = function(cm) {
		this.x = parseInt(Math.random() * cm.GetSize());
		this.y = parseInt(Math.random() * cm.GetSize());
		this.wormed = true;
	}

	/**
	 * FOR DEV MODE
	 * fixed wormhole, set the ship to a special position.
	 */
	this.UsefixedWormhole = function(cm) {
		var x = parseInt(prompt('new x = '));
		var y = parseInt(prompt('new y = '));
		if (!cm.checkSize([x, y])) {
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
	this.setLocation = function(cm, xy) {
	    if (xy === []) {
	        return;
        }
		if (!cm.checkSize(xy)) {
			alert('the location is wrong');
			return ;
		}
		this.x = xy[0];
		this.y = xy[1];
		cm.ChangeVisible(this.x, this.y);
		// alert('already set location.')
	}

	/**
	 * FOR DEV MODE
	 * set supplies, energy, credits, sensor
	 */
	this.setSupplies = function(supplies) {
		if (supplies < 0) {
			alert('the supplies is wrong');
			return ;
		}
		if (!isNaN(supplies)) {
			this.supplies = supplies;
		}
	}

	this.setEnergy = function(energy) {
		if (energy < 0) {
			alert('the energy is wrong');
			return ;
		}
		if (! isNaN(energy)) {
			this.energy = energy;
		}
	}

	this.setCredits = function(credits) {
		// var credits = parseInt(prompt('credits = '));
		if (credits < 0) {
			alert('the credit is wrong');
			return ;
		}
		// if credits is nan, is not change
		if (!isNaN(credits)) {
			this.credits = credits;
		}
	}
}
