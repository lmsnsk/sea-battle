import style from "./PlayerCard.module.scss";

const PlayerCard = ({ playerCard, place }) => {
  return (
    <div className={style.card}>
      <div>
        <div>Логин: {playerCard.username}</div>
        <div>Процент побед: {playerCard.winRate}%</div>
        <div>Сыграно игр: {playerCard.matchesPlayed}</div>
      </div>
      <div className={style.place}>{place + 1}</div>
    </div>
  );
};

export default PlayerCard;
