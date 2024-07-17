import { useEffect, useState } from "react";

import PlayerCard from "../components/PlayerCard.jsx";
import { getData } from "../helpers/functions.js";
import { HOSTNAME } from "../App.jsx";

import style from "./BestPlayers.module.scss";

let bestPlayerArr = [
  {
    login: "Player1",
    winrate: 98,
    gameCount: 454,
  },
  {
    login: "Player2",
    winrate: 74,
    gameCount: 150,
  },
  {
    login: "Player3",
    winrate: 44,
    gameCount: 16,
  },
];

const BestPlayers = () => {
  const [players, setPlayers] = useState([bestPlayerArr]);

  useEffect(() => {
    try {
      const get = async () => {
        const data = await getData(HOSTNAME + "players/best");
        setPlayers(data);
      };
      get();
    } catch (er) {
      console.error(er, "Faild to get best players");
    }
  }, []);

  return (
    <div className={style.main}>
      <div className={style.title}>Best players</div>
      {players &&
        players.map((el, index) => (
          <PlayerCard key={index} playerCard={el} place={index} />
        ))}
    </div>
  );
};

export default BestPlayers;
