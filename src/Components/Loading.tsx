import React from "react";
import { ClipLoader } from "react-spinners";
import "../Styles/Loading.scss";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const Loading = () => {
  return (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
        <div id="loading-screen">
          <ClipLoader
            className="loading-spinner"
            size={60}
            color="#7856ff"
            loading={true}
          />
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Loading;
