import { useEffect, useRef } from "react";

import { postRequest } from "../helpers/functions";
import { HOSTNAME } from "../App";

import style from "./Field.module.scss";

const EMPTY = "0";
const SHIP = "1";
const HIT = "2";
const MISS = "3";
const LASTHIT = "4";
const LASTMISS = "5";
const TEMP = "9";

const Field = ({
  ships,
  setShips,
  field,
  isEnemy,
  isStartBattle,
  isPreparing,
  setPreparing,
  shipsForSending,
  setShipsForSending,
  activeShip,
  setActiveShip,
  firstClick,
  setFirstClick,
  curState,
  setCurState,
}) => {
  const elementRef = useRef(null);

  const getCoordinates = (event) => {
    const cageSize = 40;
    const rect = elementRef.current.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cageSize);
    const y = Math.floor((event.clientY - rect.top) / cageSize);
    return { col: x, row: y };
  };

  const isShipsNearby = (row, col) => {
    if (
      field[row][col] === SHIP ||
      (row && field[row - 1][col] === SHIP) ||
      (row < 9 && field[row + 1][col] === SHIP) ||
      (col && field[row][col - 1] === SHIP) ||
      (col < 9 && field[row][col + 1] === SHIP) ||
      (row && col && field[row - 1][col - 1] === SHIP) ||
      (row < 9 && col && field[row + 1][col - 1] === SHIP) ||
      (row && col < 9 && field[row - 1][col + 1] === SHIP) ||
      (row < 9 && col < 9 && field[row + 1][col + 1] === SHIP)
    ) {
      return true;
    }
    return false;
  };

  const setLittleShip = (pos, newShipCount) => {
    if (newShipCount >= 0) {
      const obj = {
        size: 1,
        coordinates: [[pos.row, pos.col]],
        orientation: "0",
      };
      field[pos.row][pos.col] = SHIP;
      setShipsForSending([...shipsForSending, obj]);
      setShips({ ...ships, oneCage: newShipCount });
      setActiveShip(0);
    }
  };

  const setLargeShips = (sz, pos, newShipCount, newShipCountObj) => {
    if (newShipCount >= 0) {
      if (!firstClick) {
        setFirstClick({ row: pos.row, col: pos.col });
        field[pos.row][pos.col] = TEMP;
      } else if (
        (pos.row === firstClick.row + (sz - 1) && pos.col === firstClick.col) ||
        (pos.row === firstClick.row - (sz - 1) && pos.col === firstClick.col) ||
        (pos.row === firstClick.row && pos.col === firstClick.col + (sz - 1)) ||
        (pos.row === firstClick.row && pos.col === firstClick.col - (sz - 1))
      ) {
        let coordinates = [];
        for (let i = 0; i < sz; ++i) {
          if (firstClick.row < pos.row)
            coordinates.push([firstClick.row + i, firstClick.col]);
          if (firstClick.row > pos.row)
            coordinates.push([firstClick.row - i, firstClick.col]);
          if (firstClick.col < pos.col)
            coordinates.push([firstClick.row, firstClick.col + i]);
          if (firstClick.col > pos.col)
            coordinates.push([firstClick.row, firstClick.col - i]);
        }
        const obj = {
          size: sz,
          coordinates: coordinates,
          orientation: firstClick.row === pos.row ? "0" : "1",
        };
        coordinates.forEach((el) => (field[el[0]][el[1]] = SHIP));

        setShipsForSending([...shipsForSending, obj]);
        setShips({ ...ships, ...newShipCountObj });
        setFirstClick(null);
        setActiveShip(0);
      }
    }
  };

  const setShipsDurinPreparing = (event) => {
    if (!isEnemy && activeShip) {
      const pos = getCoordinates(event);

      if (isShipsNearby(pos.row, pos.col)) return;

      if (activeShip === 1) {
        const newShipCount = ships.oneCage - 1;
        setLittleShip(pos, newShipCount);
      } else if (activeShip === 2) {
        const newShipCount = ships.twoCage - 1;
        setLargeShips(2, pos, newShipCount, { twoCage: newShipCount });
      } else if (activeShip === 3) {
        const newShipCount = ships.threeCage - 1;
        setLargeShips(3, pos, newShipCount, { threeCage: newShipCount });
      } else if (activeShip === 4) {
        const newShipCount = ships.fourCage - 1;
        setLargeShips(4, pos, newShipCount, { fourCage: newShipCount });
      }
    }
  };

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const shooting = async (event) => {
    if (isEnemy && isStartBattle && !isPreparing) {
      const pos = getCoordinates(event);
      if (curState.pcBattlefield.field[pos.row][pos.col] !== EMPTY) return;

      const response = await postRequest(HOSTNAME + "games/move", {
        row: pos.row,
        col: pos.col,
      });
      const data = await response.json();
      setCurState({ ...data, playerBattlefield: curState.playerBattlefield });
      await delay(500);
      setCurState(data);
    }
  };

  useEffect(() => {
    const isLeftShipsForSetting = () => {
      if (ships.oneCage + ships.twoCage + ships.threeCage + ships.fourCage > 0)
        return true;
      return false;
    };
    if (!isEnemy && !isLeftShipsForSetting()) {
      setPreparing(false);
      postRequest(HOSTNAME + "games/start", shipsForSending);
    }
  }, [ships, setPreparing, shipsForSending, isEnemy, activeShip, field]);

  const cageStyle = (el) => {
    let temp;
    if (el === SHIP) temp = style.shipCage;
    else if (el === MISS) temp = style.missCage;
    else if (el === HIT) temp = style.hitCage;
    else if (el === TEMP) temp = style.tempCage;
    else if (el === LASTMISS) temp = style.lastMissCage;
    else if (el === LASTHIT) temp = style.lastHitCage;
    return `${style.cage} ${temp || ""}`;
  };

  let fieldClass = `${style.field} ${
    isEnemy ? style.enemyField : style.myField
  }`;

  if (!isStartBattle) fieldClass += ` ${style.fieldNonActive}`;

  return (
    <div
      ref={elementRef}
      onClick={isPreparing ? setShipsDurinPreparing : shooting}
      className={fieldClass}
    >
      {(isEnemy
        ? curState.pcBattlefield.field
        : curState.playerBattlefield.field
      ).map((line, lineIndex) =>
        line.map((el, index) => (
          <div key={lineIndex * 10 + index} className={cageStyle(el)}></div>
        ))
      )}
    </div>
  );
};

export default Field;
