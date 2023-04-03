import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BottomFooter } from "./components/BottomFooter";
import { Nav } from "./components/Nav";
import Settings from "./components/Settings";
import Trade from "./components/Trade";

import { ConfigureStore } from "./data/ConfigureStore";
import env from "react-dotenv";

const store = ConfigureStore();


function App() {
  const [show, setShow] = React.useState(false)
  const onClose = () => {
    setShow(false)
  }
  return (
    <GoogleOAuthProvider clientId={env.GOOGLE_LOGIN_CREDENTIAL}>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<div className="z-0 bg-[#192134]">
            <Nav setShow={setShow} show={show} onClose={onClose} />
            <div className="h-[80vh]">
            </div>
            <BottomFooter />
          </div>} />
          <Route path="/dashboard" element={<div className="z-0 bg-[#192134]">
            <Nav setShow={setShow} show={show} onClose={onClose} />
            <Trade setShow={setShow} />
            <BottomFooter />
          </div>} />
          <Route path="/settings" element={<div className="z-0 bg-[#192134]">
            <Nav setShow={setShow} show={show} onClose={onClose} />
            <Settings setShow={setShow} show={show} onClose={onClose} />
            <BottomFooter />
          </div>} />
        </Routes>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;