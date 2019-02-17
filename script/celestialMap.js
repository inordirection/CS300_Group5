class CelestialMap
{
     constructor(json, size = 128)
     {
		this.size = size;
		this.celestialPoints = this.InstantiateMap();
		this.visibleList = new Array(); /* maybe keep a list of just what has been seen so 
		 we don't have to render all 16k tiles every time, just visible ones */

		//Needs to randomly set Artifacts and such.
		this.FillMapWithEncounters();
		this.FillMapWithPlanets();

		 //console.log("Map Constructed");
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
          //TODO: Maybe we should increase the probability of getting empty space.
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
         var planets = 10;
		 var encounters = 5;
		 var specialsStart = 12;
         var visible;

          for(var i = encounters; i < encounters + planets; i++)
          {
               visible = false;
               if(i >= specialsStart) // set special planets visible
                    visible = true;

               var c = new Coordinate(Math.round(Math.random() * (this.size-1)),
				   Math.round(Math.random() * (this.size-1)));

			  // clear anything that might already be in celestialPoints
               delete this.celestialPoints[c.x][c.y];

			  var cPoint = new CelestialPoint(i, visible, c.x, c.y);
               this.celestialPoints[c.x][c.y] = cPoint;
			  if (visible) this.visibleList.push(cPoint);
          }
		 // set 0,0 to contain Eniac
		 var eniac = new CelestialPoint(planets+encounters, true, 0,0);
		 this.celestialPoints[0][0] = eniac;
		 this.visibleList.push(eniac);
     }

	GetPoint(xCoord, yCoord)
	{
        //console.log("Getting Point: (" + xCoord + ", " + yCoord + ")...");
		return this.celestialPoints[xCoord][yCoord];
     }

	/* no function overloading in JS
     GetPoint(coordinate)
     {
          //console.log("Getting Point: (" + xCoord + ", " + yCoord + ")...");
          return this.celestialPoints[coordinate.x][coordinate.y];
     }
	 */

     GetRandomPoint()
     {
          return this.celestialPoints[Math.floor(Math.random() * this.size)]
		 [Math.floor(Math.random() * this.size)];
     }

     ChangeVisible(x, y) {
          if (x >= this.size || y >= this.size) {
               return ;
          }

          this.visibleList.push(this.celestialPoints[x][y]);
          this.celestialPoints[x][y].Change_visible(true);
     }

     ToString()
     {
          temp;
          for(y = 0; y < this.size; y++)
          {
               for(x = 0; x < this.size; x++)
               {
                    temp += celestialPoints[x][y].ToString();
               }
          }
          return temp;
     }
}
