import React, { useContext } from "react";
import "../Styles/SignupFooter.scss";
import { useGlobalContext } from "./AuthContext";
import { LogInContext } from "./Routeswitch";

const SignupFooter = () => {
  const { user } = useGlobalContext();
  const { toggleWindow, toggleSignIn } = useContext(LogInContext);

  function showFooter() {
    return (
      <div className="footer-bar">
        <div className="footer-text">
          <h1>Don&apos;t miss what&apos;s happening</h1>
          <p>People on Jwitter are the first to know</p>
        </div>

        <div className="footer-buttons">
          <button className="footer-login" onClick={() => toggleSignIn()}>
            Log In
          </button>
          <button className="footer-signup" onClick={() => toggleWindow()}>
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return <>{user ? null : showFooter()}</>;
};

export default SignupFooter;
