class Game {
     constructor()
     {
     	this.celestialMap = new CelestialMap(16);
          this.ship = new Ship(this);
          this.over = false;
          this.message = "Welcome to SpaceHunt!";

          this.Update();

          console.log("Game Constructed");
     }

	/* Methods: */
	Turn()
	{
          //Take our turn!
          var angle = document.forms['movement']['angle'].value;
          var dist = document.forms['movement']['distance'].value;

          if (isNaN(dist) || dist < 1) {
               alert("You must enter a distance of at least 1.");
          }
          else {
               this.ship.Move(angle, dist);
               //Compare coordinates with map to see if we collide.
               update();
          }
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

     Update() {
          // If game over, don't allow user to keep playing
          if (this.IsOver()) {
               alert("You lost the game. Click \'Play Again?\' to continue.");
               return;
          }

          // if game is not over, update the user display
          this.UpdateTextFields();
          this.Save(); // and save the state to local storage
     }

     UpdateTextFields()
     {
          this.WriteLocation();
          this.WriteEnergy();
          this.WriteSupplies();
          this.WriteMessage();
          this.WriteCollisions();
          this.WriteMap();
     }

     WriteLocation() {
          coords = this.ship.coordinate.ToString();
          document.getElementById('location').value = coords;
     }

     WriteEnergy() {
          document.getElementById('energy').value = this.ship.energy;

          if (this.ship.energy < 1) {
               this.message += "You ran out of energy.\n";
               this.message += "Try again next time.";
               GameOver();
          }
     }

     WriteSupplies() {
          document.getElementById('supplies').value = this.ship.supplies;

          if (this.ship.supplies < 1) {
               this.message += "You ran out of supplies.\n"
               this.message += "Try again next time.";
               GameOver();
          }
     }

     WriteMessage() {
          document.getElementById('message').value = this.message;
          this.message = "";
     }

     WriteCollisions() { // TODO: US-5

     }

     WriteMap() { // TODO: US-7

     }

	Save()
	{
		//Save the game locally.
	}

     IsOver()
     {
          return this.over;
     }

     /* sets the game status to over */
     GameOver() {
          this.over = true;

          // clear localStorage

          // write 'play again?' button to document
          var display = document.forms['display'];

          var e = document.createElement("input");
          e.setAttribute('type',"submit");
          e.setAttribute('value',"Play Again?");
          e.setAttribute('onSubmit',"game.initDisplay()");

          display.appendChild(e);
     }

     ToString()
     {
          celestialMap.ToString();
     }
}
