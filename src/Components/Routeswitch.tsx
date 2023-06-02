import React, { useState, createContext, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import SignupFooter from "./SignupFooter";
import Loading from "./Loading";
import { CreateAccountWindow, SignInWindow } from "./sharedFunctions";
import Notices from "./Notices";
import Profile from "./Profile";
import Settings from "./Settings";
import Messages from "./Messages";

export const LogInContext = createContext({
  isLoading: false,
  createWindowOpen: false,
  signIn: false,
  toggleLoading: () => {},
  toggleWindow: () => {},
  toggleSignIn: () => {},
  closeWindows: () => {},
});

const RouteSwitch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [createWindowOpen, setCreateWindowOpen] = useState(false);
  const [signIn, setSignIn] = useState(false);

  const toggleLoading = () => {
    setIsLoading((prevLoading) => !prevLoading);
  };

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
          isLoading,
          createWindowOpen,
          signIn,
          toggleLoading,
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
            <Route path="/notices" element={<Notices />}></Route>
            <Route path="/messages" element={<Messages />}></Route>
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
