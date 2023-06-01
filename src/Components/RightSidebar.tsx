import React, { useContext, useState } from "react";
import "../Styles/RightSidebar.scss";
import { FcGoogle } from "react-icons/fc";
import {
  useAuthentication,
  signInWindow,
  createAccountWindow,
} from "./sharedFunctions";
import { useGlobalContext } from "./Context";
import { LogInContext } from "./Routeswitch";

const RightSidebar = () => {
  const { googleSignIn } = useAuthentication();
  const { user } = useGlobalContext();

  const {
    handleCreateAccountClick,
    handleSignInClick,
    isCreateAccountOpen,
    isSignInOpen,
  } = useContext(LogInContext);

  const newToJwitter = () => {
    return (
      <>
        {isCreateAccountOpen && !isSignInOpen && createAccountWindow()}
        {isSignInOpen && !isCreateAccountOpen && signInWindow()}

        <div className="signup-container">
          <h1>New to Jwitter?</h1>
          <p>Sign up now to get your own personalized timeline!</p>
          <button onClick={() => googleSignIn()}>
            <FcGoogle size={20} /> Sign in with Google
          </button>
          <button onClick={handleCreateAccountClick}>Create account</button>
          <button onClick={handleSignInClick}>
            <strong>Sign In</strong>
          </button>
          <p>
            By signing up, you agree to the <strong>Terms of Service</strong>{" "}
            and <strong>Privacy Policy</strong>, including{" "}
            <strong>Cookie Use</strong>.
          </p>
        </div>

        <div className="footer-notes">
          <div>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
            <p>Cookie Policy</p>
          </div>
          <div>
            <p>Accessibility</p>
            <p>Ads Info</p>
            <p>About Us</p>
            <p>More...</p>
          </div>
        </div>
      </>
    );
  };

  const signedIntoJwitter = () => {
    return (
      <>
        <h1>Trending</h1>
      </>
    );
  };

  return (
    <div className="right-sidebar">
      {user ? signedIntoJwitter() : newToJwitter()}
    </div>
  );
};

export default RightSidebar;
