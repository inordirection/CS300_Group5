class Game {
     constructor()
     {
     	//this.ship = new Ship();
     	this.celestialMap = new CelestialMap(16);

		//May not need to keep track of if we are playing.
     	this.isPlaying = true;

          console.log("Game Constructed");
     }

	/* Methods: */
	Turn(angle, dist)
	{
		//ship.Move(angle, dist);

		//Check if CP at ship coord is on anything other than an empty tile.

		//Check if we can see anything with our sensors.

		//ship.UseResources(dist)
	}

     RenderMap()
     {

          /*
          var e = document.body;

          for(var y = 0; y < this.celestialMap.size; y++)
          {
               var row = document.createElement("div");
               row.className = "row";
               //row.style.backgroundColor = "red";
               //row.style.width = (this.celestialMap.size) + "px";

               for(var x = 0; x < this.celestialMap.size; x++)
               {
                    var cell = document.createElement("div");
                    cell.className = "gridSquare";
                    //cell.innerText = (y * this.celestialMap.size) + x;

                    //console.log(this.celestialMap.GetPoint(x, y).ToString());
                    if(this.celestialMap.GetPoint(x, y).type == 4)
                    {
                         //console.log("WORMHOLE");
                         cell.style.backgroundColor = "red";

                         cell.style.backgroundImage = "url('Wormhole1.png')";
                    }
                    else
                         cell.style.backgroundImage = "url('Asteroid1.png')";
                    //cell.style.repeat
                    cell.style.backgroundColor = "black";
                    //cell.style.margin = "0px";
                    //cell.style.padding = "0px";
                    cell.style.height = "16px";
                    //cell.style.width = "16px";
                    row.appendChild(cell);
               }
               e.appendChild(row);
          }
          //document.getElementById("spawn").innerText = e.innerHTML;
          */
     }

	Save()
	{
		//Save the game locally.
	}

     ToString()
     {
          celestialMap.ToString();
     }
}
