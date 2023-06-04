import React from "react";
import "../Styles/Settings.scss";
import { CSSTransitionGroup } from "react-transition-group";

const Settings = () => {
  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="main-settings">
        <h1>Your Account Settings</h1>
        <div id="settings-wrapper">
          <div className="settings-container">
            <div className="settings-item">
              <h3>Username</h3>
              <p>@temp-handle01</p>
            </div>
            <div className="settings-item">
              <h3>Phone</h3>
              <p>+415850021</p>
            </div>
            <div className="settings-item">
              <h3>Email</h3>
              <p>temporary123@gmail.com</p>
            </div>
            <div className="settings-item">
              <h3>Account Creation</h3>
              <p>Sep 5, 2022, 10:12:43 PM</p>
            </div>
            <div className="settings-item">
              <h3>Change Your Password</h3>
              <p>Change your password at any time</p>
            </div>
            <div className="settings-item">
              <h3>Contact Jwitter</h3>
              <p>Email Jwitter for support</p>
            </div>
            <div className="settings-item">
              <h3>Deactivate your account</h3>
              <p>Close your account</p>
            </div>
          </div>
        </div>
      </div>
    </CSSTransitionGroup>
  );
};

export default Settings;
