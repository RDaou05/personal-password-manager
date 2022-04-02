const gui = require("nw.gui");
let win = gui.Window.get();
win.setResizable(true);
win.on("resize", function (w, h) {
  console.log("resized to", w, h);
});
win.unmaximize();
win.leaveFullscreen();
win.resizeTo(1522, 945);
