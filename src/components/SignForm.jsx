import { useEffect, useState } from "react";

import style from "./SignForm.module.scss";

const SignForm = ({
  btnTitle,
  clickHandler,
  setSignData,
  fail,
  setFail,
  successReg,
  setSuccessReg,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inputType, setInputType] = useState("password");

  useEffect(() => {
    setSignData({ username: username, password: password });
  }, [username, password, setSignData]);

  const onChangeHandler = (e, fn) => {
    if (fail) setFail(false);
    if (successReg) setSuccessReg(false);
    fn(e.target.value);
  };

  const passVisibleToogle = () => {
    if (inputType === "text") setInputType("password");
    else setInputType("text");
  };

  let inputClass = fail ? style.failInput : "";

  return (
    <div className={style.sign}>
      <form onSubmit={clickHandler}>
        <div> Login</div>
        <input
          className={inputClass}
          type="text"
          value={username}
          onChange={(e) => onChangeHandler(e, setUsername)}
        />
        <div>Password</div>
        <input
          className={inputClass}
          type={inputType}
          value={password}
          onChange={(e) => onChangeHandler(e, setPassword)}
        />
        <div className={style.check}>
          <input type="checkbox" onClick={passVisibleToogle} />
          <p>Show Password</p>
        </div>
        {successReg && (
          <div className={style.successMsg}>
            Registration completed successfully!
          </div>
        )}
        <button type="submit">{btnTitle}</button>
      </form>
    </div>
  );
};

export default SignForm;
