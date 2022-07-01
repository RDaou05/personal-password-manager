import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/Signup/Signup.js";
import LoginPage from "./pages/Login/Login.js";
import AppSelector from "./pages/AppSelector/AppSelector.js";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/appselector" element={<AppSelector />}></Route>
      </Routes>
    </div>
  );
}

export default App;
