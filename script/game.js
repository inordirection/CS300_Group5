/* class: game
 *  has a:
 *    ship: which tracks player location, status
 *    world (CelestialMap): 2d array of locations in the game space */
function Game() {
	/* private variables (var makes value private) */
	var cm; // Celestial Map
	var ship; // Ship object
	var over; // track whether the game has ended
	var message; // message to be displayed at end of turn
	var sensor; // deployed to reveal celestial points
	var that = this; // for accessing parent scope in helper funcs
	var configuration = new Configuration();
	var isDEV = false; // FOR DEV MODE whether the dev mode is open
	var isNEVERDIES = false; // FOR DEV MODE whether the player never dies

	/*****************
	 * Public (priviliged) methods:
     *   methods declared with this.methodname = function(params...) {}
     *   are publically accessible, but may access private variables
     *   their internals are also private 
	 *   */

	/* build the initial display */
	this.initDisplay = function (size = 128) {
		/* if user has localStorage, load persistent state :
		 *   if there is nothing yet in localStorage, getItem will return null,
		 *   which should be checked for in class initialization */
		cm = new CelestialMap(load('cm'), size);
		ship = new Ship(load('ship'));
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
	}

	this.render_map = function() {
		var size = cm.GetSize();

		// if first call, init to undiscovered
		if (this.textMap == undefined || this.textMap.size != size) {
			this.textMap = new Array(size);
			this.last = cm.GetPoint(0,0);
			for (i = 0; i < size; i++) {
				this.textMap[i] = new Array(size);
				for (j = 0; j < size; j++)
					this.textMap[i][j] = '_';
			}
		}

		var visibleCPs = cm.visibleSet;
		for (cp of visibleCPs) {
			var type = cp.type;
			var c = cp.coordinate;
			var ch = TypeEnum.properties[type].ch;
			this.textMap[c.y][c.x] = ch;
		}

		/* update 'S' to reflect ship's current position
		 * and rewrite the prior 'S' to its proper tile */
		this.textMap[this.last.coordinate.y][this.last.coordinate.x] 
			= TypeEnum.properties[this.last.type].ch;
		this.textMap[ship.y][ship.x] = 'S';
		this.last = cm.GetPoint(ship.x, ship.y);

		var m = document.forms['shitmap'];
		m.innerText = "";
		for (i = size-1; i >= 0; i--) {
			m.innerText += this.textMap[i];
			m.innerText += "\n";
		}
	}

	this.reset_game = function () {
		localStorage.clear();
	}

	this.ToString = function () {
		cm.ToString();
	}

	/**
	 * FOR DEV MODE
	 * whether the dev mode is open
	 */
	this.DEV_open = function() {
		configuration.DEV_open();
	}

	// open customize game initial
	this.DEV_selected_ini_open = function() {
		configuration.DEV_selected_ini_open();
	}

	/**
	 * FOR DEV MODE
	 * change the selected value
	 * energy, credits, supplies, location, sensor, and size
	 */
	this.DEV_ecsl = function() {
		configuration.DEV_set_size(that, false);
		// if (document.getElementById('ecsl').size.checked) {
		// 	configuration.DEV_set_size(size); 
		// 	document.getElementById('ecsl').size.checked = false;
		// 	/* moved to game- cannot change size of map without re-initializing,
		// 	 * or the gameplay will not be valid (you will hit array out of bounds if
		// 	 * increasing size, you will not have all planets in game if decreasing) */
		// }
		configuration.DEV_set_cesl(ship, cm);
		update();
	}

	// select fixed wormhole or normal wormhole behavior
	this.DEV_fixed_wh = function() {
		configuration.DEV_fixed_wh(ship);
	}

	// never dies
	this.DEV_never = function() {
		configuration.DEV_never();
	}

	// initial game use state values, celestial object,
	// and game parameters.
	this.DEV_customize = function () {
		alert('For the game customize, you can select state values, parameters, and celestial objects.\nState Values: energy, credits, supplies, locations, and game size.\nParameters: never dies, fixed wormhole.\nCelestial objects: decided how many, what kinds of and its locations.');
		// Initial state values: energy, credits, supplies, game size.
		configuration.DEV_set_size(that, true);
		configuration.DEV_selected_initial(ship, cm);
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
		write_credits();
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

	function write_credits() {
		document.getElementById('credits').value = ship.credits;
	}

	function write_collisions() {

		var cpType = cm.celestialPoints[ship.x][ship.y].type;

		// if we didn't hit empty space, wormhole, or Eniac, we lose
		if (cpType!=TypeEnum['EMPTY'] && cpType!=TypeEnum['WORMHOLE']
			&& cpType!=TypeEnum['ENIAC'] &&!over) 
		{
			var name = TypeEnum.properties[cpType].name;
			message += "Oh no. We hit a " + name + "!\n";
			gameOver();
		}
		// if we hit a wormhole, warp, update location, check for new collision
		if (cpType==TypeEnum['WORMHOLE']) {
			ship.move(0, cm.GetSize(), cm);
			ship.energy += cm.GetSize() * ship.engine;
			write_location();
			write_collisions();
		}
	}

	function write_message() {
		document.getElementById('message').value = message;
		message = ""; 
	}

	function write_map()
	{
		var style = document.getElementById('map').style.display;
		if (style != 'none') that.render_map();
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
		var json = JSON.stringify(value);
		localStorage.setItem(key, json);
	}
	function load(key) {
		var json = localStorage.getItem(key);
		return JSON.parse(json);
	}
	/* isOver(): returns whether the game is over */
	function isOver() {
		return over;
	}

	/* sets the game status to over */
	// If the dev mode and never dies mode both are open
	// always return set to false and return direactly.
	function gameOver() {
		if (configuration.DEV_whether('dev') && configuration.DEV_whether('dies')) {
			over = false;
			return ;
		}

		over = true;
		message+="Try again next time.";

		// write 'Play Again?' button to display
		write_prompt("Play Again?", "game.initDisplay()");
	}
}
