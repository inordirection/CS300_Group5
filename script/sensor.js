/**
 * Class Sensor:
 * As a player, I want to see what is located at nearby Celestial Points, so I know where things are.
 */
function Sensor(json) {
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
		sur = new Set();

		for (var a of angle) {
			for (var i = 1; i <= visible; i++) {
				var tx = Math.round(x + i*Math.cos(a * Math.PI/180));
				var ty = Math.round(y + i*Math.sin(a * Math.PI/180));
				if (cm.Check_size(tx, ty)) {
					// alert(tx + ',' + ty);
					sur.add([tx, ty])
					cm.ChangeVisible(tx, ty);
				}
			}
		}
		// alert('after deploy function in #49 sensor.js');
	}
}
