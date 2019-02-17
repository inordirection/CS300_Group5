/**
 * Class Sensor:
 * As a player, I want to see what is located at nearby Celestial Points, so I know where things are.
 */
function Sensor() {
	// the range of the sensor, default is 2
	var visible = 2;
	// Store the points that should be showed in this deployment.
	var sur;
	// Store nine angles
	var angle = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

	/**
	 * Just wrapper function, call `deploy` to deploy the sensor.
	 */
	this.deploy_sensor = function(x, y, cm) {
		deploy(x, y, cm);
	}

	/**
	 * update the range.
	 */
	this.Update_range = function(new_range) {
		visible = new_range;
	}

	/**
	 * main function for deploy the sensor, should be called by wrapper function
	 *
	 * @param   {int}  x      x coord of current ship
	 * @param   {int}  y      y coord
	 * @param   {object}  cm     the object of map class
	 */
	function deploy(x, y, cm) {
		sur = undefined;
		sur = new Array();

		for (var a of angle) {
			for (var i = 1; i <= visible; i++) {
				var tx = Math.round(x + i*Math.cos(a * Math.PI/180));
				var ty = Math.round(y + i*Math.sin(a * Math.PI/180));
				if (tx < 128 && ty < 128 && tx >=0 && ty >=0) {
					// alert(tx + ',' + ty);
					sur.push([tx, ty])
					cm.ChangeVisible(tx, ty);
				}
			}
		}
		/* Testing deploy function
		console.log("sensor 1:");
		for (i = 0; i < sur.length; i++)
			console.log(sur[i]);

		sur = new Array();
		var r = visible;
		// grab all coords within a square around x and y
		for (scanX = x-r; scanX <= x+r; scanX++) {
			for (scanY = y+r; scanY >= y-r; scanY--) {
				sur.push(new Coordinate(scanX, scanY));
			}
		}
		// reduce set to just points within circle
		sur = sur.filter(coord => Math.pow(x-coord.x,2) + Math.pow(y-coord.y,2) <= r*r);
		console.log("sensor 2:");
		for (i = 0; i < sur.length; i++) {
			// add to visisble
			console.log(sur[i]);
			cp.ChangeVisible(sur[i].x, sur[i].y);
		}*/
	}
}
