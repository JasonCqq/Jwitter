import React, { useState } from "react";
import "../Styles/RightSidebar.scss";
import { FcGoogle } from "react-icons/fc";
import {
  useAuthentication,
  signInWindow,
  createAccountWindow,
} from "./sharedFunctions";
import { useGlobalContext } from "./Context";

function RightSidebar() {
  const { googleSignIn } = useAuthentication();
  const [isCreateAccountOpen, setCreateAccountOpen] = useState(false);
  const [isSignInOpen, setSignInOpen] = useState(false);
  const { user } = useGlobalContext();

  const handleCreateAccountClick = () => {
    setCreateAccountOpen(true);
    setSignInOpen(false);
  };

  const handleSignInClick = () => {
    setSignInOpen(true);
    setCreateAccountOpen(false);
  };

  const newToJwitter = () => {
    return (
      <>
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

        {isCreateAccountOpen && !isSignInOpen && createAccountWindow()}
        {isSignInOpen && !isCreateAccountOpen && signInWindow()}
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
}

export default RightSidebar;
