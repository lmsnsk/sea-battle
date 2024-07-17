import { useState } from "react";

import Field from "../components/Field";
import ShipList from "../components/ShipList";
import { cleanField } from "../helpers/functions";

import style from "./Main.module.scss";

const Main = ({
  state,
  shipsData,
  isStartBattle,
  setStartBattle,
  shipsForSending,
  setShipsForSending,
}) => {
  const [ships, setShips] = useState(shipsData);
  const [activeShip, setActiveShip] = useState(0);
  const [firstClick, setFirstClick] = useState(null);
  const [isPreparing, setPreparing] = useState(false);
  const [curState, setCurState] = useState(state);

  const onStartBattleHandler = () => {
    setStartBattle(true);
    setPreparing(true);
  };

  const playAgianHandler = () => {
    setStartBattle(false);
    setShips(shipsData);
    setShipsForSending([]);
    state.playerBattlefield.field = cleanField(state.playerBattlefield.field);
    state.pcBattlefield.field = cleanField(state.pcBattlefield.field);
    setCurState(state);
  };

  const endGameMesssage = () => {
    if (curState.winner) {
      let text;
      let msgStyle = style.endGameMsg;

      if (curState.winner === "PC") {
        text = "DEFEAT!";
        msgStyle += " " + style.loose;
      } else if (curState.winner === "PLAYER") {
        text = "VICTORY!";
        msgStyle += " " + style.win;
      }
      return (
        <div className={style.endGameMsgBox}>
          <div className={msgStyle}>{text}</div>
          <button onClick={playAgianHandler}>PLAY AGAIN</button>
        </div>
      );
    }
  };

  return (
    <div className={style.main}>
      <div>
        <Field
          field={state.playerBattlefield.field}
          ships={ships}
          setShips={setShips}
          isEnemy={false}
          isStartBattle={isStartBattle}
          isPreparing={isPreparing}
          setPreparing={setPreparing}
          shipsForSending={shipsForSending}
          setShipsForSending={setShipsForSending}
          activeShip={activeShip}
          setActiveShip={setActiveShip}
          firstClick={firstClick}
          setFirstClick={setFirstClick}
          curState={curState}
          setCurState={setCurState}
        />
        <ShipList
          isStartBattle={isStartBattle}
          field={state.playerBattlefield.field}
          isEnemy={false}
          isPreparing={isPreparing}
          ships={ships}
          activeShip={activeShip}
          setActiveShip={setActiveShip}
          firstClick={firstClick}
          setFirstClick={setFirstClick}
        />
      </div>
      <div className={style.central}>
        {isStartBattle || <span className={style.startTitle}>START GAME</span>}
        <div
          onClick={onStartBattleHandler}
          className={`${style.battleStart} ${
            isStartBattle ? style.activated : ""
          }`}
        ></div>
      </div>
      <div>
        <Field
          field={state.pcBattlefield.field}
          isEnemy={true}
          isStartBattle={isStartBattle}
          isPreparing={isPreparing}
          curState={curState}
          setCurState={setCurState}
        />
        <ShipList isEnemy={true} isStartBattle={isStartBattle} />
      </div>
      {endGameMesssage()}
    </div>
  );
};

export default Main;
