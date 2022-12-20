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
  deleteUser,
  giveFTRole,
} from "../../firebase";
import ConfirmMPBox from "./PmComponents/ConfirmMPBox";
import MfaConfirmationBox from "./PmComponents/MfaConfirmationBox";
import UpdateMasterPassword from "./PmComponents/updateMasterPassword";
import classes from "./Settings.module.css";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PErrorBox from "./PmComponents/PErrorBox";
import Support from "./PmComponents/Support";
import ConfirmDowngrade from "./PmComponents/ConfirmDowngrade";
import DeleteAccountWarning from "./PmComponents/DeleteAccountWarning";
const qrcode = require("qrcode");

const PmSettingsPage = (props) => {
  let navigate = useNavigate();
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
  const [pErrorBoxState, setPErrorBoxState] = useState(false);
  const [supportBoxState, setSupportBoxState] = useState(false);
  const [confirmDowngradeState, setConfirmDowngradeState] = useState(false);
  const [deleteAccountWarningState, setDeleteAccountWarningState] =
    useState(false);
  const [postConfirmBoxState, setPostConfirmBoxState] = useState("");
  const [disableBackgroundState, setDisableBackgroundState] = useState(false);
  useEffect(() => {
    document.body.style.overflowY = "scroll";
    return () => {
      document.body.style.overflowY = "hidden";
    };
  }, []);

  const sendToLoginPage = () => {
    console.log("sent!");
    navigate("/", { replace: true });
  };

  return (
    <div className={classes.settingsScreen} id={classes.settingsScreen}>
      {confirmBoxState ? (
        // When a user tries to do something like turn MFA on or off, they need to confirm their password using this popup
        /* After they confirm the password, the confirmPass state will be set to true. So that way they can do other things that
                need them to confirm their password without having to confirm it more than once */
        <ConfirmMPBox
          confirmed={() => {
            setPasswordConfirmedState(true);
          }}
          close={() => {
            setConfirmBoxState(false);
          }}
          postConfirmBoxState={postConfirmBoxState}
          mfaDisable={async () => {
            await disableMFA();
            setDisableButtonToEnableOrDisableState(false);
            setPostConfirmBoxState("");
          }}
          mfaEnable={async () => {
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
            setMfaSecretHexState(generatedMfaInformation.data.mfaSecretHex);
            setMfaSecretState(generatedMfaInformation.data.mfaSecret);
            setOpenMfaConfirmationBox(true);
            setDisableButtonToEnableOrDisableState(false);
            setPostConfirmBoxState("");
          }}
          deleteWarning={async () => {
            setConfirmBoxState(true);
            setDeleteAccountWarningState(true);
            setPostConfirmBoxState("");
          }}
          giveP={async () => {
            await givePRole();
            setPostConfirmBoxState("");
          }}
          giveFT={async () => {
            setConfirmDowngradeState(true);
            setPostConfirmBoxState("");
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
      {
        // This is the popup that tells the user they have to cancel their premium subscription if they want to delete their account
        pErrorBoxState ? (
          <PErrorBox
            close={() => {
              setPErrorBoxState(false);
            }}
          />
        ) : null
      }
      {
        // This is the popup that tells the user they should email support since they are having trouble deleting their account
        supportBoxState ? (
          <Support
            close={() => {
              setSupportBoxState(false);
            }}
          />
        ) : null
      }
      {
        // This is the popup to confirm that the user wants to deactivate their premium subscribtion
        confirmDowngradeState ? (
          <ConfirmDowngrade
            close={() => {
              setConfirmDowngradeState(false);
            }}
            cancel={async () => {
              await giveFTRole();
              setConfirmDowngradeState(false);
            }}
          />
        ) : null
      }
      {deleteAccountWarningState ? (
        // This is the popup to delete the users whole account
        <DeleteAccountWarning
          delete={async () => {
            const deleteUserResult = await deleteUser();
            const deleteUserStatus = deleteUserResult.status;

            if (deleteUserStatus == "pError") {
              setPErrorBoxState(true);
            } else if (deleteUserStatus == "done") {
              try {
                await signOutUser();
              } catch (err) {
                console.log("ok: ", err);
              }
              navigate("/", { replace: true });
            } else if (deleteUserStatus == "support") {
              setSupportBoxState(true);
            }
            console.log("final: ", deleteUserStatus);
          }}
          close={() => {
            setDeleteAccountWarningState(false);
          }}
        />
      ) : null}

      <div
        style={{
          opacity:
            confirmBoxState ||
            openMfaConfirmationBox ||
            updateMasterPasswordTabState ||
            pErrorBoxState ||
            supportBoxState ||
            confirmDowngradeState ||
            disableBackgroundState
              ? ".3"
              : "1",
          pointerEvents:
            confirmBoxState ||
            openMfaConfirmationBox ||
            updateMasterPasswordTabState ||
            pErrorBoxState ||
            supportBoxState ||
            confirmDowngradeState ||
            disableBackgroundState
              ? "none"
              : "auto",
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
            <h3 className={classes.accountSettingsHeader}> Account </h3>
            <div className={classes.accountSettings}>
              {props.roleState == "ft" ? (
                <button
                  className={classes.upgradeToPremium}
                  onClick={async () => {
                    setDisableBackgroundState(true);
                    if (!passwordConfirmedState) {
                      setPostConfirmBoxState("giveP");
                      setConfirmBoxState(true);
                    } else if (passwordConfirmedState) {
                      // If the user successfully completed the ConfirmMPBox, then this will execute.
                      await givePRole();
                    }
                    setDisableBackgroundState(false);
                  }}
                >
                  <p className={classes.settingsButtonText}>
                    Upgrade to premium
                    <span style={{ color: "gold" }}> (CURRENTLY FREE) </span>
                  </p>
                </button>
              ) : props.roleState == "p" ? (
                <button
                  className={classes.cancelPremium}
                  onClick={async () => {
                    setDisableBackgroundState(true);
                    if (!passwordConfirmedState) {
                      setPostConfirmBoxState("giveFT");
                      setConfirmBoxState(true);
                    } else if (passwordConfirmedState) {
                      console.log("else if!");
                      setConfirmDowngradeState(true);
                    } else {
                      console.log("ELSE!");
                    }
                    setDisableBackgroundState(false);
                  }}
                >
                  <p className={classes.settingsButtonText}>
                    Cancel premium subscription
                    {/* <span style={{ color: "purple" }}> (CURRENTLY FREE) </span> */}
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
                  borderRadius: "0",
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
                <p className={classes.settingsButtonTextLogOut}> Log Out </p>
              </button>
            </div>
          </div>
          <div className={classes.securitySettingsSection}>
            <h3 className={classes.securitySettingsHeader}> Security </h3>
            <div className={classes.securitySettings}>
              <div className={(classes.securitySettingsButtons, classes.mfa)}>
                <p className={classes.settingsButtonText}>
                  Multi Factor Authentication (MFA)
                </p>
                <button
                  disabled={disableButtonToEnableOrDisableState}
                  className={classes.buttonToEnableOrDisable}
                  onClick={async () => {
                    setDisableBackgroundState(true);
                    setDisableButtonToEnableOrDisableState(true);
                    if (props.mfaIsEnabledState) {
                      // This will execute if MFA is currently enabled (meaning the user wants to disable it)
                      if (!passwordConfirmedState) {
                        setConfirmBoxState(true);
                        setPostConfirmBoxState("mfaDisable");
                        setDisableButtonToEnableOrDisableState(false); // This will enable the button to enable/disable mfa
                      } else if (passwordConfirmedState) {
                        // If the user successfully completed the ConfirmMPBox, then this will execute. If not, this will not execute
                        await disableMFA();
                        setDisableButtonToEnableOrDisableState(false);
                      }
                    } else if (!props.mfaIsEnabledState) {
                      // This will execute if MFA is currently disabled (meaning the user wants to enable it)
                      if (!passwordConfirmedState) {
                        setConfirmBoxState(true);
                        setPostConfirmBoxState("mfaEnable");
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
                    setDisableBackgroundState(false);
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
                        : props.autolockTimeState.length == 4
                        ? "383%"
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
                        : props.autolockTimeState.length == 4
                        ? "383%"
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
                      onClick={async (evt) => {
                        setDisableBackgroundState(true);
                        evt.preventDefault();
                        setAutolock("");
                        setDisableBackgroundState(false);
                      }}
                    >
                      Never
                    </a>
                    <a
                      href="#"
                      onClick={async (evt) => {
                        setDisableBackgroundState(true);
                        evt.preventDefault();
                        setAutolock("1 min");
                        setDisableBackgroundState(false);
                      }}
                    >
                      1 minute
                    </a>
                    <a
                      href="#"
                      onClick={async (evt) => {
                        setDisableBackgroundState(true);
                        evt.preventDefault();
                        setAutolock("5 mins");
                        setDisableBackgroundState(false);
                      }}
                    >
                      5 minutes
                    </a>
                    <a
                      href="#"
                      onClick={async (evt) => {
                        setDisableBackgroundState(true);
                        evt.preventDefault();
                        setAutolock("15 mins");
                        setDisableBackgroundState(false);
                      }}
                    >
                      15 minutes
                    </a>
                    <a
                      href="#"
                      onClick={async (evt) => {
                        setDisableBackgroundState(true);
                        evt.preventDefault();
                        setAutolock("30 mins");
                        setDisableBackgroundState(false);
                      }}
                    >
                      30 minutes
                    </a>
                    <a
                      href="#"
                      onClick={async (evt) => {
                        setDisableBackgroundState(true);
                        evt.preventDefault();
                        setAutolock("1 hr");
                        setDisableBackgroundState(false);
                      }}
                    >
                      1 hour
                    </a>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className={classes.deleteAccountSection}>
            <div className={classes.disableAccountSettingsButton}>
              Delete Account
              <button
                className={classes.realDeleteAccount}
                onClick={async () => {
                  setDisableBackgroundState(true);
                  if (passwordConfirmedState) {
                    setDeleteAccountWarningState(true);
                  } else if (!passwordConfirmedState) {
                    setPostConfirmBoxState("deleteWarning");
                    setConfirmBoxState(true);
                  }
                  setDisableBackgroundState(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PmSettingsPage;
