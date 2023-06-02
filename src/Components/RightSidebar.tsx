import React, { useContext } from "react";
import "../Styles/RightSidebar.scss";
import { FcGoogle } from "react-icons/fc";
import { useAuthentication } from "./sharedFunctions";
import { LogInContext } from "./Routeswitch";
import { useGlobalContext } from "./AuthContext";

const RightSidebar = () => {
  const { googleSignIn } = useAuthentication();
  const { toggleWindow, toggleSignIn } = useContext(LogInContext);
  const { user } = useGlobalContext();

  const signUp = () => {
    return (
      <div className="signup-container">
        <h1>New to Jwitter?</h1>
        <p>Sign up now to get your own personalized timeline!</p>
        <button onClick={() => googleSignIn()}>
          <FcGoogle size={20} /> Sign in with Google
        </button>
        <button onClick={() => toggleWindow()}>Create account</button>
        <button onClick={() => toggleSignIn()}>
          <strong>Sign In</strong>
        </button>
        <p>
          By signing up, you agree to the <strong>Terms of Service</strong> and{" "}
          <strong>Privacy Policy</strong>, including <strong>Cookie Use</strong>
          .
        </p>
      </div>
    );
  };

  const trending = () => {
    return (
      <div className="trending-tab">
        <div className="search-bar">
          <input placeholder="Search Jwitter..."></input>
        </div>

        <div className="recentevents-tab">
          <h1>What&apos;s happening</h1>
          <div>
            <h2>Electronics</h2>
            <p>12.5k Tweets</p>
          </div>
          <div>
            <h2>Gaming</h2>
            <p>12.5k Tweets</p>
          </div>
          <div>
            <h2>Anime</h2>
            <p>12.5k Tweets</p>
          </div>
          <div>
            <h2>Movie</h2>
            <p>12.5k Tweets</p>
          </div>
          <div>
            <h2>John Doe</h2>
            <p>12.5k Tweets</p>
          </div>
          <div>
            <h2>Breaking News</h2>
            <p>12.5k Tweets</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="right-sidebar">
      {user ? trending() : signUp()}

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
    </div>
  );
};

export default RightSidebar;
