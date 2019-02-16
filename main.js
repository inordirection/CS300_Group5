/* class: game
 *  has a:
 *    ship: which tracks player location, status
 *    world (CPArray): 2d array of locations in the game space */
function Game() {
	/* private variables (var makes value private) */
	var ship; // Ship object
	var cp; // CPArray
	var over; // track whether the game has ended
	var message; // message to be displayed at end of turn

	/* Public (priviliged) methods:
     *   methods declared with this.methodname = function(params...) {}
     *   are publically accessible but may access private variables
     *   their internals are also private */

	/* build the initial display */
	this.initDisplay = function () {
	  	// if user has localStorage, load persistent state:

		// otherwise, initialize variables:
		ship = new Ship();
		cp = new CPArray();
		over = false;
		message = "Welcome to SpaceHunt!"

		update(); // display to user
	}

	/* moves ship, use supplies, visits whichever cp it lands on */
	this.move = function() {
		/* get user input from forms */
		angle = document.forms['movement']['angle'].value;
		dist = document.forms['movement']['distance'].value;

		if (isNaN(dist) || dist < 1) {
			alert("You must enter a distance of at least 1.");
		}
		else {
			ship.move(angle, dist);
			ship.useSupplies();
			cp.visit(ship.x, ship.y);
			update();
		}
	}

	/* call the beacon to reveal a portion of the map */
	this.beacon = function() {
		cp.useBeacon(ship.x, ship.y, ship.beacon);
		ship.useSupplies();
		update();
	}


	/* Private methods
	 *   declaring method with 'function name(params) {}' makes that method private
	 *   (it is equivalent to var name = function(params) {}) */

	/* update: update the user display after each turn is taken
	 * 	call at the end of any action that constitutes a 'turn',
	 * 	after all internal data changes related to turn have been made */
	function update() {
		// If game over, don't allow user to keep playing
		if (isOver()) {
			alert("You lost the game. Click \'Play Again?\' to continue.");
			return;
		}

		// if game is not over, update the user display
		write_location();
		write_supplies();
		write_energy();
		write_collisions();
		write_map();
		write_message();
		save_state(); // and save the state to local storage
	}

	/* write methods:
	 * 	write to forms of index.html to reflect changes at end of turn
	 * 	write to all forms with update() function
	 * 	append to message variable if necessary
	 * 	call gameOver() if game should end */
	function write_location() {
		coords = "(" + ship.x + ", " + ship.y + ")";
		document.getElementById('location').value = coords;
	}

	function write_energy() {
		document.getElementById('energy').value = ship.energy;

		if (ship.energy < 1) {
			message += "You ran out of energy.\n";
			message += "Try again next time.";
			gameOver();
		}
	}

	function write_supplies() {
		document.getElementById('supplies').value = ship.supplies;

		if (ship.supplies < 1) {
			message += "You ran out of supplies.\n"
			message += "Try again next time.";
			gameOver();
		}
	}

	function write_message() {
		document.getElementById('message').value = message;
		message = "";
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
	function gameOver() {
		this.over = true;

		// clear localStorage

		// write 'play again?' button to document
		var display = document.forms['display'];

		var e = document.createElement("input");
		e.setAttribute('type',"submit");
		e.setAttribute('value',"Play Again?");
		e.setAttribute('onSubmit',"game.initDisplay()");

		display.appendChild(e);
	}
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
