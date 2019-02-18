/* class: game
 *  has a:
 *    ship: which tracks player location, status
 *    world (CelestialMap): 2d array of locations in the game space */
function Game() {
	/* private variables (var makes value private) */
	var ship; // Ship object
	var cm; // Celestial Map
	var over; // track whether the game has ended
	var message; // message to be displayed at end of turn
	var sensor; // deployed to reveal celestial points
	var that = this; // for accessing parent scope in helper funcs
	var isDEV = false; // FOR DEV MODE whether the dev mode is open
	var isNEVERDIES = false; // FOR DEV MODE whether the player never dies

	/*****************
	 * Public (priviliged) methods:
     *   methods declared with this.methodname = function(params...) {}
     *   are publically accessible, but may access private variables
     *   their internals are also private 
	 *   */

	/* build the initial display */
	this.initDisplay = function () {
		/* if user has localStorage, load persistent state :
		 *   if there is nothing yet in localStorage, getItem will return null,
		 *   which should be checked for in class initialization */
		ship = new Ship(load('ship'), 16);
		cm = new CelestialMap(load('cm'), 16);
		sensor = new Sensor();
		sensor.Update_range(ship.range);

		message = load('message');
		if (message == null || message == "")
			message = "Welcome to SpaceHunt!\n";

		over = false;

		update(); // update user display
	}

	/* moves ship, use supplies, visits whichever cp it lands on */
	this.move = function () {
		/* get user input from forms */
		angle = document.forms['movement']['angle'].value;
		dist = document.forms['movement']['distance'].value;

		if (isNaN(dist) || dist < 1) {
			alert("You must enter a distance of at least 1.");
		}
		else {
			ship.move(angle, dist, cm);
			ship.useSupplies();
			//cm.GetPoint(ship.x, ship.y).Run()
			update();
		}
	}

	/**
	 * US-6: Sensors
	 * deploy sensor one time. It cost one turn.
	 */
	this.deploy_sensor = function () {
		ship.useSupplies();
		sensor.deploy_sensor(ship.x, ship.y, cm);
		update();
		console.log('after sensor');
	}

	this.ToString = function () {
		cm.ToString();
	}

	this.reset_game = function () {
		localStorage.clear();
	}

	/**
	 * FOR DEV MODE
	 * whether the dev mode is open
	 */
	this.DEV_open = function() {
		isDEV = (isDEV == true) ? false : true;
		alert('developer mode is ' + isDEV);
	}

	/**
	 * FOR DEV MODE
	 * change the selected value
	 * energy, credits, supplies, and location
	 */
	this.DEV_ecsl = function() {
		if (!isDEV) {
			alert('the developer mode is not open');
			return ;
		}
		if (document.getElementById('ecsl').e.checked){
			ship.DEV_set_e();
		}
		if (document.getElementById('ecsl').c.checked) {
			ship.DEV_set_c();
		}
		if (document.getElementById('ecsl').s.checked) {
			ship.DEV_set_s();
		}
		if (document.getElementById('ecsl').l.checked) {
			ship.DEV_set_location(cm);
		}
		update();
		// alert('after change those.');
	}

	/**
	 * FOR DEV MODE
	 * select fixed wormhole or normal wormhole behavior
	 */
	this.DEV_fixed_wh = function() {
		if (!isDEV) {
			alert('developer mode is close');
			return ;
		}
		ship.isFIXW = (ship.isFIXW == true) ? false : true;
		document.getElementById('whether_fixed').innerHTML = 
			"Use the fixed wormhole mode is " + ship.isFIXW;
	}

	/**
	 * FOR DEV MODE
	 * never dies
	 */
	this.DEV_never = function() {
		if (!isDEV) {
			alert('developer mode is close');
			return ;
		}
		isNEVERDIES = (isNEVERDIES == true) ? false : true;
		document.getElementById('whether_never').innerHTML = "Use never dies mode is " + isNEVERDIES;
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
		// else, update the user display
		update_text();
		// and save the state to local storage
		save_state();
	}

	function update_text() {
		write_location();
		write_supplies();
		write_energy();
		write_collisions();
		write_map();
		write_message();
	}

	/**
	 * write methods:
	 * 	write to forms of index.html to reflect changes at end of turn
	 * 	write to all forms with update() function
	 * 	append to message variable if necessary
	 * 	call gameOver() if game should end 
	 * 	*/
	function write_location() {
		coords = "(" + ship.x + ", " + ship.y + ")";
		document.getElementById('location').value = coords;

		if (ship.wormed) {
			message += "You passed through a wormhole!\n"
		}
	}

	function write_energy() {
		document.getElementById('energy').value = ship.energy;

		if (ship.energy < 1 && !over) {
			message += "You ran out of energy.\n";
			gameOver();
		}
	}

	function write_supplies() {
		document.getElementById('supplies').value = ship.supplies;

		if (ship.supplies < 1 && !over) {
			message += "You ran out of supplies.\n"
			gameOver();
		}
	}

	function write_collisions() { // TODO: US-5

		var cpType = cm.celestialPoints[ship.x][ship.y].type;

		// if we didn't hit empty space, wormhole, or Eniac
		if (cpType!=TypeEnum['EMPTY'] && cpType!=TypeEnum['WORMHOLE']
			&& cpType!=TypeEnum['ENIAC']) 
		{
			var name = TypeEnum.properties[cpType].name;
			message += "Oh no. We hit a " + name + "!\n";
			gameOver();
		}
	}

	function write_message() {
		document.getElementById('message').value = message;
		message = ""; 
	}

	function write_map() // TODO: US-7
	{
		/*
		 var e = document.body;

		console.log(cm.size);
		 for(var y = 0; y < cm.size; y++)
		 {
			  var row = document.createElement("div");
			  row.className = "row";
			  //row.style.backgroundColor = "red";
			  //row.style.width = (cm.size) + "px";

			  for(var x = 0; x < cm.size; x++)
			  {
				   var cell = document.createElement("div");
				   cell.className = "gridSquare";
				   //cell.innerText = (y * cm.size) + x;

				   //console.log(cm.GetPoint(x, y).ToString());
				   if(cm.GetPoint(x, y).type == 4)
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
		 */
		//document.getElementById("spawn").innerText = e.innerHTML;

	}

	/* write a prompt to the user display */
	function write_prompt(text, formFunc) {

		var display = document.forms['display'];

		// write a label to align with display fields
		var label = document.createElement("label");
		label.innerHTML="&zwnj;"; 
		display.appendChild(label);

		// write input form to display
		var e = document.createElement("input");
		e.setAttribute('type', "submit");
		e.setAttribute('value', text);
		e.setAttribute('onSubmit', formFunc);
		display.appendChild(e);
	}

	/**
	 * State functions:
	 ** /
	 
	/* save_state: write the game state to localStorage
	 *   called at end of any turn */
	function save_state() {
		// if user hit game over, clear localStorage for the next game
		if (isOver())
			localStorage.clear();
		else {
			save('ship', ship);
			save('cm', cm);
			save('message', message);
		}
	}
	function save(key, value) {
		var val = JSON.stringify(value);
		localStorage.setItem(key, val);
	}
	function load(key) {
		var getObject = localStorage.getItem(key);
		return JSON.parse(getObject);
	}
	/* isOver(): returns whether the game is over */
	function isOver() {
		return over;
	}

	/* sets the game status to over */
	// If the dev mode and never dies mode both are open
	// always return set to false and return direactly.
	function gameOver() {
		if (isDEV && isNEVERDIES) {
			over = false;
			return ;
		}

		over = true;
		message+="Try again next time.";

		// write 'Play Again?' button to display
		write_prompt("Play Again?", "game.initDisplay()");
	}
}
