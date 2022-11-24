import React, { useEffect } from "react";
import { useState, useLayoutEffect } from "react";
import {
  disableMFA,
  enableMFA,
  firebaseAuth,
  generateMFA,
  givePRole,
  signOutUser,
  FSDB,
  setAutolock,
} from "../../firebase";
import ConfirmMPBox from "./PmComponents/ConfirmMPBox";
import MfaConfirmationBox from "./PmComponents/MfaConfirmationBox";
import UpdateMasterPassword from "./PmComponents/updateMasterPassword";
import classes from "./Settings.module.css";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
const qrcode = require("qrcode");

const PmSettingsPage = (props) => {
  const [passwordConfirmedState, setPasswordConfirmedState] = useState(false);
  const [confirmBoxState, setConfirmBoxState] = useState(false);
  const [openMfaConfirmationBox, setOpenMfaConfirmationBox] = useState(false);
  const [qrcodeDataState, setQrcodeDataState] = useState("");
  const [mfaCodeState, setMfaCodeState] = useState("");
  const [mfaSecretHexState, setMfaSecretHexState] = useState("");
  const [mfaSecretState, setMfaSecretState] = useState("");
  const [
    disableButtonToEnableOrDisableState,
    setDisableButtonToEnableOrDisableState,
  ] = useState(false);
  const [updateMasterPasswordTabState, setUpdateMasterPasswordTabState] =
    useState(false);

  return (
    <div className={classes.settingsScreen} id={classes.settingsScreen}>
      {confirmBoxState ? (
        // When a user tries to do something like turn MFA on or off, they need to confirm their password using this popup
        /* After they confirm the password, the confirmPass state will be set to true. So that way they can do other things that
        need them to confirm their password without having to confirm it more than once */
        <ConfirmMPBox
          confirmed={() => {
            setPasswordConfirmedState(true);
            setConfirmBoxState(false);
          }}
          close={() => {
            setConfirmBoxState(false);
          }}
        />
      ) : null}
      {
        // This is thr popup that shows when the user needs to confirm the code on their MFA app in order to complete the MFA registration process
        openMfaConfirmationBox ? (
          <MfaConfirmationBox
            qrcode={qrcodeDataState}
            mfaCode={mfaCodeState}
            mfaSecretHex={mfaSecretHexState}
            closeMfaConfirmationBox={() => {
              setOpenMfaConfirmationBox(false);
            }}
            mfaConfirmationBoxCompleted={async () => {
              setOpenMfaConfirmationBox(false);
              await enableMFA(mfaSecretHexState, props.hashBeingUsedToEncrypt);
            }}
          />
        ) : null
      }
      {
        // This is the popup that allows the user to update their master password
        updateMasterPasswordTabState ? (
          <UpdateMasterPassword
            close={() => {
              setUpdateMasterPasswordTabState(false);
            }}
            success={(newMpHash) => {
              props.setHashBeingUsedToEncrypt(newMpHash);
              setUpdateMasterPasswordTabState(false);
            }}
          />
        ) : null
      }
      <div
        style={{
          opacity:
            confirmBoxState ||
            openMfaConfirmationBox ||
            updateMasterPasswordTabState
              ? ".3"
              : "1",
        }}
      >
        <button
          id={classes.closeSettings}
          onClick={() => {
            props.closeSettings();
          }}
        >
          &#x2715;
        </button>

        <div className={classes.mainSettings}>
          <div className={classes.accountSettingsSection}>
            <h3 className={classes.accountSettingsHeader}>Account</h3>
            <div className={classes.accountSettings}>
              {props.roleState == "ft" ? (
                <button
                  className={classes.upgradeToPremium}
                  onClick={async () => {
                    await givePRole();
                  }}
                >
                  <p className={classes.settingsButtonText}>
                    Upgrade to premium{" "}
                    <span style={{ color: "gold" }}>(CURRENTLY FREE)</span>
                  </p>
                </button>
              ) : null}

              <button
                className={
                  (classes.changeMasterPassword, classes.accountSettingsButtons)
                }
                onClick={() => {
                  setUpdateMasterPasswordTabState(true);
                }}
                style={{
                  borderTopLeftRadius: props.roleState != "ft" ? "1vh" : "0",
                  borderTopRightRadius: props.roleState != "ft" ? "1vh" : "0",
                }}
              >
                <p className={classes.settingsButtonText}>
                  Change master password
                </p>
              </button>
              <button
                className={
                  (classes.logOutOfPMAccount, classes.accountSettingsButtons)
                }
                onClick={async () => {
                  await props.logOut();
                }}
                style={{
                  borderBottomLeftRadius: "1vh",
                  borderBottomRightRadius: "1vh",
                  borderTopLeftRadius: "0",
                  borderTopRightRadius: "0",
                }}
              >
                <p className={classes.settingsButtonTextLogOut}>Log Out</p>
              </button>
            </div>
          </div>
          <div className={classes.securitySettingsSection}>
            <h3 className={classes.securitySettingsHeader}>Security</h3>
            <div className={classes.securitySettings}>
              <div className={(classes.securitySettingsButtons, classes.mfa)}>
                <p className={classes.settingsButtonText}>
                  Multi-Factor Authentication (MFA)
                </p>
                <button
                  disabled={disableButtonToEnableOrDisableState}
                  className={classes.buttonToEnableOrDisable}
                  onClick={async () => {
                    setDisableButtonToEnableOrDisableState(true);
                    if (props.mfaIsEnabledState) {
                      // This will execute if MFA is currently enabled (meaning the user wants to disable it)
                      if (!passwordConfirmedState) {
                        setConfirmBoxState(true);
                        setDisableButtonToEnableOrDisableState(false);
                      } else if (passwordConfirmedState) {
                        // If the user successfully completed the ConfirmMPBox, then this will execute. If not, this will not execute
                        await disableMFA();
                        setDisableButtonToEnableOrDisableState(false);
                      }
                    } else if (!props.mfaIsEnabledState) {
                      // This will execute if MFA is currently disabled (meaning the user wants to enable it)
                      if (!passwordConfirmedState) {
                        setConfirmBoxState(true);
                        setDisableButtonToEnableOrDisableState(false);
                      } else if (passwordConfirmedState) {
                        // If the user successfully completed the ConfirmMPBox, then this will execute. If not, this will not execute
                        const generatedMfaInformation = await generateMFA();
                        const options = {
                          color: {
                            dark: "#ffffff",
                            light: "#585454",
                          },
                        };
                        qrcode.toDataURL(
                          generatedMfaInformation.data.otpauthURL,
                          options,
                          (err, qrcodeOtpauthUrl) => {
                            setQrcodeDataState(qrcodeOtpauthUrl);
                          }
                        );
                        setMfaCodeState(generatedMfaInformation.data.mfaCode);
                        setMfaSecretHexState(
                          generatedMfaInformation.data.mfaSecretHex
                        );
                        setMfaSecretState(
                          generatedMfaInformation.data.mfaSecret
                        );
                        setOpenMfaConfirmationBox(true);
                        setDisableButtonToEnableOrDisableState(false);
                      }
                    }
                  }}
                >
                  {props.mfaIsEnabledState
                    ? "Disable"
                    : !props.mfaIsEnabledState
                    ? "Enable"
                    : null}
                </button>
              </div>
              <button
                className={(classes.securitySettingsButtons, classes.autolock)}
              >
                <p className={classes.settingsButtonText}>
                  Change time to automatically lock the app after inactivity
                </p>
                <div className={classes.dropdown}>
                  <button
                    className={classes.dropbtn}
                    style={{
                      // Adjusting the width of the button to stay proportional when the number of characters inside of it changes
                      width: !props.autolockEnabledState
                        ? "268%"
                        : props.autolockTimeState.length == 7
                        ? "210%"
                        : props.autolockTimeState.length == 6
                        ? "243%"
                        : props.autolockTimeState.length == 5
                        ? "283%"
                        : props.autolockTimeState.length == 0
                        ? "268%"
                        : null,
                      minWidth: !props.autolockEnabledState
                        ? "268%"
                        : props.autolockTimeState.length == 7
                        ? "210%"
                        : props.autolockTimeState.length == 6
                        ? "243%"
                        : props.autolockTimeState.length == 5
                        ? "283%"
                        : props.autolockTimeState.length == 0
                        ? "268%"
                        : null,
                    }}
                  >
                    {props.autolockEnabledState
                      ? props.autolockTimeState
                      : "Never"}
                  </button>
                  <div className={classes.dropdownContent}>
                    <a
                      href="#"
                      onClick={async () => {
                        setAutolock("");
                      }}
                    >
                      Never
                    </a>
                    <a
                      href="#"
                      onClick={async () => {
                        setAutolock("1 min");
                      }}
                    >
                      1 minute
                    </a>
                    <a
                      href="#"
                      onClick={async () => {
                        setAutolock("5 mins");
                      }}
                    >
                      5 minutes
                    </a>
                    <a
                      href="#"
                      onClick={async () => {
                        setAutolock("15 mins");
                      }}
                    >
                      15 minutes
                    </a>
                    <a
                      href="#"
                      onClick={async () => {
                        setAutolock("30 mins");
                      }}
                    >
                      30 minutes
                    </a>
                    <a
                      href="#"
                      onClick={async () => {
                        setAutolock("1 hour");
                      }}
                    >
                      1 hour
                    </a>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PmSettingsPage;
