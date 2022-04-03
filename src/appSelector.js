document.getElementById("takeToPMButton").addEventListener("click", () => {
  setTimeout(() => {
    document.getElementById("takeToPMLinkHidden").click();
  }, 500);
});

document.getElementById("takeToLockerButton").addEventListener("click", () => {
  setTimeout(() => {
    document.getElementById("takeToLockerLinkHidden").click();
  }, 700);
});
