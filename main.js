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
	var message = ""; // message to be displayed at end of turn

	/* Public (priviliged) methods: */
	/* move: used to move the ship
	 * 	method moves ships, uses supplies, and visits whichever cp ship lands on */
	this.move = function() {
		/* get user input from forms: read into angle, dist */
		angle = document.forms['movement']['angle'].value;
		dist = document.forms['movement']['distance'].value;
		ship.move(angle, dist);
		ship.useSupplies();
		cp.visit(ship.x, ship.y);
		update();
	}

	/* call the beacon to reveal a portion of the map */
	this.beacon = function() {
		cp.useBeacon(ship.x, ship.y, ship.beacon);
		ship.useSupplies();
		update();
	}

	/* build the initial display */
	this.initDisplay = function () { update(); }

	/* Private methods */
	/* update: update the user display after each turn is taken
	 * 	call at the end of any action that constitutes a 'turn' */
	function update() {
		write_location();
		write_supplies();
		write_energy();
		write_map();
		write_collisions();
		save_state();
	}

	/* write methods: 
	 * 	write to forms of index.html to reflect changes at end of turn
	 * 	write to all forms with update() function
	 * 	display message if appropriate
	 * 	call over() if game should end */
	function write_location() {
		console.log("x0= " + ship.x);
		coords = "(" + ship.x + ", " + ship.y + ")";
		console.log("coords: " + coords);
		document.getElementById('location').value = coords;
	} 

	function write_energy() { // TODO: US-3
		document.getElementById('energy').value = ship.energy;
	}

	function write_supplies() { // TODO: US-4
		document.getElementById('supplies').value = ship.supplies;
	}

	function write_collisions() { // TODO: US-5

	}

	function write_map() { // TODO: US-7

	}

	/* save_state: write the game state to localStorage
	 *   called at end of any turn */
	function save_state() { // TODO: US-8

	} 

	/* isOver(): returns whether the game is over */
	function isOver() { return this.over; }

	/* sets the game status to over */
	function over() { this.over = true; }
}

/* class: ship
 * 	has counters for energy and supplies
 * 	has an x,y position 
 * 	has a upgradable engine and beacon */
function Ship() {
	// initial state of ship:
	this.energy = 1000;
	this.supplies = 100;
	this.x = 0; 
	this.y = 0;
	this.engine = 10; // basic engine consumes 10 energy per unit traveled
	this.beacon = 2; // basic beacon sees 2 units

	var maxX = 127;
	var maxY = 127;
	
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
		this.energy -= this.engine * Math.abs(distance);
	} 

	// use the standard 2% of supplies
	this.useSupplies = function() {
		this.supplies -= 2;
	}

	/* warp to a random location */
	this.wormhole = function() {
		this.x = Math.round(Math.random() * maxX);
		this.y = Math.round(Math.random() * maxY);
	}
}

function CPArray () {
	/* TODO: US-2 write constructors for this class
	 * 	collaborate with writer of US-8 about how to load from
	 * 	game state saved from previous session to localStorage
	
	/* 2d array of tiles: (don't know syntax for this yet) */
	var arr = []
	
	// visit an x,y coordinate of the CPArray
	this.visit = function(x, y) {
		// if x or y out of bounds, visit random tile in valid range
		
		// otherwise update mapped value for the tile

		// run the tile at cp[x][y]
	}

	/* reveal all Tiles within dist of (x, y) */
	this.useBeacon = function(x, y, dist) { // TODO: US-6

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
