import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BottomFooter } from "./components/BottomFooter";
import { DashboardLanding } from "./components/Dashboard/DashboardLanding";
import { LandingPage } from "./components/LandingPage";
import { Nav } from "./components/Nav";

function App() {
  return (
      <Routes>
        <Route path="/" element={<div className="z-0">
          <Nav />
          <LandingPage />
          <BottomFooter />
        </div>} />
        <Route path="/dashboard" element={<div className="z-0">
          <Nav />
          <DashboardLanding />
          <BottomFooter />
        </div>} />
      </Routes>
  );
}

export default App;