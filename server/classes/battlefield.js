const { Orientation } = require("./ship");

const CellState = {
  EMPTY: "0",
  SHIP: "1",
  HIT: "2",
  MISS: "3",
};

class Battlefield {
  constructor(size) {
    this.size = size;
    this.field = this.createField(size);
    this.ships = [];
  }

  createField(size) {
    const field = [];
    for (let i = 0; i < size; i++) {
      field.push(Array(size).fill(CellState.EMPTY));
    }
    return field;
  }

  placeShips(ships) {
    for (let ship of ships) {
      this.ships.push(ship);
      for (let coord of ship.coordinates) {
        let [row, col] = coord;

        if (this.isWithinBounds(row, col)) {
          this.field[row][col] = CellState.SHIP;
        } else {
          throw new Error(`Ship placement out of bounds: ${row}, ${col}`);
        }
      }
    }
  }

  isWithinBounds(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  randomPlaceShips(ships) {
    for (let ship of ships) {
      let placed = false;
      while (!placed) {
        let row = Math.floor(Math.random() * this.size);
        let col = Math.floor(Math.random() * this.size);
        let orientation =
          Math.random() < 0.5 ? Orientation.HORIZONTAL : Orientation.VERTICAL;

        if (this.canPlaceShip(ship, row, col, orientation)) {
          ship.orientation = orientation;
          for (let i = 0; i < ship.size; i++) {
            if (orientation === Orientation.HORIZONTAL) {
              this.field[row][col + i] = CellState.SHIP;
              ship.coordinates.push([row, col + i]);
            } else {
              this.field[row + i][col] = CellState.SHIP;
              ship.coordinates.push([row + i, col]);
            }
          }
          this.ships.push(ship);
          placed = true;
        }
      }
    }
  }

  canPlaceShip(ship, row, col, orientation) {
    if (orientation === Orientation.HORIZONTAL && col + ship.size > this.size) {
      return false;
    }
    if (orientation === Orientation.VERTICAL && row + ship.size > this.size) {
      return false;
    }

    for (let i = 0; i < ship.size; i++) {
      if (orientation === Orientation.HORIZONTAL) {
        for (let r = row - 1; r <= row + 1; r++) {
          for (let c = col + i - 1; c <= col + i + 1; c++) {
            if (
              this.isWithinBounds(r, c) &&
              this.field[r][c] !== CellState.EMPTY
            ) {
              return false;
            }
          }
        }
      } else {
        for (let r = row + i - 1; r <= row + i + 1; r++) {
          for (let c = col - 1; c <= col + 1; c++) {
            if (
              this.isWithinBounds(r, c) &&
              this.field[r][c] !== CellState.EMPTY
            ) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  takeShot(row, col) {
    let hit = false;
    let resultShot = 0;

    for (let ship of this.ships) {
      for (let coord of ship.coordinates) {
        let [shipRow, shipCol] = coord;
        if (shipRow === row && shipCol === col) {
          hit = true;
          this.field[row][col] = CellState.HIT;
          break;
        }
      }

      if (hit) {
        resultShot = this.isShipSunk(ship);
        if (resultShot !== 0) {
          this.markSurroundingMisses(ship);
        }
        break;
      }
    }

    if (!hit) {
      this.field[row][col] = CellState.MISS;
    }

    return { resultShot, hit };
  }

  isShipSunk(ship) {
    let sunk = true;
    for (let coord of ship.coordinates) {
      let [row, col] = coord;
      if (this.field[row][col] !== CellState.HIT) {
        sunk = false;
        break;
      }
    }
    if (sunk) {
      ship.isSunk = true;
      console.log(`The ship is sunk: ${ship}`);
    }
    return sunk ? ship.size : 0;
  }

  markSurroundingMisses(ship) {
    for (let coord of ship.coordinates) {
      let [row, col] = coord;
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (
            this.isWithinBounds(r, c) &&
            this.field[r][c] === CellState.EMPTY
          ) {
            this.field[r][c] = CellState.MISS;
          }
        }
      }
    }
  }

  isMissOrHit(row, col) {
    return (
      this.field[row][col] === CellState.MISS ||
      this.field[row][col] === CellState.HIT
    );
  }

  hideShips() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.field[row][col] === CellState.SHIP) {
          this.field[row][col] = CellState.EMPTY;
        }
      }
    }
    return this;
  }

  display() {
    console.log("====================");
    for (let i = 0; i < this.size; i++) {
      console.log(this.field[i].map((cell) => cell.substring(0, 1)).join(" "));
    }
    console.log("====================");
  }
}

module.exports = {
  Battlefield,
};
