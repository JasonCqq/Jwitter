import React, { useContext, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { LogInContext } from "./Routeswitch";
import "../Styles/Loading.scss";

const Loading = () => {
  const { isLoading } = useContext(LogInContext);
  return (
    <div className="sweet-loading">
      <ClipLoader
        color="aquamarine"
        loading={isLoading}
        size={50}
        speedMultiplier={1.5}
        aria-label="Loading Spinner"
        data-testid="loader"
        className="loader"
      />
    </div>
  );
};

export default Loading;
