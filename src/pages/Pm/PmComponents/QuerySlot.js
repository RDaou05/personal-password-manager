import React, { useState, useEffect } from "react";
import classes from "../Dashboard.module.css";
import UpdateTab from "./UpdateTab.js";

const QuerySlot = (props) => {
  const [iconSourceLinkState, setIconSourceLinkState] = useState();

  const [imageIsValidState, setImageIsValidState] = useState(false);
  const [showUpdateTabState, setShowUpdateTabState] = useState();
  const objectOfQueryToRender = props.query;
  const objectOfQueryInfo = objectOfQueryToRender[0];
  const [directLink, setDirectLinkState] = useState(
    objectOfQueryInfo.directLink
  );
  const [email, setEmailState] = useState(objectOfQueryInfo.email);
  const [isLink, setIsLinkState] = useState(objectOfQueryInfo.isLink);
  const [pass, setPassState] = useState(objectOfQueryInfo.pass);
  const [name, setNameState] = useState(objectOfQueryInfo.website);
  const [random, setRandomState] = useState(objectOfQueryInfo.random);
  const [haveQueryExisting, sethaveQueryExistingState] = useState(true); // If this is set to false, the whole query (and the update tab) will be completly deleted from the UI
  let listOfColors = [
    /* When a favicon link for a query doesn't work, the picture icon is replaced with a box containing the first 
  two letters of the name of the query. Before this is rendered we will choose a random background color for the box from this list */
    "#198582",
    "#3d3dad",
    "#830a08",
    "#ffa800",
    "#626f7a",
  ];
  let iconSourceLink;
  let iconSourceLinkNoSize;
  useEffect(() => {
    const i = async () => {
      const response = await fetch(
        `https://www.google.com/s2/favicons?domain=${directLink}`
      );
      if (!response.ok) {
        setImageIsValidState(false);
      } else {
        setImageIsValidState(true);
      }
    };
    i();
  }, []);

  if (
    directLink.substring(0, 5) == "http:" ||
    directLink.substring(0, 6) == "https:" ||
    directLink.substring(0, 7) == "http://" ||
    directLink.substring(0, 8) == "https://"
  ) {
    iconSourceLink = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${directLink.trim()}&size=48`;
    iconSourceLinkNoSize = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${directLink.trim()}`;
  } else {
    iconSourceLink = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${directLink.trim()}&size=48`;
    iconSourceLinkNoSize = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${directLink.trim()}`;
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <>
      {haveQueryExisting ? (
        <>
          <UpdateTab
            // When you click on a query, a tab will popup from the right side of the screen that allows you to update the query
            setKeepOpacityNormalOnPopupState={
              props.setKeepOpacityNormalOnPopupState
            }
            setImageIsValidState={setImageIsValidState}
            sethaveQueryExistingState={sethaveQueryExistingState} // This state (created in the PmDashboard component) will erase the whole query, (this component), from the UI (including the update tab)
            setPopupActiveState={props.setPopupActiveState}
            popupActiveState={props.popupActiveState} // We wont let the tab be opened if this is true (meaning there is some other popup open)
            linkReturnsValidIcon={imageIsValidState}
            iconLinkNoSize={iconSourceLinkNoSize}
            email={email}
            password={pass}
            random={random}
            name={name}
            directLink={directLink}
            isLink={isLink}
            showTabState={showUpdateTabState}
            queryDocumentID={objectOfQueryToRender[1]}
            setTabState={(boolean) => {
              setShowUpdateTabState(boolean);
            }}
            setDirectLinkState={async (newState) => {
              setDirectLinkState(newState);
            }}
            setEmailState={async (newState) => {
              setEmailState(newState);
            }}
            setIsLinkState={async (newState) => {
              setIsLinkState(newState);
            }}
            setPassState={async (newState) => {
              setPassState(newState);
            }}
            setNameState={async (newState) => {
              setNameState(newState);
            }}
            setRandomState={async (newState) => {
              setRandomState(newState);
            }}
            hashBeingUsedToEncrypt={
              props.hashBeingUsedToEncrypt
            } /* This prop has been passed down all the way from
          Pm.js to PmDashboad.js to QuerySlot.js (this file) and will be passed down to UpdateTab.js (This will be sent
          to the cloud function that encrypts and updates all the new updated user data. It will be used to encrypt all the new info) */
          />

          <div
            className={classes.queryItem}
            onClick={() => {
              if (!props.popupActiveState) {
                setShowUpdateTabState(true);
                props.setKeepOpacityNormalOnPopupState(true);
                props.setPopupActiveState(true);
              }
            }}
          >
            <div className={classes.queryContentWrapper}>
              {isLink ? (
                /* If the link provided does NOT return a favicon, then we will render a box with the first letter of the 
            query name in it as a replacement for the image.
            
            If it does provide an icon, we just use that instead */

                <>
                  {imageIsValidState ? (
                    <img
                      src={iconSourceLink}
                      style={{
                        display: "flex",
                        borderRadius: "1vh",
                        alignSelf: "center",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        borderRadius: "1vh",
                        alignSelf: "center",
                        cursor: "pointer",
                        justifyContent: "center",
                        padding:
                          name.charAt(1).trim() == "" ? ".5% 1.2%" : ".5% .5%",
                        backgroundColor:
                          listOfColors[
                            Math.floor(Math.random() * listOfColors.length)
                          ],
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      >
                        {`${name.charAt(0).toUpperCase()}${name
                          .charAt(1)
                          .toLowerCase()}`}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    borderRadius: "1vh",
                    alignSelf: "center",
                    cursor: "pointer",
                    justifyContent: "center",
                    padding:
                      name.charAt(1).trim() == "" ? ".5% 1.2%" : ".5% .5%",
                    backgroundColor:
                      listOfColors[
                        Math.floor(Math.random() * listOfColors.length)
                      ],
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: "bolder",
                      fontSize: "1.5rem",
                    }}
                  >
                    {`${name.charAt(0).toUpperCase()}${name
                      .charAt(1)
                      .toLowerCase()}`}
                  </div>
                </div>
              )}

              <div className={classes.queryNameAndEmail}>
                <span className={classes.queryName}>
                  {capitalizeFirstLetter(name)}
                </span>
                <span className={classes.queryEmail}>{email}</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default QuerySlot;
