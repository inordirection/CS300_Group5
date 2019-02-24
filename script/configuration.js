function Configuration () {
	// whether the dev mode open
	var isDEV = false;

	// whether the player never dies
	var isNEVERDIES = false;

	// whether use fixed wormhole
	var isFIXEDWH = false;

	// whether use selecting initial values
	var isINI = false;
		
	// This is the form of celestial object in html
	var celestial_obj_form = '<div id="celestial_CELENUMBER">' + '<select id="celestial_CELENUMBER_type" name="celestial_CELENUMBER_type">' + 
	'	<option value="A">Asteroids</option>' + 
	'	<option value="M">Metor Storm</option>' + 
	'	<option value="W">Wormhole</option>' + 
	'	<option value="CELENUMBER">Pentium CELENUMBER</option>' + 
	'	<option value="2">Pentium 2</option>' + 
	'	<option value="3">Pentium 3</option>' + 
	'	<option value="4">Pentium 4</option>' + 
	'	<option value="5">Pentium 5</option>' + 
	'	<option value="6">Pentium 6</option>' + 
	'	<option value="7">Pentium 7</option>' + 
	'	<option value="C">Celeron</option>' + 
	'	<option value="X">Xeon</option>' + 
	'	<option value="R">Ryzen</option>' + 
	'	<option value="E">Eniac</option>' + 
	'</select>' + 
	'<input type="text" id="celestial_CELENUMBER_coor" name="celestial_CELENUMBER_coor" placeholder="x,y" />' + 
	'<a class="delete_celestial" id="celestial_CELENUMBER_delete"></a>' + 
	'<br />' + 
	'</div>';
	
	// The number of celestial
	var num_celestial = 1;

	// List of celestial points
	var celestial_point_list = undefined;

	// return whether the dev mode is open.
	this.DEV_whether = function (t) {
		if (t == 'dev') {
			return isDEV;
		} else if (t == 'dies') {
			return isNEVERDIES;
		} else if (t == 'fix') {
			return isFIXEDWH;
		}
	}

	this.DEV_open = function () {
		isDEV = !isDEV;
		document.getElementById('whether_open').innerHTML = "Using game configuration: " + isDEV;
	}

	this.DEV_selected_ini_open = function() {
		if (!isDEV) {
			alert('The game configuration is not open.');
			return ;
		}
		isINI = !isINI;
		document.getElementById('whether_open_ini').innerHTML = "Use selected values to initial games: " + isINI + '.';
	}

	this.DEV_set_cesl = function (ship, cm) {
		change_ecsl(ship, cm);
	}

	// change to never dies or not
	this.DEV_never = function() {
		if (!isDEV) {
			alert('developer mode is close');
			return ;
		}
		// isNEVERDIES = (isNEVERDIES == true) ? false : true;
		isNEVERDIES = !isNEVERDIES;
		document.getElementById('whether_never').innerHTML = "Use never dies mode is " + isNEVERDIES;
	}

	// change to fixed wormhole or not
	this.DEV_fixed_wh = function(ship) {
		if (!isDEV) {
			alert('developer mode is close');
			return ;
		}

		isFIXEDWH = !isFIXEDWH;
		ship.isFIXEDWH = !ship.isFIXEDWH;
		document.getElementById('whether_fixed').innerHTML = 
			"Use the fixed wormhole mode is " + ship.isFIXW;
	}

	// change the game size and initial the game
	this.DEV_set_size = function(game, ini) {
		if (!isDEV) {
			alert('The game configuratioin is not open.');
			return ;
		} else if (!document.getElementById('ecsl').size.checked && !ini) {
			return ;
		}
		change_size(game);
	}

	/**
	 * initial game by selected values
	 */
	this.DEV_selected_initial = function (ship, cm) {
		alert('before create list in con.js');
		create_new_celestial_point();
		alert('after create new point');
		alert(celestial_point_list);
		cm.SetCelestialPoint(celestial_point_list);
	}

	/**
	 * When the add celestial button click, this function should be called. This will add a new celestial object area.
	 * Avoid to use game.js
	 */
	document.addEventListener('DOMContentLoaded', function() {
		document.getElementById("add_celestial").addEventListener('click',function ()
		{
		 var text = create_new_celestial_html();
		document.getElementById('celestial_Container').innerHTML += text;
		});
	});

	// change game size and reset the game
	function change_size(game) {
		/* moved to game- cannot change size of map without re-initializing,
		 * or the gameplay will not be valid (you will hit array out of bounds if
		 * increasing size, you will not have all planets in game if decreasing) */
		var size = parseInt(prompt('new game size = '));
		// need at least 4, or else won't be able to load all planets
		if (size < 9 || size > 255) {
			alert('Minimum size 9, maximum 255');
			return ;
		}
		game.reset_game();
		game.initDisplay(size);
		document.getElementById('ecsl').size.checked = false;
	}

	// create new celestial text area in html file.
	function create_new_celestial_html() {
		num_celestial++;
		return celestial_obj_form.replace(/CELENUMBER/g, num_celestial);
	}

	// obtain the selected value of selection
	function get_selected_value(index) {
		var e = document.getElementById('celestial_' + index + '_type');
		var x = e.options[e.selectedIndex].value;
		return parseInt(x);
	}

	// using regular expression to get coordinate.
	function get_coordinate(index) {
		var text = document.getElementById('celestial_' + index + '_coor').value;
		var coor_list = text.match(/([0-9]+)/g);
		if (coor_list.length != 2) {
			return ;
		} else {
			return coor_list;
		}
	}

	/**
	 * create a list of celestial objects that should be added to the new game.
	 * @returns Array list of celestialPoint objects
	 */
	function create_new_celestial_point() {
		celestial_point_list = new Array();
		var t, xy, new_cp;
		for (var i = 1; i <= num_celestial; i++) {
			t = get_selected_value(i);
			xy = get_coordinate(i);
			new_cp = new CelestialPoint(t, false, xy[0], xy[1]);
			celestial_point_list.push(new_cp);
		}
	}

	function change_ecsl(ship, cm) {
		if (!isDEV) {
			alert('The game configuration mode not open.');
			return ;
		}
		if (document.getElementById('ecsl').e.checked){
			ship.set_energy();
			document.getElementById('ecsl').e.checked = false;
		}
		if (document.getElementById('ecsl').c.checked) {
			ship.set_credits();
			document.getElementById('ecsl').c.checked = false;
		}
		if (document.getElementById('ecsl').s.checked) {
			ship.set_supplies();
			document.getElementById('ecsl').s.checked = false;
		}
		if (document.getElementById('ecsl').l.checked) {
			ship.set_location(cm);
			document.getElementById('ecsl').l.checked = false;
		}
		if (document.getElementById('ecsl').sensor.checked){
			ship.set_range(sensor);
			document.getElementById('ecsl').sensor.checked = false;
		}
	}
}