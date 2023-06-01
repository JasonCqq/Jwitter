import React from "react";
import "../Styles/SignupFooter.scss";
import { useGlobalContext } from "./Context";

function SignupFooter() {
  const { user } = useGlobalContext();

  function showFooter() {
    return (
      <div className="footer-bar">
        <div className="footer-text">
          <h1>Don&apos;t miss what&apos;s happening</h1>
          <p>People on Jwitter are the first to know</p>
        </div>

        <div className="footer-buttons">
          <button className="footer-login">Log In</button>
          <button className="footer-signup">Sign Up</button>
        </div>
      </div>
    );
  }

  return <>{user ? null : showFooter()}</>;
}

export default SignupFooter;
