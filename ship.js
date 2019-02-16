class Ship {
	constructor() {
		this.energy = 1000;
		this.supplies = 100;
          this.coordinate = new Coordinate(0, 0);
	}

	// update ship position
	move(angle, distance) {} // TODO: US-1

	beacon() {} // TODO: US-6
	/* note: I'm not yet sure if beacon really belongs in the ship class or elsewhere.
	 * it needs to update the ship's supplies, but also to reveal parts of the CPArray */

	// getters
	getX() { return this.x } // US-1
	getY() { return this.y } // US-1
}
