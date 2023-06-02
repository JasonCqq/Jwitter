import React from "react";
import "../Styles/Profile.scss";
import { CSSTransitionGroup } from "react-transition-group";

const Profile = () => {
  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="main-profile">
        <h1> PROFILE PAGE</h1>;
      </div>
    </CSSTransitionGroup>
  );
};

export default Profile;
