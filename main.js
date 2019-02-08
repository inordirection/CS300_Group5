/* class: game
 *  has a: 
 *    ship: which tracks player location, status
 *    world (CPArray): 2d array of locations in the game space */
class Game {
	constructor() {
		this.ship = new Ship();
		this.cp = new CPArray();

		this.playing = true;
		this.over = false;
	}

	/* Methods: */
	/* play: master function to run the game */
	play() {
		while (game.stillPlaying() && !game.isOver()) {
			/* get user input from forms: read into angle, dist, beacon */
			angle = 0; // should read from angle form
			dist = 0; // should read from dist form
			beacon = false; // read from beacon form

			game.turn(angle, dist, beacon); // update data
			game.update(); // update display
		}
		if (!game.playing) // if user quit, rather than game over
			game.write_state(); // write for persistent storage (US-8)
	}

	/* turn: function is responsible for updating game state/ship state after each turn */
	turn(angle, dist, beacon) {
		if (beacon) {
			ship.beacon();
		}
		else {
			ship.move(angle, distance);
			cp.visit(ship.getX(), ship.getY());
		}
	}
		
	/* update: update the user display after each turn is taken */
	update() {
		write_supplies();
		write_energy();
		write_map();
		write_collisions();
	}

	/* write methods: 
	 * 	write to forms of index.html to reflect changes after calling turn() 
	 * 	display message if appropriate
	 * 	call over() if game should end */
	write_energy() {} // TODO: US-3
	write_supplies() {} // TODO: US-4
	write_collisions() {} // TODO: US-5
	write_map() {} // TODO: US-7

	// TODO: US-8
	/* save_state: write the game state to localStorage
	 *   called when user chooses to save/quit */
	save_state() {} 


	/* state functions: */
	/* stillPlaying(): see if user still wants to play 
	 * 	updates playing value based on save/quit form
	 * 	returns updated value (boolean) */
	stillPlaying() { } // TODO: US-8

	/* isOver(): returns whether the game is over */
	isOver() { return this.over; }

	/* sets the game status to over */
	over() { this.over = true; }
}

/* class: ship
 * 	has counters for energy and supplies
 * 	has an x,y position */
class Ship {
	constructor() {
		this.energy = 1000;
		this.supplies = 100;
		this.x = 0;
		this.y = 0;
	}
	
	// update ship position
	move(angle, distance) {} // TODO: US-1

	beacon() {} // TODO: US-6
	/* note: I'm not yet sure if beacon really belongs in the ship class or elsewhere.
	 * it needs to update the ship's supplies, but also to reveal parts of the CPArray */

	// getters/setters
	getX() {} // US-1
	getY() {} // US-1
}

class CPArray {
	/* TODO: US-2 write constructors for this class
	 * 	collaborate with writer of US-8 about how to load from
	 * 	game state saved from previous session to localStorage
	
	/* 2d array of tiles: (don't know syntax for this yet) */
	constructor() {
		this.arr = []
	}
	
	// visit an x,y coordinate of the CPArray
	visit(x, y) {
		// update mapped value for the tile

		// run the tile at cp[x][y]
	}
}

/* class Tile:
 * 	a tile may contain a celestial artifact or be empty
 * 	it should also have a field to record whether it has been mapped
 * 	different celestial artifacts will be subclasses of tile */
class Tile {
	constructor(id = ' ') {
		this.id = id; // id determines type of tile (ex: ' ' for space, 'A' for asteroid)
		this.mapped = false; // bool: has tile been visited or sensed by beacon?
	}

	run() { } // run events for tile
}
