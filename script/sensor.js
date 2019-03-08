/**
 * Class Sensor:
 * As a player, I want to see what is located at nearby Celestial Points, so I know where things are.
 */
function Sensor(json) {
	if (json != null) {
		for (let key in json) this[key] = json[key];
	} else {
		// the range of the sensor, default is 2
		this.visible = 2;
	}

	/**
	 * Just wrapper function, call `deploy` to deploy the sensor.
	 */
	this.deploy_sensor = function(x, y, cm) {
		deploy(x, y, cm, this.visible);
	};

	/**
	 * update the range.
	 */
	this.updateRange = function(new_range) {
		if (isNaN(new_range || new_range < 0)) {
			alert('The range is wrong');
			return;
		}
		this.visible = new_range;
	};

	/**
	 * main function for deploy the sensor, should be called by wrapper function
	 *
	 * @param   {int}  x      x coord of current ship
	 * @param   {int}  y      y coord
	 * @param   {object}  cm     the object of map class
	 */
	function deploy(x, y, cm, visible) {
		for (let tx = x-visible; tx <= x+visible; tx++) {
			for (let ty = y-visible; ty <= y+visible; ty++) {
				if (cm.checkSize([tx, ty]) && Math.sqrt((tx-x)**2 + (ty-y)**2)<= visible) {
					cm.ChangeVisible(tx, ty);
				}
			}
		}
	}
}
