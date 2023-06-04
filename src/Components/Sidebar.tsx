import React, { useEffect, useState, useRef } from "react";
import "../Styles/Sidebar.scss";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import {
  AiOutlineMessage,
  AiOutlineGithub,
  AiOutlineNotification,
} from "react-icons/ai";
import { FaTwitter } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import { useGlobalContext } from "./AuthContext";
import { signOut, getAuth } from "../Firebase.js";
import { Link } from "react-router-dom";
import autoAnimate from "@formkit/auto-animate";

const Sidebar = () => {
  const { user, setUser } = useGlobalContext();

  const signOutUser = async () => {
    signOut(getAuth()).then(() => {
      setUser(null);
    });
  };

  const [reveal, setReveal] = useState(false);
  const dropdown = useRef(null);

  useEffect(() => {
    dropdown.current && autoAnimate(dropdown.current);
  }, [reveal]);

  const show = () => setReveal(!reveal);

  const profile = () => {
    return (
      <>
        <div className="profile-wrapper" ref={dropdown} onClick={show}>
          <div id="profile-nav">
            <img
              className="profile-avatar"
              src={user?.photoURL ?? ""}
              alt="User Avatar"
            ></img>
            <div>
              <p>
                {user?.displayName} <br></br> @temp-handle1
              </p>
            </div>
          </div>

          {reveal && (
            <div>
              <button onClick={() => signOutUser()} className="signOutButton">
                Sign Out
              </button>
              <Link to="/profile" className="signOutButton">
                Profile
              </Link>
            </div>
          )}
        </div>
      </>
    );
  };

  const sideBarContent = () => {
    return (
      <nav id="sidebar">
        <div>
          <FaTwitter size={30} color="#7856FF" />
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
          <a href="#">
            <BsBookmark size={30} />
            <span>Bookmarks</span>
          </a>
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

  return <>{sideBarContent()}</>;
};

export default Sidebar;
