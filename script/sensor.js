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
		// Store the points that should be showed in this deployment.
		this.sur;
	}

	/**
	 * Just wrapper function, call `deploy` to deploy the sensor.
	 */
	this.deploy_sensor = function(x, y, cm) {
		this.sur = undefined;
		deploy(x, y, cm);
	};

	/**
	 * update the range.
	 */
	this.updateRange = function(new_range) {
		if (isNaN(new_range)) {
			return;
		}
		if (new_range < 0) {
			alert('The range is wrong');
			return ;
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
	function deploy(x, y, cm) {
		this.sur = new Set();

		for (let tx = x-this.visible; tx <= x+this.visible; tx++) {
			for (let ty = y-this.visible; ty <= y+this.visible; ty++) {
				if (cm.checkSize([tx, ty]) && Math.sqrt((tx-x)**2 + (ty-y)**2)<= this.visible) {
					// alert([tx, ty]);
					this.sur.add(new Coordinate(tx, ty));
					cm.ChangeVisible(tx, ty);
				}
			}
		}
	}
}
