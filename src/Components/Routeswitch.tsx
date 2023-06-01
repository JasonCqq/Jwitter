import React, { useState, createContext } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import SignupFooter from "./SignupFooter";

export const LogInContext = createContext({
  isCreateAccountOpen: false,
  isSignInOpen: false,
  handleCreateAccountClick: () => {},
  handleSignInClick: () => {},
  closeBothWindows: () => {},
});

const RouteSwitch = () => {
  const [isCreateAccountOpen, setCreateAccountOpen] = useState(false);
  const [isSignInOpen, setSignInOpen] = useState(false);

  const handleCreateAccountClick = () => {
    setCreateAccountOpen(true);
    setSignInOpen(false);
  };

  const handleSignInClick = () => {
    setSignInOpen(true);
    setCreateAccountOpen(false);
  };

  const closeBothWindows = () => {
    setSignInOpen(false);
    setCreateAccountOpen(false);
  };

  return (
    <>
      <LogInContext.Provider
        value={{
          isCreateAccountOpen,
          isSignInOpen,
          handleCreateAccountClick,
          handleSignInClick,
          closeBothWindows,
        }}
      >
        <HashRouter>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />}></Route>
          </Routes>
          <RightSidebar />
          <SignupFooter />
        </HashRouter>
      </LogInContext.Provider>
    </>
  );
};

export default RouteSwitch;
