/* class: game
 *  has a: 
 *    ship: which tracks player location, status
 *    world (CPArray): 2d array of locations in the game space */
function Game() {
	// private variables
	var ship = new Ship();
	var cp = new CPArray();

	var playing = true;
	var over = false;

	/* Public methods: */
	/* play: master function to run the game */
	this.play = function () {
		if (stillPlaying() && !isOver()) {
			/* get user input from forms: read into angle, dist, beacon */
			angle = document.forms['movement']['angle'];
			dist = document.forms['movement']['dist'];
			beacon = false; // read from beacon form

			turn(angle, dist, beacon); // update data
			update(); // update display
		}
		if (!playing) // if user quit, rather than game over
			save_state(); // write for persistent storage (US-8)
	}

	/* Private methods */
	/* turn: function is responsible for updating game state/ship state after each turn */
	function turn(angle, dist) {
		if (beacon) {
			this.ship.beacon();
		}
		else {
			this.ship.move(angle, distance);
			this.cp.visit(this.ship.x, this.ship.y);
		}
	}
		
	/* update: update the user display after each turn is taken */
	function update() {
		write_supplies();
		write_energy();
		write_map();
		write_collisions();
	}

	/* write methods: 
	 * 	write to forms of index.html to reflect changes after calling turn() 
	 * 	display message if appropriate
	 * 	call over() if game should end */
	function write_energy() {} // TODO: US-3
	function write_supplies() {} // TODO: US-4
	function write_collisions() {} // TODO: US-5
	function write_map() {} // TODO: US-7

	// TODO: US-8
	/* save_state: write the game state to localStorage
	 *   called when user chooses to save/quit */
	function save_state() {} 


	/* state functions: */
	/* stillPlaying(): see if user still wants to play 
	 * 	updates playing value based on save/quit form
	 * 	returns updated value (boolean) */
	function stillPlaying() { } // TODO: US-8

	/* isOver(): returns whether the game is over */
	function isOver() { return this.over; }

	/* sets the game status to over */
	function over() { this.over = true; }
}

/* class: ship
 * 	has counters for energy and supplies
 * 	has an x,y position */
function Ship() {
	this.energy = 1000;
	this.supplies = 100;
	this.x = 0;
	this.y = 0;
	
	// update ship position
	this.move = function(angle, distance) {} // TODO: US-1

	this.beacon = function() {} // TODO: US-6
	/* note: I'm not yet sure if beacon really belongs in the ship class or elsewhere.
	 * it needs to update the ship's supplies, but also to reveal parts of the CPArray */

	// getters
	this.getX = function() { return this.x } // US-1
	this.getY = function() { return this.y } // US-1
}

function CPArray () {
	/* TODO: US-2 write constructors for this class
	 * 	collaborate with writer of US-8 about how to load from
	 * 	game state saved from previous session to localStorage
	
	/* 2d array of tiles: (don't know syntax for this yet) */
	var arr = []
	
	// visit an x,y coordinate of the CPArray
	this.visit = function(x, y) {
		// update mapped value for the tile

		// run the tile at cp[x][y]
	}
}

/* class Tile:
 * 	a tile may contain a celestial artifact or be empty
 * 	it should also have a field to record whether it has been mapped
 * 	different celestial artifacts will be subclasses of tile */
function Tile(id = ' ') {
	this.id = id; // id determines type of tile (ex: ' ' for space, 'A' for asteroid)
	this.mapped = false; // bool: has tile been visited or sensed by beacon?

	this.run = function() { } // run events for tile
}
