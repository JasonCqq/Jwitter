import React, { useState, createContext } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import SignupFooter from "./SignupFooter";
import { CreateAccountWindow, SignInWindow } from "./sharedFunctions";
import Profile from "./Profile";
import Settings from "./Settings";

export const LogInContext = createContext({
  createWindowOpen: false,
  signIn: false,
  toggleWindow: () => {},
  toggleSignIn: () => {},
  closeWindows: () => {},
});

const RouteSwitch = () => {
  const [createWindowOpen, setCreateWindowOpen] = useState(false);
  const [signIn, setSignIn] = useState(false);

  const toggleWindow = () => {
    setCreateWindowOpen((prevWindow) => !prevWindow);
  };

  const toggleSignIn = () => {
    setSignIn((prevSignIn) => !prevSignIn);
  };

  const closeWindows = () => {
    setSignIn(false);
    setCreateWindowOpen(false);
  };

  return (
    <>
      <LogInContext.Provider
        value={{
          createWindowOpen,
          signIn,
          toggleWindow,
          toggleSignIn,
          closeWindows,
        }}
      >
        <HashRouter>
          {createWindowOpen && !signIn ? <CreateAccountWindow /> : null}
          {!createWindowOpen && signIn ? <SignInWindow /> : null}
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Routes>
          <RightSidebar />
          <SignupFooter />
        </HashRouter>
      </LogInContext.Provider>
    </>
  );
};

export default RouteSwitch;
