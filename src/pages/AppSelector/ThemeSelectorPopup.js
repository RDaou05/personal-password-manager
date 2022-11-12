import React from "react";
import normalClasses from "./AppSelector.module.css";
import blackThemePic from "../../images/themes/black.png";
import frostThemePic from "../../images/themes/Frost.png";
import greyThemePic from "../../images/themes/grey.png";
import normalThemePic from "../../images/themes/normal.png";
import purpleBlueThemePic from "../../images/themes/purple-blue.png";
import purpleClassyThemePic from "../../images/themes/purple-classy.png";
import aminClasses from "./AminPurple.module.css";
import blackClasses from "./Black.module.css";
import premiumPurpleClasses from "./PremiumPurple.module.css";
import frostClasses from "./Frost.module.css";
import greyClasses from "./Grey.module.css";

const ThemeSelectorPopup = (props) => {
  return (
    <div className={normalClasses.themeSelectorContainer}>
      <h1
        id={props.classes.closeThemeSelector}
        onClick={() => {
          // Hides theme selector window after clicking on "X" button
          props.setThemeSelectState(false);
        }}
      >
        x
      </h1>
      <h1 id={props.classes.themeSelectorHeader}>PM themes</h1>
      <div className={props.classes.backgroundGridContainer}>
        <img
          id={props.classes.backgroundGridItemPremiumAmin}
          className={props.classes.backgroundGridItem}
          src={purpleBlueThemePic}
          alt="Image not available"
          onClick={() => {
            if (props.roleState == "ft") {
              props.setInPreviewState(true);
            } else {
              props.setInPreviewState(false);
              localStorage.setItem("pmTheme", "aminClasses");
            }
            props.setClassesState(aminClasses);
            props.setThemeSelectState(false); // Hides window after user selects an image
            document.body.style.backgroundImage =
              "linear-gradient(to left, #8e2de2, #4a00e0)";
          }}
        />
        <img
          id={props.classes.backgroundGridItemPremiumPurple}
          className={props.classes.backgroundGridItem}
          src={purpleClassyThemePic}
          alt="Image not available"
          onClick={() => {
            if (props.roleState == "ft") {
              props.setInPreviewState(true);
            } else {
              props.setInPreviewState(false);
              localStorage.setItem("pmTheme", "premiumPurpleClasses");
            }
            props.setClassesState(premiumPurpleClasses);
            props.setThemeSelectState(false); // Hides window after user selects an image
            document.body.style.backgroundImage =
              "linear-gradient(to right, #0f0c29, #302b63, #24243e)";
          }}
        />
        <img
          id={props.classes.backgroundGridItemNormalStyles}
          className={props.classes.backgroundGridItem}
          src={normalThemePic}
          alt="Image not available"
          onClick={() => {
            if (props.roleState != "ft") {
              localStorage.setItem("pmTheme", "normalClasses");
            }
            props.setInPreviewState(false);
            props.setThemeSelectState(false); // Hides window after user selects an image
            props.setClassesState(normalClasses);
            document.body.style.backgroundImage =
              "linear-gradient(to bottom right, #053f45, #0b817b)";
          }}
        />
        <img
          id={props.classes.backgroundGridItemPremiumFrost}
          className={props.classes.backgroundGridItem}
          src={frostThemePic}
          alt="Image not available"
          onClick={() => {
            if (props.roleState == "ft") {
              props.setInPreviewState(true);
            } else {
              props.setInPreviewState(false);
              localStorage.setItem("pmTheme", "frostClasses");
            }
            props.setClassesState(frostClasses);
            props.setThemeSelectState(false); // Hides window after user selects an image
            document.body.style.backgroundImage =
              "linear-gradient(to right, #000428, #004e92)";
          }}
        />
        <img
          id={props.classes.backgroundGridItemPremiumBlack}
          className={props.classes.backgroundGridItem}
          src={blackThemePic}
          alt="Image not available"
          onClick={() => {
            if (props.roleState == "ft") {
              props.setInPreviewState(true);
            } else {
              props.setInPreviewState(false);
              localStorage.setItem("pmTheme", "blackClasses");
            }
            props.setClassesState(blackClasses);
            props.setThemeSelectState(false); // Hides window after user selects an image
            document.body.style.backgroundImage =
              "linear-gradient(to right, black 12%, #434343 95%)";
          }}
        />
        <img
          id={props.classes.backgroundGridItemPremiumGrey}
          className={props.classes.backgroundGridItem}
          src={greyThemePic}
          alt="Image not available"
          onClick={() => {
            if (props.roleState == "ft") {
              props.setInPreviewState(true);
            } else {
              props.setInPreviewState(false);
              localStorage.setItem("pmTheme", "greyClasses");
            }
            props.setClassesState(greyClasses);
            props.setThemeSelectState(false); // Hides window after user selects an image
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundColor = "#282d34";
          }}
        />
      </div>
    </div>
  );
};

export default ThemeSelectorPopup;
