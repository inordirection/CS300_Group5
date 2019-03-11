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
			this.BadMaxChance = 0.05;
			this.celestialPoints = this.InstantiateMap();

			// set of visible space
			this.visibleSet = new Set(); 
			// set of planets
			this.planetsSet = new Set();

			//Needs to randomly set Artifacts and such.
			this.FillMapWithEncounters();
			this.FillMapWithPlanets();
		}
		//this.visibleAll();
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
		// number of (non-empty space) encounters
		var NUM = TypeEnum['P_ONE'] - 1;
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
					   type = Math.round(Math.random() * (NUM-1)) + 1; // type: [1-NUM]

				this.celestialPoints[x][y] = new CelestialPoint(type, false, x, y);
			}
		}
	}

	FillMapWithPlanets()
	{
		var planets = TypeEnum['ENIAC'] - TypeEnum['P_ONE'] + 1;
		var encounters = TypeEnum['P_ONE'];
		var visible;

		// add planets to random coords (besides Eniac, which must be 0,0)
		for(var i = encounters; i < encounters + planets-1; i++)
		{
			visible = false;
			if (i > TypeEnum['P_SEVEN']) // set special planets visible
				visible = true;
			
			var c; // check to make sure planets do not overwrite themselves
			do {
				c = new Coordinate(Math.round(Math.random() * (this.size-1)),
				Math.round(Math.random() * (this.size-1)));
			} while (this.celestialPoints[c.x][c.y].type >= encounters);

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
		this.planetsSet.add(eniac);
		this.visibleSet.add(eniac);
     }

	GetPoint(xCoord, yCoord)
	{
	   //console.log("Getting Point: (" + xCoord + ", " + yCoord + ")...");
		return this.celestialPoints[xCoord][yCoord];
	}

	GetType(xCoord, yCoord) {
		return this.GetPoint(xCoord, yCoord).type;
	}

	GetRandomPoint()
	{
		return this.celestialPoints[Math.floor(Math.random() * this.size)]
		 [Math.floor(Math.random() * this.size)];

     }

	/**
	 * reset a coordinate to empty space
	 * */
	ClearPoint(x, y) {
		this.celestialPoints[x][y].type = TypeEnum['EMPTY'];
	}

	/***
	 * Back-end processing for collisions with Celestial Artifacts
	 * 	returns: array with message, wormhole flag, gameover flag
	 * 	*/
	RunPoint(ship, orbit, landed) {
		let msg = ""
		let wormed = false;
		let over = false;

		let cpType = this.celestialPoints[ship.x][ship.y].type;
		let name = TypeEnum.properties[cpType].name;

		//BadMax randomly attacks when in empty space
		if (cpType == TypeEnum['EMPTY'] && Math.random() <= this.BadMaxChance) {
			let chance = Math.random();
			msg += "You've encountered BadMax's henchmen!\n";
			if (chance <= 0.5) {
				msg += "Luckily, you fought them off.\n";
			}
			else if (chance <= 0.8) {
				msg += "They raided your ship of credits and supplies!\n";
				ship.credits = 0;
				ship.supplies /= 2;
				if (ship.supplies < 1) over = true;
			}
			else {
				msg += "THEY DESTROYED YOUR SHIP!\n"
				over = true;
			}
		}
		// if encountering a planet:
		else if (cpType >= TypeEnum['P_ONE']) {
			if (!orbit && !landed) {
				msg += "You've arrived at planet ";
			}
			else if (landed) {
				msg += "You're docked at planet ";
			}	
			else if (orbit) {
				msg += "You're orbiting planet ";
			}
			msg += TypeEnum['properties'][cpType].name + ".\n";
		}
		// if we hit a wormhole, warp
		else if (cpType == TypeEnum['WORMHOLE']) {
			ship.move(0, this.GetSize(), this);
			ship.energy += this.GetSize() * ship.engine;
			msg += "You passed through a wormhole!\n";
			wormed = true;
		}	
		// if we are at a space station:
		else if (cpType == TypeEnum['STATION']) {
			if (!landed) {
				msg += "You've come across a space station\n";
				msg += "Land at the station casino for 10 credits?\n";
			}
			else {
				msg += "A Casinian has challenged you to a game of chance.\n";
			}
		}
		// else, process random, one-time encounter
		else {
			let chance = Math.random();
			// MeteorStorm
			if (cpType == TypeEnum['METEORSTORM']) {
				msg += "You ran into a Meteor Storm!\n";
				msg += "Your ship was damaged.\n";
				ship.damageEngine(5);
			}
			// Asteroid
			else if (cpType == TypeEnum['ASTEROID']) {
				msg += "You hit an Asteroid!\n"
				if (chance <= 0.9) {
					msg += "Your ship was damaged.\n"
					ship.damageEngine(5);
				}
				else {
					msg += "YOUR SHIP WAS DESTROYED!\n"
					over = true;
				}
			}
			// Abandoned Freighter
			else if (cpType == TypeEnum['FREIGHTER']) {
				msg += "You encountered an Abandoned Freighter!\n"
				msg += "You've replenished your supplies and energy.\n"
				ship.setSupplies(100);
				ship.setEnergy(1000);
			}
			// remove encounter from map
			this.ClearPoint(ship.x, ship.y);
		}
		return [msg, wormed, over];
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
	 * if the new one is a special planet change the visible setting.
	 *
	 * @param   {Array}  list  list of celestial points
	 */
	setCelestialPoint(list) {
		let planets = TypeEnum['P_ONE'];
		let specials = TypeEnum['CELERON'];
		let end = TypeEnum['ENIAC'];
		let current = undefined;
		for (let i = 0; i < list.length; i++) {
			current = list[i];

			// if inserting a planet
			if (current.type <= end && current.type >= planets) {
				// find the same current point in the map and store in original
				let original = undefined;
				for (let e of this.planetsSet) {
					if (current.type === e.type) {
						original = e;
						break;
					}
				}

				// create a new point obj and its type is empty. and replace the original one.
				this.celestialPoints[original.coordinate.x][original.coordinate.y] 
					= new CelestialPoint(0, false, original.coordinate.x, original.coordinate.y);
				// add this planet
				this.planetsSet.add(current);
				this.planetsSet.delete(original);

				// if is a special planet, change visible.
				if (current.type >= specials && current.type <= end) {
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
