import React from "react";
import "../Styles/Notices.scss";
import { CSSTransitionGroup } from "react-transition-group";

const Notices = () => {
  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="main-notices">
        <h1>NOTICE PAGE</h1>
      </div>
    </CSSTransitionGroup>
  );
};

export default Notices;
