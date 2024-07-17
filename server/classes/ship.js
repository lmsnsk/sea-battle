const Orientation = {
  HORIZONTAL: '0',
  VERTICAL: '1',
}

class Ship {
  constructor (size) {
    this.size = size
    this.coordinates = []
    this.orientation = ''
    this.isSunk = false
  }
}

module.exports = {
  Ship, Orientation,
}