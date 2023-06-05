import React from "react";
import { ClipLoader } from "react-spinners";
import "../Styles/Loading.scss";
import { CSSTransitionGroup } from "react-transition-group";

const Loading = () => {
  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={false}
      transitionAppearTimeout={1000}
      transitionEnter={false}
      transitionLeave={true}
    >
      <div id="loading-screen">
        <ClipLoader
          className="loading-spinner"
          size={60}
          color="#7856ff"
          loading={true}
        />
      </div>
    </CSSTransitionGroup>
  );
};

export default Loading;
