import { useState } from "react";
import { useNavigate } from "react-router";

import SignForm from "../components/SignForm";
import { postRequest } from "../helpers/functions";
import { HOSTNAME } from "../App";

const SignUp = ({ successReg, setSuccessReg }) => {
  const [signData, setSignData] = useState(null);
  const [fail, setFail] = useState(false);

  const navigate = useNavigate();

  const signHandler = async (event) => {
    try {
      event.preventDefault();
      const response = await postRequest(HOSTNAME + "signup", signData);
      if (response.ok) {
        setSuccessReg(true);
        navigate("/signIn");
      } else {
        setFail(true);
      }
    } catch (er) {
      setFail(true);
      console.error(er, "Registration failed");
    }
  };

  return (
    <SignForm
      btnTitle="SIGN UP"
      clickHandler={signHandler}
      setSignData={setSignData}
      fail={fail}
      setFail={setFail}
      successReg={successReg}
      setSuccessReg={setSuccessReg}
    />
  );
};

export default SignUp;
