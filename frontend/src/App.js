import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BottomFooter } from "./components/BottomFooter";
import { Nav } from "./components/Nav";
import Trade from "./components/Trade";

import { ConfigureStore } from "./data/ConfigureStore";

const store = ConfigureStore();


function App() {
  const [show, setShow] = React.useState(false)
  const onClose = () => {
    // console.log('close')
    setShow(false)
  }
  return (
    <GoogleOAuthProvider clientId="511025188680-lp5dp9v97lqm3jpc90rvndoicsi6e9oj.apps.googleusercontent.com">
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<div className="z-0 bg-[#192134]">
            <Nav setShow={setShow} show={show} onClose={onClose} />
            <BottomFooter />
          </div>} />
          <Route path="/dashboard" element={<div className="z-0 bg-[#192134]">
            <Nav />
            <Trade setShow={setShow} />
            <BottomFooter />
          </div>} />
        </Routes>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;