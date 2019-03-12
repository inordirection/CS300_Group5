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
		this.wormed = false;
		this.isFIXEDWH = false; // is 'fixed wormhole'
	}

	/* public methods */
	/* move: update ship position, energy */
	this.move = function(angle, distance, cm) {
		// remember start position
		let x0 = this.x;
		let y0 = this.y;
		// update to final position
		this.x = Math.round(this.x + distance*Math.cos(angle * Math.PI/180));
		this.y = Math.round(this.y + distance*Math.sin(angle * Math.PI/180));

		// if passing over an asteroid, hit it
		asteroid_t = TypeEnum['ASTEROID'];
		for (k = 1; k < distance; k++) {
			let x1 = x0 + Math.round(k*Math.cos(angle*Math.PI/180));
			let y1 = y0 + Math.round(k*Math.sin(angle*Math.PI/180));
			if (!cm.checkSize([x1, y1]) ||
				cm.GetPoint(x1, y1).type == asteroid_t) {
				this.x = x1;
				this.y = y1;
				break;
			}
		}
		// if going out of bounds, pass through wormhole
		if (!cm.checkSize([this.x, this.y])) {
			this.wormed = true;
			if (!this.isFIXEDWH) {
				this.wormhole(cm);
			} else {
				this.UsefixedWormhole(cm);
			}
		} 
		// add newly visited coordinate to visible Set
		cm.ChangeVisible(this.x, this.y);
		// update energy
		this.energy -= this.engine * distance;
	}

	/**
	 * can pass negative value to gain money
	 */
	this.useCredits = function(used) {
		if (used > this.credits) {
			alert("You only have " + this.credits + " to spend.");
			return;
		}
		this.credits -= used;
	}

	// use the standard 2% of supplies
	this.useSupplies = function() {
		/* decrease by 2% (to 2 decimal precision)
		this.supplies = Math.round(this.supplies * 98);
		this.supplies /= 100; */
		// decrease by two percent (use at least 1 supply per turn)
		this.supplies = Math.floor(this.supplies * .98);
	}

	this.useEnergy = function(used) {
		this.energy -= used;
	}

	this.damageEngine = function(factor) {
		this.engine *= factor;
	}

	/* warp to a random location */
	this.wormhole = function(cm) {
		this.x = parseInt(Math.random() * cm.GetSize());
		this.y = parseInt(Math.random() * cm.GetSize());
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

	this.setEngine = function(efficiency) {
		if (efficiency < 0) {
			alert('the engine in wrong');
			return ;
		}
		if (! isNaN(efficiency)) {
			this.engine = efficiency;
		}
	}
}
