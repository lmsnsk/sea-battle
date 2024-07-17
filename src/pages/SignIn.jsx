import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SignForm from "../components/SignForm";
import { postRequest } from "../helpers/functions";
import { HOSTNAME } from "../App";

const SignIn = ({ setAuth, successReg, setSuccessReg, setUserId }) => {
  const [signInData, setSignInData] = useState(null);
  const [fail, setFail] = useState(false);

  const navigate = useNavigate();

  const auth = () => {
    setAuth(true);
    navigate("/");
  };

  const signHandler = async (event) => {
    try {
      event.preventDefault();
      const response = await postRequest(HOSTNAME + "signin", signInData);
      if (response.ok) {
        auth();
        const data = await response.json();
        setUserId(data.id);
      } else {
        setFail(true);
      }
    } catch (er) {
      setFail(true);
      console.error(er, "Faild to auth");
    }
  };

  return (
    <SignForm
      btnTitle="SIGN IN"
      clickHandler={signHandler}
      setSignData={setSignInData}
      fail={fail}
      setFail={setFail}
      successReg={successReg}
      setSuccessReg={setSuccessReg}
    />
  );
};

export default SignIn;
