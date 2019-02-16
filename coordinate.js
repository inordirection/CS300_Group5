class Coordinate
{
     constructor(xCoord = 0, yCoord = 0)
     {
          this.x = xCoord;
          this.y = yCoord;
     }

     ToString()
     {
          return "(" + this.x + ", " + this.y + ")";
     }

     static Distance(coord1, coord2)
     {
          var distX = Math.abs(coord1.x - coord2.x);
          var distY = Math.abs(coord1.y - coord2.y);
          return distX > distY ? distX : distY;
     }
}
