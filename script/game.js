/* class: game
 *  has a:
 *    ship: which tracks player location, status
 *    world (CelestialMap): 2d array of locations in the game space */
function Game() {
	/* private variables (var makes value private) */
	var cm; // Celestial Map
	var ship; // Ship object
	var over; // track whether the game has ended
	var orbit; // track if ship is orbiting a planet
	var landed; // track if ship is landed
	var message; // message to be displayed at end of turn
	var sensor; // deployed to reveal celestial points
	var that = this; // for accessing parent scope in helper funcs
	// var isDEV = false; // FOR DEV MODE whether the dev mode is open
	// var isNEVERDIES = false; // FOR DEV MODE whether the player never dies
	const message0 = 
		"Welcome to SpaceHunt!\nYou are docked on the moon of planet Eniac. " +
		"Return with the secret KocaKola recipe to win the game!";

	/*****************
	 * Public (priviliged) methods:
     *   methods declared with this.methodname = function(params...) {}
     *   are publically accessible, but may access private variables
     *   their internals are also private
	 *   */

		/* build the initial display */
	this.initDisplay = function (size = 16) {
		/* if user has localStorage, load persistent state :
		 *   if there is nothing yet in localStorage, getItem will return null,
		 *   which should be checked for in class initialization */
		if (!load()) {
			cm = new CelestialMap(null, size);
			ship = new Ship(null);
			message = message0;
			sensor = new Sensor(null);
			over = false;
			orbit = false;
			landed = true; // start game "docked on moon of Eniac"
		}

		// flag to handle proper display on startup
		that.render_map.init = true;
		update(false); // update user display (without writing collisions)
	}

	/* moves ship, use supplies, visits whichever cp it lands on */
	this.move = function (angle) {
		/* get user input from forms */
		sliderDist = document.getElementById("shipDistance").value;

		if (orbit || landed) {
			alert("You can't move the ship while landed or in orbit");
			return;
		}
		ship.move(angle, sliderDist, cm);
		ship.useSupplies();
		update();
	}

	/**
	 * US-6: Sensors
	 * deploy sensor one time. It cost one turn.
	 */
	this.deploy_sensor = function () {
		ship.useSupplies();
		sensor.deploy_sensor(ship.x, ship.y, cm);
		update();
	};

	this.render_map = function() {
		this.textMap;
		var size = cm.GetSize();

		// if first call, init all to undiscovered
		if (that.render_map.init) {
			this.textMap = new Array(size);
			this.last = cm.GetPoint(ship.x, ship.y);
			for (i = 0; i < size; i++) {
				this.textMap[i] = new Array(size);
				for (j = 0; j < size; j++)
					this.textMap[i][j] = '_';
			}
			that.render_map.init = false;
		}

		var visibleCPs = cm.visibleSet;
		for (cp of visibleCPs) {
			let type = cp.type;
			let c = cp.coordinate;
			let ch = TypeEnum.properties[type].ch;
			this.textMap[c.y][c.x] = ch;
		}

		/* update 'S' to reflect ship's current position
		 * and rewrite the prior 'S' to its proper tile */
		this.textMap[this.last.coordinate.y][this.last.coordinate.x]
			= TypeEnum.properties[this.last.type].ch;
		this.textMap[ship.y][ship.x] = 'S';
		this.last = cm.GetPoint(ship.x, ship.y);

		var htmlMap = document.forms['shitmap'];
		var display = this.textMap.slice().reverse()
		htmlMap.innerText = display.join('\n');
	}

	/**
	 * This behavior will remain all of the nameable archive.
	 * if reset game or initial game, the game value will not as same as the last time.
	 * the data of last game is stored by '__last__'.
	 */
	this.reset_game = function () {
		localStorage.removeItem('__last__');
	}

	this.ToString = function () {
		cm.ToString();
	}

	/* Private methods
	 *   declaring method with 'function name(params) {}' makes that method private
	 *   (it is equivalent to var name = function(params) {}) */

	/* update: update the user display after each turn is taken
	 * 	call at the end of any action that constitutes a 'turn',
	 * 	after all internal data changes related to turn have been made */
	function update(collisions = true) {
		// If game over, don't allow user to keep playing
		if (isOver()) {
			alert("You lost the game. Click \'Reset Game\' to continue.");
			return;
		}
		// process current tile
		if (collisions) write_collisions();
		// update the user display
		update_text();
		// and save the state to local storage
		save_state();
	}

	function update_text() {
		write_location();
		write_supplies();
		write_energy();
		write_credits();
		write_map();
		write_message();
		write_prompts();
	}

	/**
	 * write methods:
	 * 	write to forms of index.html to reflect changes at end of turn
	 * 	write to all forms with update() function
	 * 	append to message variable if necessary
	 * 	call gameOver() if game should end
	 * 	*/
	function write_location() {
		let coords = "(" + ship.x + ", " + ship.y + ")";
		document.getElementById('location').value = coords;
	}

	function write_energy() {
		document.getElementById('energy').value = ship.energy;

		if (ship.energy < 1 && !over) {
			message += "YOU RAN OUT OF ENERGY.\n";
			gameOver();
		}
	}

	function write_supplies() {
		document.getElementById('supplies').value = ship.supplies;

		if (ship.supplies < 1 && !over) {
			message += "YOU RAN OUT OF SUPPLIES.\n"
			gameOver();
		}
	}

	function write_credits() {
		document.getElementById('credits').value = ship.credits;
	}

	function write_collisions() 
	{
		// don't lose the game twice
		if (over) return;

		let msgWormedOver = cm.RunPoint(ship, orbit, landed);
		// append events to message
		message += msgWormedOver[0];
		// if we wormed, check for new collisions
		if (msgWormedOver[1]) write_collisions();
		// if we died, we died
		if (msgWormedOver[2]) gameOver();
	}

	function write_message() {
		document.getElementById('message').value = message;
	}

	function write_map()
	{
		var style = document.getElementById('map').style.display;
		if (style != 'none') that.render_map();
	}

	/* write a prompts to the user display */
	function write_prompts()
	{
		clear_prompts(); // clear whatever may have been written previously
		var cpType = cm.GetType(ship.x, ship.y);
		// if we are in empty space, do nothing
		if (cpType == TypeEnum['EMPTY']) return;

		var prompts = document.getElementById('prompts');
		var label = document.createElement("label");
		label.innerHTML="&zwnj;"; // zero-width non-joiner (to force alignment)
		prompts.appendChild(label);

		// write input buttons to display
		if (orbit && !landed) {
			prompts.appendChild(makeButton("Land", land));
			prompts.appendChild(makeButton("Leave Orbit", leaveOrbit));
		}
		else if (landed) {
			prompts.appendChild(makeButton("Blast Off!", blastOff));
		}
		else if (cpType >= TypeEnum['P_ONE']) {
			prompts.appendChild(makeButton("Enter Orbit", enterOrbit));
		}	
		if (cpType == TypeEnum['STATION']) {
			if (landed)
				prompts.appendChild(makeButton("Make a wager.", casino));
			else
				prompts.appendChild(makeButton("Land", land));
		}
	}
	/**
	 * write_prompts() helpers:
	 * */
	function makeButton(text, func) {
		var b = document.createElement("input");
		b.setAttribute('class', "formButton");
		b.setAttribute('value', text);
		b.setAttribute('type', "button");
		b.setAttribute('id', text);
		b.addEventListener('click', func, false);
		return b;
	}
	function clear_prompts() {
		document.getElementById('prompts').innerHTML = "";
	}
	function enterOrbit() {
		ship.useSupplies();
		orbit = true;
		update();
	}
	function land() {
		ship.useSupplies();
		if (cm.GetType(ship.x, ship.y) == TypeEnum['STATION'])
			ship.useCredits(10);
		landed = true;
		update();
	}
	function leaveOrbit() {
		ship.useSupplies();
		orbit = false;
		update();
	}
	function blastOff() {
		ship.useSupplies();
		landed = false;
		update();
	}
	function casino() {
		let wager = prompt("How much would you like to wager?");
		if (isNaN(wager)) {
			alert("You can't wager a " + wager + ".");
			return;
		}
		if (wager > ship.credits) {
			alert("You only have " + ship.credits + " to wager.");
			return;
		}

		ship.useCredits(wager);
		let chance = Math.random();
		if (chance > 0.5) {
			ship.useCredits(-2*wager);
			message += "You won " + 2*wager + "!\n"
		}
		else message += "Chance was not on your side.\n"
		update();
	}


	/**
	 * State functions:
	 ** /

	/**
	 * write the current data to the localstorage.
	 * [ship, cm, message, over, sensor] total five variables.
	 * @param name the name of data, default is __last__ used to store the last game data.
	 * this will be reset use function reset_game
	 */
	function save_state(name='__last__') {
		// if user hit game over, clear localStorage for the next game
		if (isOver()) {
			that.reset_game();
		}
		else {
			save(name, [ship, cm, message, over, sensor, orbit, landed]);
			// store the save names
			save('__choose__', document.getElementById('choose_storage').innerHTML);
			message = ""; // clear message for next turn
		}
	}
	function save(key, value) {
		let json = JSON.stringify(value);
		localStorage.setItem(key, json);
	}
	function load(key='__last__') {
		let json = localStorage.getItem(key);
		let current =  JSON.parse(json);
		let choose = localStorage.getItem('__choose__');
		if (choose !== null) {
			choose = JSON.parse(choose);
			document.getElementById('choose_storage').innerHTML = choose;
		}
		if (current !== null) {
			ship = new Ship(current[0]);
			cm = new CelestialMap(current[1]);
			message = current[2];
			over = current[3];
			sensor = new Sensor(current[4]);
			orbit = current[5];
			landed = current[6];
			that.render_map.init = true;
			return true;
		} else return false;
	}
	/* isOver(): returns whether the game is over */
	function isOver() {
		return over;
	}

	/* sets the game status to over */
	// If the dev mode and never dies mode both are open
	// always return set to false and return directly.
	function gameOver() {
		if (isDEV && isNEVERDIES) {
			over = false;
			return;
		}

		over = true;
		message+="Click \'Reset Game\' to try again.";

		// write 'Play Again?' button to display
		// write_prompt("Play Again?", "game.initDisplay()");
	}

	// whether the dev mode open
	var isDEV = false;

	// whether the player never dies
	var isNEVERDIES = false;

	// whether use fixed wormhole
	var isFIXEDWH = false;

	// whether use selecting initial values
	var isINI = false;

	// This is the form of a celestial object html form
	celestial_obj_form = '<div id="celestial_CELENUMBER">\n' +
		'\t\t\t\t\t\t<select id="celestial_CELENUMBER_type" name="celestial_CELENUMBER_type">\n';
	// dynamically populate based on current TypeEnum
	for (i = 0; i < TypeEnum['ENIAC']; i++) {
		celestial_obj_form += 
			`\t\t\t\t\t\t\t<option value="${i}">${TypeEnum['properties'][i].name}</option>`;
	}
	celestial_obj_form += '\t\t\t\t\t\t</select>\n' +
	'\t\t\t\t\t\t<input type="text" id="celestial_CELENUMBER_coor" name="celestial_CELENUMBER_coor" placeholder="x,y" />\n' +
	'\t\t\t\t\t\t<button id="delete_CELENUMBER_celestial" type="button" name="delete_CELENUMBER_celestial" class="delete_celestial">Delete Celestial Menu</button>\n' +
	'\t\t\t\t\t\t<br />\n' +
	'\t\t\t\t\t</div>';

	// The number of celestial forms
	var num_celestial = 0;

	this.openGameConfiguration = function () {
		isDEV = !isDEV;
		document.getElementById('whether_open').innerHTML = "Using game configuration: " + isDEV;
	};

	// open the control of initial game
	this.openSelectedInitial = function() {
		if (!isDEV) {
			alert('The game configuration is not open.');
			return ;
		}
		isINI = !isINI;
		document.getElementById('whether_open_ini').innerHTML = 
			"Use selected values to initialize game: " + isINI + '.';
		// for the normal part
		const ecsl = document.getElementById('ecsl');
		ecsl.style.display = (ecsl.style.display === 'none') ? 'block' : 'none';
		const fix = document.getElementById('fixed_wh');
		fix.style.display = (fix.style.display === 'none') ? 'block' : 'none';
		const never = document.getElementById('never');
		never.style.display = (never.style.display === 'none') ? 'block' : 'none';
	};

	// change to never dies or not
	function openNeverDies() {
		if (!isDEV) {
			alert('developer mode is close');
			return ;
		}

		isNEVERDIES = !isNEVERDIES;
		document.getElementById('whether_never').innerHTML = "Use never dies mode is: " 
			+ isNEVERDIES;
	}

	// select fixed wormhole or normal wormhole behavior
	function openFixedWormhole () {
		if (!isDEV) {
			alert('developer mode is close');
			return ;
		}

		isFIXEDWH = !isFIXEDWH;
		ship.isFIXEDWH = !ship.isFIXEDWH;
		document.getElementById('whether_fixed').innerHTML =
			"Use fixed wormhole mode is: " + isFIXEDWH;
	}

	/**
	 * create a list of celestial objects that should be added to the new game.
	 * helper function for selected initial.
	 * @returns Array list of celestialPoint objects
	 */
	function getCelestialPointList() {
		let celestial_point_list = [];
		let t, xy, new_cp;
		for (let i = 1; i <= num_celestial; i++) {
			t = getCelestialType(i);
			xy = getCoordinate(document.getElementById('celestial_' + i + '_coor').value);
			if (xy === null) {
				continue;
			}
			if (t >= TypeEnum['CELERON'] && t <= TypeEnum['ENIAC'] && xy.length > 1) {
				alert('This Planet is unique in the map. The last coordinate will be the final one.')
			}
			for (let j = 0; j < xy.length; j++) {
				new_cp = new CelestialPoint(t, false, xy[j][0], xy[j][1]);
				celestial_point_list.push(new_cp);
			}
		}
		return celestial_point_list;
	}

	/**
	 * find the coordinate of each location, use regular expression
	 * used for set location.
	 * @param str_location the string of location coordinate
	 * @returns {Array} [[x, y], [x1, y1], ....] if the str_location is empty, return [[]]
	 */
	function getCoordinate(str_location) {
		if (str_location === '') {
			return null;
		}
		let xy = str_location.match(/(\d+)/g);
		if (xy.length < 2) {
			throw new Error('The location coordinates are wrong.');
		}

		let final_coordinates = [];
		for (let i = 0; i <= xy.length/2; i += 2) {
			final_coordinates.push([parseInt(xy[i]), parseInt(xy[i+1])]);
		}

		return final_coordinates;
	}

	/**
	 * receive the index and get the value of text area
	 * helper function for getCelestialPointList()
	 * @param index
	 * @returns {number}
	 */
	function getCelestialType(index) {
		let e = document.getElementById('celestial_' + index + '_type');
		let x = e.value;
		return parseInt(x);
	}

	document.addEventListener('DOMContentLoaded', function() {
		/**
		 * Dynamic add html when check customize.
		 * When the add celestial button click, this function should be called. This will add a new celestial object area.
		 */
		document.getElementById('celestial_Container').innerHTML += createNewCelestialHtml();
		document.getElementById("add_celestial").addEventListener('click',function ()
		{
			let text = createNewCelestialHtml();
			document.getElementById('celestial_Container').innerHTML += text;
		});

		// delete a text area of adding celestial point.
		document.getElementById('customizeGame').addEventListener('click', function (e) {
			let n = e.target.id.split('_');
			if (n[0] === 'delete') {
				document.getElementById('celestial_' + n[1]).remove();
				num_celestial--;
			}
		});

		// when initial the game use game configuration mode
		document.getElementById('submit_ini').addEventListener('click', function () {
			// first, change the game size and reset the game.
			setGameSize();
			// set the values of credits, energy, supplies, sensor range, and location
			let xy = initialECSL();
			// set the celestial point.
			let newPointList = getCelestialPointList();
			// if user changed start location, change Eniac position
			if (xy !== null) {
				let Eniac = new CelestialPoint(TypeEnum['ENIAC'], true, xy[0][0], xy[0][1]);
				newPointList.push(Eniac);
			}
			cm.setCelestialPoint(newPointList);
			// set two behavior
			if (document.getElementById('dev_ini_never_dies').checked === true) {
				openNeverDies();
			}
			if (document.getElementById('dev_ini_fixed_wh').checked === true) {
				openFixedWormhole();
			}
			message = message0;
			that.render_map.init = true;
			update(false);
		});

        // change the fixed wormhole behavior
		document.getElementById('change_fixed').addEventListener('click', function () {
			openFixedWormhole();
		});

		// change the never dies mode
		document.getElementById('change_never').addEventListener('click', function () {
			openNeverDies();
		});

		// normal game configuration
		document.getElementById('change_ecsl').addEventListener('click', function () {
			setGameSize();
			changeEcsl();
			document.getElementById('all').checked = false;
			update();
		});

		// save to local storage
		document.getElementById('save_storage').addEventListener('click', function () {
			let name = document.getElementById('storage_name').value;
			let option = 
				'<option value="STORAGE_NAME">STORAGE_NAME</option>'.replace(/STORAGE_NAME/g, name);

			// don't duplicate names in save-list
			if (localStorage.getItem(name) === null) {
				document.getElementById('choose_storage').innerHTML += option;
			}
			save_state(name);
		});

		// load the game
		document.getElementById('load_storage').addEventListener('click', function () {
			let name = document.getElementById('choose_storage').value;
			load(name);
			update();
		});

		document.getElementById('delete_storage').addEventListener('click', function () {

			let choose_storage = document.getElementById('choose_storage');
			let name = choose_storage.value;
			
			// if there's something to remove:
			if (name != null) {
				localStorage.removeItem(name);
				let option = 
				'<option value="STORAGE_NAME">STORAGE_NAME</option>'.replace(/STORAGE_NAME/g, name);
				let choose = localStorage.getItem('__choose__');

				/* delete the option from localStorage: */
				// replace " with \" to math value in localStorage
				option = option.replace(/"/g, '\\"');
				choose = choose.replace(option, "");
				localStorage.setItem('__choose__', choose);

				/* update the pull-down menu: */
				// return \" to "
				choose = choose.replace(/\\"/g, '"');
				choose_storage.innerHTML = choose;
			}
		});

		// clear local storage, do not reset the game
		document.getElementById('clear_local_storage').addEventListener('click', function () {
			localStorage.clear();
			document.getElementById('choose_storage').innerHTML = '';
		})
	});

	// create new celestial text area in html file.
	// helper function for addEventListener.
	function createNewCelestialHtml() {
		num_celestial++;
		return celestial_obj_form.replace(/CELENUMBER/g, num_celestial);
	}

	// change the game size and initial the game
	function setGameSize () {
		let size;
		if (!isDEV) {
			alert('The game configuration is not open.');
			return ;
		}
		let s = document.getElementById('size');
		// check whether it is initial game.
		if (s.checked) {
			size = parseInt(prompt('new game size = '));
			s.checked = false;
		} else if (isINI) {
			size = parseInt(document.getElementById('dev_ini_size').value);
		} else {
			return;
		}

		// if the size is NaN, that is default mode and the size is 128.
		if (isNaN(size)) {
			size = 128;
		} else if (size < 9 || size > 255) {
			alert('Wrong Game Size');
			return ;
		}

		that.reset_game();
		that.initDisplay(size);
	}

	function changeEcsl() {
		if (!isDEV) {
			alert('The game configuration mode not open.');
			return ;
		}
		if (document.getElementById('e').checked){
			ship.setEnergy(parseInt(prompt('The new Energy is: ')));
			document.getElementById('e').checked = false;
		}
		if (document.getElementById('c').checked) {
			ship.setCredits(parseInt(prompt('The new Credits is: ')));
			document.getElementById('c').checked = false;
		}
		if (document.getElementById('s').checked) {
			ship.setSupplies(parseInt(prompt('The new supplies is: ')));
			document.getElementById('s').checked = false;
		}
		if (document.getElementById('l').checked) {
			let coords = getCoordinate(prompt('The new location is: \n Ex. 1, 2'));
			if (coords !== null) {
				ship.setLocation(cm, coords[0]);
			}
			document.getElementById('l').checked = false;
		}
		if (document.getElementById('sensor').checked){
			sensor.updateRange(parseInt(prompt('The new Range is: ')));
			document.getElementById('sensor').checked = false;
		}
	}

	function initialECSL() {
		if (!isDEV && !isINI) {
			alert('The game configuration mode for initial game is not open.');
			return;
		}

		ship.setEnergy(getIntValue('dev_energy'));
		ship.setCredits(getIntValue('dev_credits'));
		ship.setSupplies(getIntValue('dev_supplies'));
		let coords = getCoordinate(document.getElementById('dev_location').value);
		if (coords !== null) {
			ship.setLocation(cm, coords[0]);
		}
		sensor.updateRange(getIntValue('dev_sensor'));
		return coords; // to place eniac at start location
	}

	// helper function for get the int value in a text area.
	function getIntValue(id) {
		return parseInt(document.getElementById(id).value);
	}
}
