/**
 * Class Sensor:
 * As a player, I want to see what is located at nearby Celestial Points, so I know where things are.
 */
function Sensor(json) {
	// Store the points that should be showed in this deployment.
	var sur;
	// Store nine angles
	var angle = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

	/**
	 * Just wrapper function, call `deploy` to deploy the sensor.
	 */
	this.deploy_sensor = function(x, y, cp, range) {
		deploy(x, y, cp, range);
	}

	/**
	 * @param object get things in point (x, y)
	 */
	function deploy(x, y, cp, range) {
		sur = new Array();
		// NOT COMPLETE MUST SEE MAP IMPLEMENT
		compute_range(x, y, range);
		sur = undefined;
	}

	function compute_range(x, y, range) {
		for (var a in angle) {
			for (var i = 1; i <= range; i++) {
				var tx = Math.round(x + i*Math.cos(a * Math.PI/180));
				var ty = Math.round(y + i*Math.sin(a * Math.PI/180));
				sur.push([tx, ty]);
			}
		}
	}
}
