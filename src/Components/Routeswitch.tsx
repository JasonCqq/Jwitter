import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Sidebar from "./Sidebar";

const RouteSwitch = () => {
  return (
    <HashRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </HashRouter>
  );
};

export default RouteSwitch;
