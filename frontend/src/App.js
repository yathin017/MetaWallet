import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BottomFooter } from "./components/BottomFooter";
import { Nav } from "./components/Nav";
import Trade from "./components/Trade";

import { ConfigureStore } from "./data/ConfigureStore";

const store = ConfigureStore();


function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<div className="z-0">
          <Nav />
         
        </div>} />
        <Route path="/dashboard" element={<div className="z-0">
          <Nav />
          <Trade />
          <BottomFooter />
        </div>} />
      </Routes>
    </Provider>
  );
}

export default App;