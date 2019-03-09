class CelestialPoint
{
	constructor(t = TypeEnum.EMPTY, visible = false, xCoord = 0, yCoord = 0)
	{
		this.type = t;
		this.coordinate = new Coordinate(xCoord, yCoord);
		this.isVisible = visible;

		//console.log(this.ToString());
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
	EMPTY: 0, ASTEROID: 1, METEORSTORM: 2, BADMAX: 3, WORMHOLE: 4, P_ONE: 5, P_TWO: 6, 
	P_THREE: 7, P_FOUR: 8, P_FIVE: 9, P_SIX: 10, P_SEVEN: 11, CELERON: 12, XEON: 13, 
	RYZEN: 14, ENIAC: 15,
	properties:
	{
		0: {name: "Empty Space", ch: '0'},
		1: {name: "Asteroid", ch: 'A'},
		2: {name: "Meteor Storm", ch: 'M'},
		3: {name: "Bad Max", ch: 'B'},
		4: {name: "Wormhole", ch: 'W'},
		5: {name: "Pentium 1", ch: '1'},
		6: {name: "Pentium 2", ch: '2'},
		7: {name: "Pentium 3", ch: '3'},
		8: {name: "Pentium 4", ch: '4'},
		9: {name: "Pentium 5", ch: '5'},
		10: {name: "Pentium 6", ch: '6'},
		11: {name: "Pentium 7", ch: '7'},
		12: {name: "Celeron", ch: 'C'},
		13: {name: "Xeon", ch: 'X'},
		14: {name: "Ryzen", ch: 'R'},
		15: {name: "Eniac", ch: 'E'}
	}
};
