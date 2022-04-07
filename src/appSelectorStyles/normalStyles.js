let normalStyles = `
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap");

*:focus {
  outline: 0 !important;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  margin: auto;
  max-width: 38rem;
  padding-bottom: 14rem;
  /* background-color: #282d34; */
  background-image: linear-gradient(to bottom right, #053f45, #0b817b);
  overflow: hidden;
}

#container {
  display: flex;
  margin-top: 13%;
  flex-direction: column;
  width: 100%;
  padding-right: 47%;
}

#realIcon {
  width: auto;
  height: 58px;
  -webkit-filter: drop-shadow(5px 5px 5px #222);
  filter: drop-shadow(5px 5px 5px #222);
}

.keyImage {
  text-align: center;
  margin-bottom: 6%;
}

#takeToLockerButton {
  background-color: #492084;
}

#takeToLockerButton:hover {
  transition: all ease-in-out 0.2s;
  transform: translateY(-2px);
  cursor: pointer;
}

#takeToPMButton {
  background-color: #14887b;
}

#takeToPMButton:hover {
  transition: all ease-in-out 0.2s;
  transform: translateY(-2px);
  cursor: pointer;
}

.redirectAppButtons {
  padding: 4%;
  border-radius: 2vh;
  border: none;
  outline: none;
  text-align: center;
  margin-top: 4%;
  box-shadow: 0 8px 15px rgb(0 0 0 / 33%);
}

#takeToLockerLinkHidden {
  display: none;
}
#takeToPMLinkHidden {
  display: none;
}

#fromMainToLogin {
  display: none;
}

#backToLoginLinkContainer {
  text-align: center;
  margin-top: 9%;
}

#backToLoginLink {
  color: #ffffff;
  text-decoration: none;
  /* font-weight: 700; */
  font-family: "Montserrat", sans-serif;
  font-size: 17px;
  user-select: none;
}

#backToLoginLink:hover {
  opacity: 0.7;
  margin-top: 0.5%;
  transition: all ease-in-out 0.1s;
}

#keyPMIcon {
  font-size: 22px;
  float: left;
}

#pmButtonText {
  color: black;
  font-family: "Montserrat", sans-serif;
  font-weight: bolder;
  font-size: 19px;
  margin: 0;
  margin-right: 3%;
}

#docLockerIcon {
  font-size: 22px;
  float: left;
}

#lockerButtonText {
  color: black;
  font-family: "Montserrat", sans-serif;
  font-weight: bolder;
  font-size: 19px;
  margin: 0;
  margin-right: 3%;
}

#backToLoginLinkHidden {
  display: none;
}

#nameHeader {
  color: white;
  font-family: "Montserrat", sans-serif;
  margin-left: 34%;
  margin-top: 0;
}

.showPUIButton {
  margin: 10px;
  padding: 15px 45px;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10vh;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 30px;
}

.showPUIButtonContainer {
  position: absolute;
  top: 0%;
  right: 0%;
  margin: 2% 1% 0 0;
}

.showPUIButton {
  background-image: linear-gradient(
    to right,
    #007991 0%,
    #78ffd6 51%,
    #007991 100%
  );
}
.showPUIButton {
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
}

.showPUIButton:hover {
  background-position: right center; /* change the direction of the change here */
}

/* 

 */

.showFTUIButton {
  margin: 10px;
  padding: 15px 45px;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10vh;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 30px;
}

.showFTUIButtonContainer {
  position: absolute;
  top: 0%;
  right: 0%;
  margin: 2% 1% 0 0;
  display: none;
}

.showFTUIButton {
  background-image: linear-gradient(to right, #8e2de2, #4a00e0);
}

.showFTUIButton {
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
}

.showFTUIButton:hover {
  background-position: right center; /* change the direction of the change here */
}

/* */
/* */
/* */

.backgroundGridContainer {
  box-sizing: border-box;
  padding: 5%;
  align-items: stretch;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 3%;
  row-gap: 17%;
}

.themeSelectorContainer {
  background-color: #282d34;
  border-radius: 1vh;
  padding: 5%;
  box-shadow: 0 14px 20px rgb(0 0 0 / 80%);
  text-align: center;
  z-index: 2;
  display: flex;
  flex-direction: column;
  position: absolute;
  margin-right: 19%;
  display: none;
}

.backgroundGridItem {
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 8px 17px rgb(0 0 0 / 80%);
  height: auto;
  cursor: pointer;
}

#themeSelectorHeader {
  text-align: center;
  font-family: "Montserrat", sans-serif;
  color: white;
}

#closeThemeSelector {
  position: absolute;
  color: white;
  font-family: "Montserrat", sans-serif;
  right: 0;
  bottom: 78%;
  padding: 3%;
  cursor: pointer;
}

#takeToPMButton {
  padding: 4%;
  border-radius: 2vh;
  border: none;
  outline: none;
  text-align: center;
  margin-top: 4%;
  box-shadow: 0 8px 15px rgb(0 0 0 / 33%);
}

#takeToLockerButton {
  padding: 4%;
  border-radius: 2vh;
  border: none;
  outline: none;
  text-align: center;
  margin-top: 4%;
  box-shadow: 0 8px 15px rgb(0 0 0 / 33%);
}

.exitPreview {
  background-image: linear-gradient(
    to right,
    #007991 0%,
    #78ffd6 51%,
    #007991 100%
  );
}

`;

export { normalStyles };
