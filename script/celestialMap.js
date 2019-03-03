class CelestialMap
{
	constructor(json, size = 128)
	{
		if (json != null) {
			for (var key in json) {
				this[key] = json[key];
			}
			/**
			 * set of objects will not load correctly:
			 * save() called on a set of CP just writes to local storage
			 * {CelestialPoint, CelestialPoint, CelestialPoint...},
			 * which of course doesn't really preserve any data for load(), 
			 * thus we have to repopulate the visibleSet on every load.
			 *
			 * not a big problem, but maybe we can find a way to actually save it.
			 * */
			this['visibleSet'] = new Set();
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < this.size; j++) {
					var cp = this.celestialPoints[i][j]
					if (cp.isVisible) this.visibleSet.add(cp);
				}
			}
		}
		else { 
			this.size = size;
			this.celestialPoints = this.InstantiateMap();

			// set of visible space
			this.visibleSet = new Set(); 
			// set of planets
			this.planetsSet = new Set();

			//Needs to randomly set Artifacts and such.
			this.FillMapWithEncounters();
			this.FillMapWithPlanets();
		}
	}

	InstantiateMap()
	{
		var array = new Array(this.size);

		for(var i = 0; i < this.size; i++)
		{
			array[i] = new Array(this.size);
		}

		return array;
	}

	FillMapWithEncounters()
	{
		// 75% empty, 25% encounters?
		var space_probability = 0.75;
		for(var y = 0; y < this.size; y++)
		{
			for(var x = 0; x < this.size; x++)
			{
				//If we are over-writing then delete first.
				if(this.celestialPoints[x][y] != null)
					delete this.celestialPoints[x][y];
					//Get a random enocunter
				   var type = 0; // default to empty space
				   if (Math.random() > space_probability)
					   type = Math.round(Math.random() * 3) + 1; // type: 1-4

				this.celestialPoints[x][y] = new CelestialPoint(type, false, x, y);
			}
		}
	}

	FillMapWithPlanets()
	{
		var planets = 11;
		var encounters = 5;
		var visible;

		for(var i = encounters; i < encounters + planets-1; i++)
		{
			visible = false;
			if (i > TypeEnum['P_SEVEN']) // set special planets visible
				visible = true;
			
			var c; // check to make sure planets do not overwrite themselves
			do {
				c = new Coordinate(Math.round(Math.random() * (this.size-1)),
				Math.round(Math.random() * (this.size-1)));
			} while (this.celestialPoints[c.x][c.y].type > encounters);

			// clear anything that might already be in celestialPoints
			delete this.celestialPoints[c.x][c.y];

			var cPoint = new CelestialPoint(i, visible, c.x, c.y);
			this.celestialPoints[c.x][c.y] = cPoint;
			this.planetsSet.add(cPoint);
			if (visible) this.visibleSet.add(cPoint);
		}
		 // set 0,0 to contain Eniac
		 var eniac = new CelestialPoint(planets+encounters-1, true, 0,0);
		 this.celestialPoints[0][0] = eniac;
		 this.visibleSet.add(eniac);
     }

	GetPoint(xCoord, yCoord)
	{
	   //console.log("Getting Point: (" + xCoord + ", " + yCoord + ")...");
		return this.celestialPoints[xCoord][yCoord];
	}

	GetRandomPoint()
	{
		return this.celestialPoints[Math.floor(Math.random() * this.size)]
		 [Math.floor(Math.random() * this.size)];

     }

     /**
      * change this point x,y to visible
      *
      * @param   {int}  x  coordinate
      * @param   {int}  y  coord
      */
     ChangeVisible(x, y) {
          if (!this.checkSize([x,y])) {
               return ;
          }

          this.visibleSet.add(this.celestialPoints[x][y]);
          this.celestialPoints[x][y].isVisible = true;
	}

	/**
	 * Just for test, change all of the points to visible mode.
	 */
	visibleAll() {
     	for (let i = 0; i < this.size; i++) {
     		for (let j = 0; j < this.size; j++) {
				this.visibleSet.add(this.celestialPoints[i][j]);
			}
		}
	}
	
	/**
	 * set a list of celestial points to the map
	 * if the point only can occur one time, just replace the old one.
	 * if the new one is 12, 13, 14, change the visible setting.
	 *
	 * @param   {Array}  list  list of celestial points
	 */
	setCelestialPoint(list) {
		let current = undefined;
		for (let i = 0; i < list.length; i++) {
			current = list[i];

			// if the current is a planet, 5 - 14, what is 15???
			if (current.type <= 15 && current.type >= 5) {
				// find the same current point in the map and store in original
				let original = undefined;
				for (let e of this.planetsSet) {
					if (current.type === e.type) {
						original = e;
						break;
					}
				}

				// create a new point obj and its type is empty. and replace the original one.
				this.celestialPoints[original.coordinate.x][original.coordinate.y] = new CelestialPoint(0, false, original.coordinate.x, original.coordinate.y);
				// add this planet
				this.planetsSet.add(current);
				this.planetsSet.delete(original);

				// if is 12, 13, 14, 15 change visible.
            if (current.type >= 12 && current.type <= 15) {
					this.visibleSet.delete(original);
					this.visibleSet.add(current);
				}
				// console.log('finish pre-treatment for planet');
			}
			// directly add if the new point not planet.
			this.celestialPoints[current.coordinate.x][current.coordinate.y] = current;
			// console.log('add one is not planet.');
		}
	}

     /**
      * return whether the coordinate in the map
      *
      * @param   {Array}  xy  coord
      *
      * @return  {boolean}     whether the point in the map
      */
	 checkSize(xy) {
          return !(xy[0] < 0 || xy[1] < 0 || xy[0] > this.size - 1 || xy[1] > this.size - 1 || isNaN(xy[0]) || isNaN(xy[1]));
     }

     GetSize() {
          return this.size;
     }

     ToString()
     {
          var temp;
          for(var y = 0; y < this.size; y++)
          {
               for(var x = 0; x < this.size; x++)
               {
                    temp += this.celestialPoints[x][y].ToString();
               }
          }
          return temp;
     }
}