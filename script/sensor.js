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
	this.deploy_sensor = function(x, y, cp) {
		deploy(x, y, cp);
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
	 * @param   {object}  cp     the object of map class
	 */
	function deploy(x, y, cp) {
		sur = undefined;
		sur = new Array();

		for (var a in angle) {
			for (var i = 1; i <= visible; i++) {
				var tx = Math.round(x + i*Math.cos(a * Math.PI/180));
				var ty = Math.round(y + i*Math.sin(a * Math.PI/180));
				if (tx < 128 && ty < 128) {
					sur.push([tx, ty])
					cp.ChangeVisible(tx, ty);
				}
			}
		}
	}

}
