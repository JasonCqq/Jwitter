import React, { useContext } from "react";
import "../Styles/SignupFooter.scss";
import { useGlobalContext } from "./Context";
import { createAccountWindow, signInWindow } from "./sharedFunctions";
import { LogInContext } from "./Routeswitch";

const SignupFooter = () => {
  const { user } = useGlobalContext();
  const {
    handleCreateAccountClick,
    handleSignInClick,
    isCreateAccountOpen,
    isSignInOpen,
  } = useContext(LogInContext);

  function showFooter() {
    return (
      <div className="footer-bar">
        <div className="footer-text">
          <h1>Don&apos;t miss what&apos;s happening</h1>
          <p>People on Jwitter are the first to know</p>
        </div>

        <div className="footer-buttons">
          <button onClick={() => handleSignInClick()} className="footer-login">
            Log In
          </button>
          <button
            onClick={() => handleCreateAccountClick()}
            className="footer-signup"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {" "}
      {isCreateAccountOpen && !isSignInOpen && createAccountWindow()}
      {isSignInOpen && !isCreateAccountOpen && signInWindow()}
      {user ? null : showFooter()}
    </>
  );
};

export default SignupFooter;
