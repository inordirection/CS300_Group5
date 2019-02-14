/**
 * Class Sensor:
 * As a player, I want to see what is located at nearby Celestial Points, so I know where things are.
 */
function Sensor() {
	// Store the visible range of the sensor.
	var visible = 2;
	// Store the points that should be showed in this deployment.
	var sur = [];
	// Store nine angles
	var angle;

	/**
	 * Just wrapper function, call `deploy` to deploy the sensor.
	 */
	this.deploy_sensor = function(cp) {
		deploy(cp);
	}

	/**
	 * @param object get things in point (x, y)
	 */
	function deploy(cp) {
		sur = new Array(visible**2 -1);
		// NOT COMPLETE
	}

	function compute_range(x, y, angle, visible) {
		//NOT COMPLETE
		var x = Math.round(x + visible*Math.cos(angle * Math.PI/180));
		var y = Math.round(y + visible*Math.sin(angle * Math.PI/180));
		return (x, y);
	}
}

Object.defineProperties(Sensor, {
	angle: {
		value: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
		writable: false
	}
})