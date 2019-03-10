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
	// Keep structure == Empty Space, Encounters, Pentiums, specials with Eniac last
	EMPTY: 0, ASTEROID: 1, METEORSTORM: 2, BADMAX: 3, FREIGHTER: 4, STATION: 5, 
	WORMHOLE: 6, P_ONE: 7, P_TWO: 8, P_THREE: 9, P_FOUR: 10, P_FIVE: 11, P_SIX: 12, 
	P_SEVEN: 13, CELERON: 14, XEON: 15, RYZEN: 16, ENIAC: 17,
	properties:
	{
		0: {name: "Empty Space", ch: '0'},
		1: {name: "Asteroid", ch: 'A'},
		2: {name: "Meteor Storm", ch: 'M'},
		3: {name: "Bad Max", ch: 'B'},
		4: {name: "Abandoned Freighter", ch: 'F'},
		5: {name: "Space Station", ch: '$'}, 
		6: {name: "Wormhole", ch: 'W'},
		7: {name: "Pentium 1", ch: '1'},
		8: {name: "Pentium 2", ch: '2'},
		9: {name: "Pentium 3", ch: '3'},
		10: {name: "Pentium 4", ch: '4'},
		11: {name: "Pentium 5", ch: '5'},
		12: {name: "Pentium 6", ch: '6'},
		13: {name: "Pentium 7", ch: '7'},
		14: {name: "Celeron", ch: 'C'},
		15: {name: "Xeon", ch: 'X'},
		16: {name: "Ryzen", ch: 'R'},
		17: {name: "Eniac", ch: 'E'}
	}
};
