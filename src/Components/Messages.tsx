import React from "react";
import "../Styles/Messages.scss";
import { CSSTransitionGroup } from "react-transition-group";

const Messages = () => {
  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="main-messages">
        <h1>MESSAGES</h1>
      </div>
    </CSSTransitionGroup>
  );
};

export default Messages;
