let premiumAmin = `
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
    background-color: #282d34;
    background-image: linear-gradient(to right, #8e2de2, #4a00e0);
    overflow: hidden;
}

#container {
    display: grid;
    margin-top: 10%;
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

.redirectAppButtons {
    padding: 4%;
    border-radius: 1vh;
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
    margin-top: 11%;
}

#backToLoginLink {
    font-weight: 900;
    font-family: "Montserrat", sans-serif;
    font-size: 17px;
    user-select: none;
    color: white;
    background: none;
    -webkit-background-clip: revert;
    -webkit-text-fill-color: unset;
}

#backToLoginLink:hover {
    opacity: 0.7;
    margin-top: 0.5%;
    transition: all ease-in-out 0.1s;
}

#keyPMIcon {
    font-size: 22px;
    float: left;
    padding-left: 2%;
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
    padding-left: 2%;
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
    background: none;
    -webkit-background-clip: revert;
    -webkit-text-fill-color: unset;
    font-family: "Montserrat", sans-serif;
    margin-left: 34%;
    margin-top: 0;
}

#takeToPMButton {
    min-width: 300px;
    min-height: 60px;
    font-family: "Montserrat", sans-serif;
    font-size: 22px;
    text-transform: uppercase;
    letter-spacing: 1.3px;
    font-weight: 700;
    color: #313133;
    background: rgb(0 255 203 / 64%);
    background-image: none;
    border: none;
    transition: all 0.2s ease-in-out 0s;
    cursor: pointer;
    outline: none;
    position: relative;
    padding: 10px;
}

#takeToPMButton::before {
    content: "";
    border-radius: 1000px;
    min-width: calc(300px + 12px);
    min-height: calc(60px + 12px);
    /* border: 6px solid #00ffcb; */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all 0.2s ease-in-out 0s;
}

#takeToPMButton:hover,
#takeToPMButton:focus {
    color: #313133;
    transform: translateY(-2px);
    background-position: right center;
}

#takeToPMButton::after {
    content: "";
    width: 30px;
    height: 30px;
    border-radius: 100%;
    /* border: 6px solid #00ffcb; */
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* animation: ring 1.5s infinite; */
}

#takeToPMButton:hover::after,
#takeToPMButton:focus::after {
    animation: none;
    display: none;
}

/*  */
/*  */
/*  */

#takeToLockerButton {
    min-width: 300px;
    min-height: 60px;
    margin-top: 5%;
    font-family: "Montserrat", sans-serif;
    font-size: 22px;
    text-transform: uppercase;
    letter-spacing: 1.3px;
    font-weight: 700;
    color: #313133;
    background: #8e2de2;
    background-image: none;
    border: none;
    transition: all 0.2s ease-in-out 0s;
    cursor: pointer;
    outline: none;
    position: relative;
    padding: 10px;
}

#takeToLockerButton::before {
    content: "";
    border-radius: 1000px;
    min-width: calc(300px + 12px);
    min-height: calc(60px + 12px);
    /* border: 6px solid #00ffcb; */
    box-shadow: 0 0 60px rgba(0, 255, 203, 0.64);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all 0.2s ease-in-out 0s;
}

#takeToLockerButton:hover,
#takeToLockerButton:focus {
    color: #313133;
    transform: translateY(-2px);
}

#takeToLockerButton::after {
    content: "";
    width: 30px;
    height: 30px;
    border-radius: 100%;
    /* border: 6px solid #00ffcb; */
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* animation: ring 1.5s infinite; */
}

#takeToLockerButton:hover::after,
#takeToLockerButton:focus::after {
    animation: none;
    display: none;
}

/* */

button#takeToPMButton {
    margin-top: 6%;
}

.showPUIButton {
    background-image: linear-gradient(to right, #8e2de2, #4a00e0);
}

.exitPreview {
    background-image: linear-gradient(to left, #8e2de2, #4a00e0);
}

`;

export { premiumAmin };
