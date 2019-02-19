/**
 * Class Sensor:
 * As a player, I want to see what is located at nearby Celestial Points, so I know where things are.
 */
function Sensor() {
	// the range of the sensor, default is 2
	var visible = 2;
	// Store the points that should be showed in this deployment.
	var sur;

	/**
	 * Just wrapper function, call `deploy` to deploy the sensor.
	 */
	this.deploy_sensor = function(x, y, cm) {
		sur = undefined;
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
		sur = new Set();

		for (var tx = x-visible; tx <= x+visible; tx++) {
			for (var ty = y-visible; ty <= y+visible; ty++) {
				if (cm.Check_size(tx, ty) && Math.sqrt((tx-x)**2 + (ty-y)**2)<= visible) {
					// alert([tx, ty]);
					sur.add(new Coordinate(tx, ty));
					cm.ChangeVisible(tx, ty);
				}
			}
		}
	}
}
