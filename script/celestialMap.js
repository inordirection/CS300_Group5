class CelestialMap
{
	constructor(json, size = 128)
	{
		if (json != null) {
			for (var key in json) {
				this[key] = json[key];
				console.log(json[key]);
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

			this.visibleSet = new Set(); 

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
          if (!this.Check_size(x, y)) {
               return ;
          }

          this.visibleSet.add(this.celestialPoints[x][y]);
          this.celestialPoints[x][y].Change_visible(true);
     }

     /**
      * return whether the coordinate in the map
      *
      * @param   {int}  x  coord
      * @param   {int}  y  coord
      *
      * @return  {bool}     whether the point in the map
      */
     Check_size(x, y) {
          if (x < 0 || y < 0 || x > this.size-1 || y > this.size-1 || x == NaN || y == NaN) {
               return false;
          } else {
               return true;
          }
     }

     /**
	 * FOR DEV MODE
	 * set new game size.
	 */
	DEV_set_size() {
		var size = parseInt(prompt('new game size = '));
		if (size < 1 || size > 128) {
			alert('The new size is wrong.');
			return ;
		}
		this.size = size;
		//alert(this.size);
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
