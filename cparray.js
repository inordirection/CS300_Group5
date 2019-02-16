
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
