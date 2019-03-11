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
	EMPTY: 0, ASTEROID: 1, METEORSTORM: 2, FREIGHTER: 3, STATION: 4, 
	WORMHOLE: 5, P_ONE: 6, P_TWO: 7, P_THREE: 8, P_FOUR: 9, P_FIVE: 10, P_SIX: 11, 
	P_SEVEN: 12, CELERON: 13, XEON: 14, RYZEN: 15, ENIAC: 16,
	properties:
	{
		0: {name: "Empty Space", ch: '0'},
		1: {name: "Asteroid", ch: 'A'},
		2: {name: "Meteor Storm", ch: 'M'},
		3: {name: "Abandoned Freighter", ch: 'F'},
		4: {name: "Space Station", ch: '$'}, 
		5: {name: "Wormhole", ch: 'W'},
		6: {name: "Pentium 1", ch: '1'},
		7: {name: "Pentium 2", ch: '2'},
		8: {name: "Pentium 3", ch: '3'},
		9: {name: "Pentium 4", ch: '4'},
		10: {name: "Pentium 5", ch: '5'},
		11: {name: "Pentium 6", ch: '6'},
		12: {name: "Pentium 7", ch: '7'},
		13: {name: "Celeron", ch: 'C'},
		14: {name: "Xeon", ch: 'X'},
		15: {name: "Ryzen", ch: 'R'},
		16: {name: "Eniac", ch: 'E'}
	}
};
