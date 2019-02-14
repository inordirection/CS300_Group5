/**
 * Class Sensor:
 * As a player, I want to see what is located at nearby Celestial Points, so I know where things are.
 */
function Sensor() {
	// Store the visible range of the sensor.
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

	this.dis_vi_an = function() {
		console.log(angle);
	}

	/**
	 * @param object get things in point (x, y)
	 */
	function deploy(x, y, cp) {
		sur = new Array(visible**2 -1);
		alert('use deploy function in sensor.js')
		// NOT COMPLETE MUST SEE MAP IMPLEMENT
		compute_range(x, y);
		alert(sur[0]);
		alert(sur.length);
		sur = undefined;
	}

	function compute_range(x, y) {
		for (var a in angle) {
			for (var i = 1; i <= visible; i++) {
				var x = Math.round(x + visible*Math.cos(a * Math.PI/180));
				var y = Math.round(y + visible*Math.sin(a * Math.PI/180));
				sur.push((x, y));
			}
		}
	}
}

module.exports = Sensor;