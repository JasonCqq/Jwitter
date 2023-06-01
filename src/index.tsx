import React from "react";
import ReactDOM from "react-dom/client";
import "./Styles/index.scss";
import RouteSwitch from "./Components/Routeswitch";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouteSwitch />
  </React.StrictMode>
);
