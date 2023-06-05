import React from "react";
import "../Styles/Bookmarks.scss";
import { useGlobalContext } from "./AuthContext";

const Bookmarks = () => {
  const { user } = useGlobalContext();

  const notLoggedIn = () => {
    if (!user) {
      return (
        <div className="main-bookmarks">
          <div className="info-bar">
            <h1>BOOKMARKS</h1>
          </div>

          <div className="bookmarks-overlay">
            <p>Please log in or create an account before using this feature</p>
          </div>
        </div>
      );
    }
  };

  return <>{user ? null : notLoggedIn()}</>;
};

export default Bookmarks;
