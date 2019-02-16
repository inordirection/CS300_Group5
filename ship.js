class Ship
{
	constructor(game)
	{
		// initial state of ship:
		this.energy = 1000;
		this.supplies = 100;
		this.engine = 10; // basic engine consumes 10 energy per unit traveled
		this.beacon = 2; // basic beacon sees 2 units
          this.coordinate = new Coordinate(0, 0);
		this.map = game.celestialMap;

		console.log("Ship Constructed");
	}

	//beacon() {} // TODO: US-6
	/* note: I'm not yet sure if beacon really belongs in the ship class or elsewhere.
	 * it needs to update the ship's supplies, but also to reveal parts of the CPArray */

	/* public methods */
	/* move: update ship position, energy */
	Move(angle, distance) {
		// update to final position
		this.coordinate.x = Math.round(this.x + distance*Math.cos(angle * Math.PI/180));
		this.coordinate.y = Math.round(this.y + distance*Math.sin(angle * Math.PI/180));

		// if going out of bounds, pass through wormhole
		if (this.coordinate.x < 0 || this.coordinate.x > (this.map.size - 1) || this.coordinate.y < 0 || this.coordinate.y > (this.map.size - 1)))
			this.coordinate = this.map.GetRandomPoint().coordinate;
			//this.wormhole();

		// update energy
		this.energy -= this.engine * distance;
		this.UseSupplies();
	}

	// use the standard 2% of supplies
	UseSupplies() {
		this.supplies -= 2;
	}

	/* warp to a random location */
	/*
	this.wormhole = function() {
		this.x = Math.round(Math.random() * maxX);
		this.y = Math.round(Math.random() * maxY);
	}
	*/
}
