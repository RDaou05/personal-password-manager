import { React, useEffect, useState } from "react";
import { checkifMasterPasswordIsCorrect } from "../../firebase";

const PmLogin = () => {
  const [loginInputState, setLoginInputState] = useState("");
  const [masterPasswordIsCorrectState, setMasterPasswordIsCorrectState] =
    useState(false);
  return (
    <div>
      <input
        type="text"
        onChange={(event) => {
          setLoginInputState(event.target.value);
        }}
        onKeyUp={async (event) => {
          if (event.key == "Enter") {
            const masterPasswordIsCorrect =
              await checkifMasterPasswordIsCorrect(event.target.value);
            if (masterPasswordIsCorrect) {
              setMasterPasswordIsCorrectState(true);
            } else {
              setMasterPasswordIsCorrectState(false);
            }
          }
        }}
      />
      <button
        onClick={async () => {
          const masterPasswordIsCorrect = await checkifMasterPasswordIsCorrect(
            loginInputState
          );
          if (masterPasswordIsCorrect) {
            setMasterPasswordIsCorrectState(true);
          } else {
            setMasterPasswordIsCorrectState(false);
          }
        }}
      ></button>
      {masterPasswordIsCorrectState ? <div>YESSS</div> : <div>NOOOO</div>}
      {/* Do do when get back from beach:
        just finished master pass sign up and check login process. Next work on Displaying screen when master pass is correct and when wrong. (Make UI for login page)
      */}
    </div>
  );
};

export default PmLogin;
