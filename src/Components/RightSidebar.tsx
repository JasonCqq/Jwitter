import React from "react";
import "../Styles/RightSidebar.scss";
import { FcGoogle } from "react-icons/fc";

function RightSidebar() {
  return (
    <div className="right-sidebar">
      <div className="signup-container">
        <h1>New to Jwitter?</h1>
        <p>Sign up now to get your own personalized timeline!</p>
        <button>
          {" "}
          <FcGoogle size={20} /> Sign up with Google
        </button>
        <button>Create account</button>
        <button>
          <strong>Sign In</strong>
        </button>
        <p>
          By signing up, you agree to the <strong>Terms of Service</strong> and{" "}
          <strong>Privacy Policy</strong>, including <strong>Cookie Use</strong>
          .
        </p>
      </div>

      <div className="footer-notes">
        <div>
          <p>Terms of Service • </p>
          <p>Privacy Policy • </p>
          <p>Cookie Policy </p>
        </div>
        <div>
          <p>Accessiblity • </p>
          <p>Ads Info • </p>
          <p>About Us • </p>
          <p>More...</p>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
