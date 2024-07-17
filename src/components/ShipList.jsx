import style from "./ShipList.module.scss";

const Ship = ({
  isPreparing,
  isEnemy,
  field,
  ship,
  title,
  activeShip,
  setActiveShip,
  currentShip,
  firstClick,
  setFirstClick,
}) => {
  let shipCount;
  if (currentShip === 1) shipCount = ship;
  else if (currentShip === 2) shipCount = ship;
  else if (currentShip === 3) shipCount = ship;
  else if (currentShip === 4) shipCount = ship;

  const activateShipHandler = () => {
    if (isPreparing && !isEnemy && shipCount) {
      if (activeShip) {
        if (firstClick) {
          field[firstClick.row][firstClick.col] = 0;
          setFirstClick(null);
        }
        setActiveShip(0);
      } else {
        setActiveShip(currentShip);
      }
    }
  };

  let shipClass = `${style.ship} ${
    currentShip === activeShip && shipCount ? style.activeShip : ""
  }`;

  if (isPreparing && shipCount) shipClass += ` ${style.shipPreparing}`;

  return (
    <div className={shipClass} onClick={activateShipHandler}>
      <div>{title}</div>
      {isEnemy || <div>{ship}</div>}
    </div>
  );
};

const ShipList = ({
  field,
  isPreparing,
  isEnemy,
  ships,
  activeShip,
  setActiveShip,
  firstClick,
  setFirstClick,
  isStartBattle,
}) => {
  let shipListStyle = style.field;
  if (isStartBattle) {
    shipListStyle += ` ${isEnemy ? style.enemyField : style.myField}`;
  } else {
    shipListStyle += ` ${style.activeField}`;
  }

  const Component = (title, shipCount, currentShip) => {
    return (
      <Ship
        field={field}
        isPreparing={isPreparing}
        activeShip={activeShip}
        setActiveShip={setActiveShip}
        isEnemy={isEnemy}
        ship={shipCount}
        title={title}
        currentShip={currentShip}
        firstClick={firstClick}
        setFirstClick={setFirstClick}
      />
    );
  };

  return (
    <div className={shipListStyle}>
      {Component("[ ]", isEnemy || ships.oneCage, 1)}
      {Component("[ ][ ]", isEnemy || ships.twoCage, 2)}
      {Component("[ ][ ][ ]", isEnemy || ships.threeCage, 3)}
      {Component("[ ][ ][ ][ ]", isEnemy || ships.fourCage, 4)}
    </div>
  );
};

export default ShipList;
