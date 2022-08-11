import React from "react";
import classes from "./Signup.module.css";
import logo from "../../images/lockIcon.png";
import { Link, useNavigate } from "react-router-dom";
import { signInToPersonalPMAccount } from "../../firebase.js";

const Signup = () => {
  // window.history.pushState(null, window.document.title, window.location.href);
  // This makes it so the user can't click the back or forward arrow on the mouse

  let navigate = useNavigate();

  return (
    <div className={classes.mainDivContainer}>
      <img id={classes.realIcon} src={logo} />
      <h1 id={classes.signUpHeader}>Sign Up</h1>
      <div className={classes.emailContainer}>
        <input type="text" id={classes.emailInput} placeholder="Email" />
      </div>
      <div className={classes.passwordContainer}>
        <input
          type="password"
          id={classes.passwordInput}
          placeholder="Password"
        />
        <div className="eyeHolder">
          <i id={classes.eye} className="far fa-eye"></i>
        </div>
      </div>
      <div className={classes.signUpContainer}>
        <button
          className={classes.signUpButton}
          id={classes.signUpButton}
          onClick={() => {
            navigate("/appselector", { replace: true });
          }}
        >
          <h4 id={classes.signUpText}>Sign Up</h4>
        </button>
      </div>
      <Link to="/" id={classes.sendToLogin} replace={true}>
        Already have an account? Login
      </Link>
      <h4 id={classes.errorText}></h4>
    </div>
  );
};

export default Signup;
