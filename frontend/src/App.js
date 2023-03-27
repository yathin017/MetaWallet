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
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<div className="z-0">
          <Nav setShow={setShow} show={show} onClose={onClose} />
        </div>} />
        <Route path="/dashboard" element={<div className="z-0">
          <Nav />
          <Trade setShow={setShow} />
          <BottomFooter />
        </div>} />
      </Routes>
    </Provider>
  );
}

export default App;