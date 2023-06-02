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
        <h1>Settings</h1>
      </div>
    </CSSTransitionGroup>
  );
};

export default Settings;
