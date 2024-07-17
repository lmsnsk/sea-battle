import { useEffect, useState } from "react";

import { getData } from "../helpers/functions";
import { HOSTNAME } from "../App";

import style from "./MyStats.module.scss";

let myStats = {
  oneCage: 34,
  twoCage: 23,
  threeCage: 15,
  fourCage: 8,
  winrate: 88,
  gamecount: 26,
};

const MyStats = ({ userId }) => {
  const [stat, setStat] = useState([myStats]);

  useEffect(() => {
    try {
      const get = async () => {
        const data = await getData(HOSTNAME + `players/${userId}/stat`);
        setStat(data);
      };
      get();
    } catch (er) {
      console.error(er, "Faild to get my stats");
    }
  }, [userId]);

  return (
    <div className={style.main}>
      <div className={style.title}> My stats</div>
      <div className={style.stat}>
        <p>Число потопленных кораблей: {stat.shipsDestroyed}</p>
        <p>- 1-клеточных: {stat.x1cage}</p>
        <p>- 2-клеточных: {stat.x2cage}</p>
        <p>- 3-клеточных: {stat.x3cage}</p>
        <p>- 4-клеточных: {stat.x4cage}</p>
        <br />
        <p>Игр сыграно: {stat.gamesPlayed}</p>
        <p>Процент побед: {stat.winRate}%</p>
      </div>
    </div>
  );
};

export default MyStats;
