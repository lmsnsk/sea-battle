import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Main from "./pages/Main.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import MyStats from "./pages/MyStats.jsx";
import Header from "./components/Header.jsx";
import BestPlayers from "./pages/BestPlayers.jsx";
import { getData } from "./helpers/functions.js";
import preloader from "./assets/img/preloader.gif";

import style from "./App.module.scss";

export const HOSTNAME = "http://localhost:3333/api/v1/";

const shipsData = {
  oneCage: 4,
  twoCage: 3,
  threeCage: 2,
  fourCage: 1,
};

let state = {
  playerBattlefield: {
    size: 10,
    field: [
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
    ],
  },
  pcBattlefield: {
    size: 10,
    field: [
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
      Array(10).fill("0"),
    ],
  },
  winner: null,
};

function App() {
  const [isAuth, setAuth] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isStartBattle, setStartBattle] = useState(false);
  const [successReg, setSuccessReg] = useState(false);
  const [userId, setUserId] = useState(null);
  const [shipsForSending, setShipsForSending] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      const handleUnload = () => {
        if (isStartBattle) navigator.sendBeacon(HOSTNAME + "disconnect");
      };
      window.addEventListener("unload", handleUnload);

      return () => {
        window.removeEventListener("unload", handleUnload);
      };
    }
  }, [isAuth, isStartBattle]);

  useEffect(() => {
    const get = async () => {
      const data = await getData(HOSTNAME + "session-check");
      if (data && data.success) setAuth(true);
      if (isLoading) {
        if (!isAuth) {
          navigate("/signIn");
        } else {
          navigate("/");
        }
      }
      setLoading(true);
    };
    get();
  }, [isAuth, navigate, isLoading]);

  if (!isLoading)
    return (
      <div className={style.content}>
        <img src={preloader} alt="" />
      </div>
    );

  return (
    <div>
      <Header
        isAuth={isAuth}
        setAuth={setAuth}
        state={state}
        isStartBattle={isStartBattle}
        setStartBattle={setStartBattle}
        successReg={successReg}
        setSuccessReg={setSuccessReg}
        setShipsForSending={setShipsForSending}
      />
      <div className={style.content}>
        <Routes>
          <Route
            path="/"
            element={
              <Main
                state={state}
                shipsData={shipsData}
                isStartBattle={isStartBattle}
                setStartBattle={setStartBattle}
                shipsForSending={shipsForSending}
                setShipsForSending={setShipsForSending}
              />
            }
          />
          <Route path="/bestPlayers" element={<BestPlayers />} />
          <Route path="/myStats" element={<MyStats userId={userId} />} />
          <Route
            path="/signUp"
            element={
              <SignUp successReg={successReg} setSuccessReg={setSuccessReg} />
            }
          />
          <Route
            path="/signIn"
            element={
              <SignIn
                setAuth={setAuth}
                successReg={successReg}
                setSuccessReg={setSuccessReg}
                setUserId={setUserId}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
