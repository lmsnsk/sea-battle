import { NavLink } from "react-router-dom";

import { cleanField, logoutRequest } from "../helpers/functions";
import { HOSTNAME } from "../App";

import style from "./Header.module.scss";

const NavItem = ({ path, title, handler }) => {
  return (
    <NavLink
      className={(navData) => (navData.isActive ? style.active : null)}
      to={path}
      onClick={handler}
    >
      {title}
    </NavLink>
  );
};

const Header = ({
  isAuth,
  setAuth,
  state,
  isStartBattle,
  setStartBattle,
  successReg,
  setSuccessReg,
  setShipsForSending,
}) => {
  const clickLogoutHandler = (event) => {
    event.preventDefault();
    if (isStartBattle) {
      setShipsForSending([]);
      state.playerBattlefield.field = cleanField(state.playerBattlefield.field);
      state.pcBattlefield.field = cleanField(state.pcBattlefield.field);
      navigator.sendBeacon(HOSTNAME + "loose");
      setStartBattle(false);
    }
    if (successReg) setSuccessReg(false);
    setAuth(false);
    logoutRequest(HOSTNAME + "logout");
  };

  const clickItemHandler = () => {
    if (successReg) setSuccessReg(false);
  };

  return (
    <header className={style.header}>
      {isAuth ? (
        <>
          <NavItem path="/" title="Game" handler={clickItemHandler} />
          <NavItem
            path="/bestPlayers"
            title="Best players"
            handler={clickItemHandler}
          />
          <NavItem
            path="/myStats"
            title="My stats"
            handler={clickItemHandler}
          />
          <NavLink
            className={(navData) => (navData.isActive ? style.active : null)}
            to="/signIn"
            onClick={clickLogoutHandler}
          >
            LogOut
          </NavLink>
        </>
      ) : (
        <>
          <NavItem path="/signIn" title="Sign In" handler={clickItemHandler} />
          <NavItem path="/signUp" title="Sign Up" handler={clickItemHandler} />
        </>
      )}
    </header>
  );
};

export default Header;
