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
				if (cm.Check_size(tx, ty) && Math.sqrt(Math.abs((tx-x)**2) + Math.abs((ty-y)**2))<= visible) {
					// alert([tx, ty]);
					sur.add(new Coordinate(tx, ty));
					cm.ChangeVisible(tx, ty);
				}
			}
		}
		alert(sur.size);

		// console.log("sensor 1:");
		// for (i = 0; i < sur.length; i++)
			// console.log(sur[i]);

		// sur = new Array();
		// var r = visible;
		// // grab all coords within a square around x and y
		// for (scanX = x-r; scanX <= x+r; scanX++) {
		// 	for (scanY = y+r; scanY >= y-r; scanY--) {
		// 		if (cm.Check_size(scanX, scanY))
		// 			sur.push(new Coordinate(scanX, scanY));
		// 	}
		// }
		// // reduce set to just points within circle
		// sur = sur.filter(coord => Math.pow(x-coord.x,2) + Math.pow(y-coord.y,2) <= r*r);
		// console.log("sensor 2:");
		// for (i = 0; i < sur.length; i++) {
		// 	// add to visisble
		// 	// console.log(sur[i]);
		// 	cm.ChangeVisible(sur[i].x, sur[i].y);
		// 	// alert([sur[i].x, sur[i].y]);
		// }
		// alert(sur.length);
		// for (var j = 0; i < sur.length; j ++) {
		// 	alert(sur[j]);
		// }
	}
}