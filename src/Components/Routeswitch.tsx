import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import SignupFooter from "./SignupFooter";

const RouteSwitch = () => {
  return (
    <HashRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
      <RightSidebar />
      <SignupFooter />
    </HashRouter>
  );
};

export default RouteSwitch;
