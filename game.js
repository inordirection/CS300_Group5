/* class: game
 *  has a: 
 *    ship: which tracks player location, status
 *    world (CPArray): 2d array of locations in the game space */
function Game() {
	localStorage.clear();
	/* private variables (var makes value private) */
	var ship; // Ship object
	var cm; // Celestial Map
	var over; // track whether the game has ended
	var message; // message to be displayed at end of turn
	var sensor; // deployed to

	/* Public (priviliged) methods:
     *   methods declared with this.methodname = function(params...) {}
     *   are publically accessible but may access private variables
     *   their internals are also private */

	/* build the initial display */
	this.initDisplay = function () { 
	  	// if user has localStorage, load persistent state:
		ship = new Ship(JSON.parse(localStorage.getItem('ship')));
		cm = new CelestialMap(JSON.parse(localStorage.getItem('cm'), 16));
		sensor = new Sensor(JSON.parse(localStorage.getItem('sensor')));
		over = false;
		message = JSON.parse(localStorage.getItem('message'));
		if (message == null) message = "Welcome to SpaceHunt!";
		
		update(); // update user display
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
			//cm.GetPoint(ship.x, ship.y).Run()
			update();
		}
	}

	/**
	 * US-6: Sensors
	 * deploy sensor one time. It cost one turn.
	 */
	this.deploy_sensor = function() {
		ship.useSupplies();
		sensor.deploy_sensor(ship.x, ship.y, cm, ship.range);
		update();
	}

	this.ToString = function() {
		cm.ToString();
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
		update_text();
		save_state(); // and save the state to local storage
	}

	function update_text() {
		write_location();
		write_supplies();
		write_energy();
		write_collisions();
		write_map();
		write_message();
	}

	/* write methods: 
	 * 	write to forms of index.html to reflect changes at end of turn
	 * 	write to all forms with update() function
	 * 	append to message variable if necessary
	 * 	call gameOver() if game should end */
	function write_location() {
		coords = "(" + ship.x + ", " + ship.y + ")";
		document.getElementById('location').value = coords;

		if (ship.wormed) {
			message += "You passed through a wormhole!\n"
			ship.wormed = false;
		}
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

	function write_map() // TODO: US-7
     {
          /*
          var e = document.body;

          for(var y = 0; y < this.celestialMap.size; y++)
          {
               var row = document.createElement("div");
               row.className = "row";
               //row.style.backgroundColor = "red";
               //row.style.width = (this.celestialMap.size) + "px";

               for(var x = 0; x < this.celestialMap.size; x++)
               {
                    var cell = document.createElement("div");
                    cell.className = "gridSquare";
                    //cell.innerText = (y * this.celestialMap.size) + x;

                    //console.log(this.celestialMap.GetPoint(x, y).ToString());
                    if(this.celestialMap.GetPoint(x, y).type == 4)
                    {
                         //console.log("WORMHOLE");
                         cell.style.backgroundColor = "red";

                         cell.style.backgroundImage = "url('Wormhole1.png')";
                    }
                    else
                         cell.style.backgroundImage = "url('Asteroid1.png')";
                    //cell.style.repeat
                    cell.style.backgroundColor = "black";
                    //cell.style.margin = "0px";
                    //cell.style.padding = "0px";
                    cell.style.height = "16px";
                    //cell.style.width = "16px";
                    row.appendChild(cell);
               }
               e.appendChild(row);
          }
          //document.getElementById("spawn").innerText = e.innerHTML;
          */
     }

	/* save_state: write the game state to localStorage
	 *   called at end of any turn */
	function save_state() {
		// if user just hit game over:
		if (isOver()) 
			localStorage.clear();
		else {
			localStorage.setItem('ship', JSON.stringify(ship));
			localStorage.setItem('cm', JSON.stringify(cm));
			localStorage.setItem('sensor', JSON.stringify(sensor));
			localStorage.setItem('message', JSON.stringify(message));
		}
	} 

	/* isOver(): returns whether the game is over */
	function isOver() { return over; }

	/* sets the game status to over */
	function gameOver() { 
		over = true; 

		// write 'play again?' button to document
		var display = document.forms['display'];

		var e = document.createElement("input");
		e.setAttribute('type',"submit");
		e.setAttribute('value',"Play Again?");
		e.setAttribute('onSubmit',"game.initDisplay()");

		display.appendChild(e);
	}
}
     
