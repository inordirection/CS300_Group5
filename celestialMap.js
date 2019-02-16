class CelestialMap
{
     constructor(json, size = 128)
     {
          this.size = size;
          this.celestialPoints = this.InstantiateMap();

          //Needs to randomly set Artifacts and such.
         this.FillMapWithEncounters();
         this.FillMapWithPlanets();

          console.log("Map Constructed");
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
          for(var y = 0; y < this.size; y++)
          {
               for(var x = 0; x < this.size; x++)
               {
                    //If we are over writing then delete first.
                    if(this.celestialPoints[x][y] != null)
                         delete this.celestialPoints[x][y];

                    //If we are at the border, place a Wormhole.
                    /* This might not be necessary.
                    if(x == 0 || y == 0 || x == (this.size - 1) || y == (this.size - 1))
                    {
                         this.celestialPoints[x][y] = new CelestialPoint(TypeEnum.WORMHOLE, false, x, y);
                         continue;
                    }
                    */

                    //Get a random enocunter
                    var rand = Math.floor(Math.random() * 5);

                    this.celestialPoints[x][y] = new CelestialPoint(rand, false, x, y);
               }
          }
     }

     FillMapWithPlanets()
     {
          var planetCount = 10;
          var visible = false;

          for(var i = 0; i < planetCount; i++)
          {
               visible = false;
               if((i + 5) == 12 || (i + 5) == 13 || (i + 5) == 14)
                    visible = true;

               var c = new Coordinate(Math.floor(Math.random() * (this.size - 2)) + 1,
				   Math.floor(Math.random() * (this.size - 2)) + 1);

               delete this.celestialPoints[c.x][c.y];
               this.celestialPoints[c.x][c.y] = new CelestialPoint((i + 5), visible, c.x, c.y);
          }
     }

	GetPoint(xCoord, yCoord)
	{
          //console.log("Getting Point: (" + xCoord + ", " + yCoord + ")...");
		return this.celestialPoints[xCoord][yCoord];
     }

     GetPoint(coordinate)
     {
          //console.log("Getting Point: (" + xCoord + ", " + yCoord + ")...");
          return this.celestialPoints[coordinate.x][coordinate.y];
     }

     GetRandomPoint()
     {
          return this.celestialPoints[Math.floor(Math.random() * this.size)][Math.floor(Math.random() * this.size)];
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
