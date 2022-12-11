import React, { useState } from "react";
import { useNavigate } from "react-router";
import MfaBox from "../../components/MfaBox";
import { signOutUser, firebaseAuth } from "../../firebase";

const PlDashboard = (props) => {
  const navigate = useNavigate();
  const sendToLoginPage = () => {
    navigate("/", { replace: true });
  };
  const [firebaseEmail, setFirebaseEmail] = useState(
    firebaseAuth.currentUser.email
  );
  return (
    <div>
      {props.mfaIsEnabledState && !props.mfaPassedState ? (
        <MfaBox
          email={firebaseEmail}
          onMfaCorrect={() => {
            props.setMfaPassedState(true);
            props.setMfaBoxState(false);
          }}
          hashBeingUsedToEncrypt={props.hashBeingUsedToEncrypt}
          logOut={async () => {
            await signOutUser();
            sendToLoginPage();
          }}
          authenticatorKey={props.mfaKeyState}
        />
      ) : props.mfaPassedState ? (
        <p>DASH</p>
      ) : null}
    </div>
  );
};

export default PlDashboard;
