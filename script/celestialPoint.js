class CelestialPoint
{
     constructor(t = TypeEnum.EMPTY, visible = false, xCoord = 0, yCoord = 0)
     {
          this.type = t;
          this.coordinate = new Coordinate(xCoord, yCoord);
          this.isVisible = visible;

          //console.log(this.ToString());
     }

     Change_visible(new_visible) {
          this.isVisible  = new_visible;
     }

	// process the event at this location
	Run() {

     }

     ToString()
     {
          return "Celestial Point: Type: " + TypeEnum.properties[this.type].name + 
			 ", Visible: " + this.isVisible + ", Coordinate: " + this.coordinate.ToString();

     }
}

//May need to add to this enum later.
TypeEnum =
{
     //0 to 4 are encounters, 5 to 15 are planets.
	EMPTY: 0, ASTEROIDS: 1, METEORSTORM: 2, BADMAX: 3, WORMHOLE: 4, P_ONE: 5, P_TWO: 6, 
	P_THREE: 7, P_FOUR: 8, P_FIVE: 9, P_SIX: 10, P_SEVEN: 11, CELERON: 12, XEON: 13, 
	RYZEN: 14, ENIAC: 15,
     properties:
     {
          0: {name: "Empty Space"},
          1: {name: "Asteroids"},
          2: {name: "Meteor Storm"},
          3: {name: "Bad Max"},
          4: {name: "Wormhole"},
          5: {name: "Pentium 1"},
          6: {name: "Pentium 2"},
          7: {name: "Pentium 3"},
          8: {name: "Pentium 4"},
          9: {name: "Pentium 5"},
          10: {name: "Pentium 6"},
          11: {name: "Pentium 7"},
          12: {name: "Celeron"},
          13: {name: "Xeon"},
          14: {name: "Ryzen"},
		  15: {name: "Eniac"}
     }
};
