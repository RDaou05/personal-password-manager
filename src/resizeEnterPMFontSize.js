function startInter() {
  const firstFS =
    (3.9472295514511873350923482849604 / 100) *
    document.getElementById("setupMasterPasswordScreen").offsetWidth;
  const firstBML =
    (2.1205357142857142857142857142857 / 100) *
    document.getElementById("setupMasterPasswordScreen").offsetWidth;
  console.log("new is ", firstFS);
  // document.getElementById("back").style.marginLeft = `${firstBML}rem`;
  // document.getElementById("back").style.fontSize = `${firstFS - 10}px`;
  console.log("new is ", firstBML, "rem");
  console.log(
    "width is ",
    document.getElementById("setupMasterPasswordScreen").offsetWidth
  );
}

win.on("resize", function (w, h) {
  startInter();
});

startInter();
