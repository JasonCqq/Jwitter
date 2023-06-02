import React, { useEffect, useContext } from "react";
import "../Styles/Sidebar.scss";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import {
  AiOutlineMessage,
  AiOutlineGithub,
  AiOutlineNotification,
} from "react-icons/ai";
import { FaTwitter } from "react-icons/fa";
import { useGlobalContext } from "./AuthContext";
import { signOut, getAuth } from "../Firebase.js";
import { LogInContext } from "./Routeswitch";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { user, setUser } = useGlobalContext();
  const { isLoading, toggleLoading } = useContext(LogInContext);

  const signOutUser = async () => {
    signOut(getAuth()).then(() => {
      setUser(null);
    });
  };

  useEffect(() => {
    toggleLoading();
    setTimeout(() => {
      toggleLoading();
    }, 1000);
  }, []);

  const profile = () => {
    return (
      <>
        <div id="profile-nav">
          <Link to="/profile">
            <img
              className="profile-avatar"
              src={user?.photoURL ?? ""}
              alt="User Avatar"
            ></img>
            <p>
              {user?.displayName} <br></br>{" "}
              <span className="user-handle">@temp-handle1</span>
            </p>
          </Link>
        </div>

        <div className="signOutContainer">
          <button onClick={() => signOutUser()} className="signOutButton">
            Sign Out
          </button>
        </div>
      </>
    );
  };

  const sideBarContent = () => {
    return (
      <nav id="sidebar">
        <div>
          <FaTwitter size={30} color="aquamarine" />
        </div>

        <div className="sidebarItem">
          <Link to="/">
            {" "}
            <IoHomeOutline size={30} />
            <span>Home</span>
          </Link>
        </div>

        <div className="sidebarItem">
          <Link to="/notices">
            <AiOutlineNotification size={30} />
            <span>Notices</span>
          </Link>
        </div>

        <div className="sidebarItem">
          <Link to="/messages">
            <AiOutlineMessage size={30} />
            <span>Messages</span>
          </Link>
        </div>

        <div className="sidebarItem">
          <Link to="/settings">
            <IoSettingsOutline size={30} />
            <span>Settings</span>
          </Link>
        </div>

        <div className="sidebarItem">
          <AiOutlineGithub size={30} />
          <a
            href="https://github.com/jason21715/Jwitter"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </div>

        <button id="tweetButton">Tweet</button>

        {user ? profile() : null}
      </nav>
    );
  };

  return <>{isLoading ? null : sideBarContent()}</>;
};

export default Sidebar;
