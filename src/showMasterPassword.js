try {
  const togglePassword = document.querySelector("#eye");
  const password = document.querySelector("#inpBox");

  togglePassword.addEventListener("click", function (e) {
    // toggle the type attribute
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    // toggle the eye slash icon
    this.classList.toggle("fa-eye-slash");
  });
} catch {}

try {
  document.querySelector("#eye").addEventListener("click", function (e) {
    // toggle the type attribute
    const type =
      document.querySelector("#passBox").getAttribute("type") === "password"
        ? "text"
        : "password";
    document.querySelector("#passBox").setAttribute("type", type);
    // toggle the eye slash icon
    this.classList.toggle("fa-eye-slash");
  });
} catch {}

try {
  document.querySelector("#eye").addEventListener("click", function (e) {
    // toggle the type attribute
    const type =
      document.querySelector("#passwordInput").getAttribute("type") ===
      "password"
        ? "text"
        : "password";
    document.querySelector("#passwordInput").setAttribute("type", type);
    // toggle the eye slash icon
    this.classList.toggle("fa-eye-slash");
  });
} catch {}

try {
  document.getElementById("emailInpBox").addEventListener("keydown", (evt) => {
    if (evt["keyCode"] === 13) {
      document.getElementById("unlockButton").click();
    }
  });
} catch {}

try {
  document.getElementById("inpBox").addEventListener("keydown", (evt) => {
    if (evt["keyCode"] === 13) {
      document.getElementById("unlockButton").click();
    }
  });
} catch {}

try {
  document.getElementById("passBox").addEventListener("keydown", (evt) => {
    if (evt["keyCode"] === 13) {
      document.getElementById("unlockButton").click();
    }
  });
} catch {}
