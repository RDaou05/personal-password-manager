import React from "react";
import errorClasses from "./ErrorClasses.module.css";
import { Link } from "react-router-dom";

const ErrorHasOccuredBox = (props) => {
  return (
    <div>
      <div className={errorClasses.errorHasOccuredBox}>
        <h3 id={errorClasses.errorHasOccuredHeader}>An error has occurred</h3>
        <h4 id={errorClasses.pcText}>Please contact</h4>
        <h4 className={errorClasses.supportEmail}>
          personal.pm.help.email@gmail.com
        </h4>
        <h4 id={errorClasses.ifYouWerentAwareText}>
          if you need any assistance
        </h4>
        <h4 style={{ color: "yellow" }}>
          If you just created an account, please wait at least 30 seconds before
          trying to reach out
        </h4>
        <Link
          className={props.classes.backToLoginLink}
          to=""
          onClick={async (event) => {
            if (!props.inPreviewState) {
              event.preventDefault();
              await props.signOutUser();
              props.sendToLoginPage();
            }
          }}
          replace={true}
        >
          Log out • {props.firebaseEmail}
        </Link>
      </div>
    </div>
  );
};

export default ErrorHasOccuredBox;
