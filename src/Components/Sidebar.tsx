import React, { useEffect, useState } from "react";
import "../Styles/Sidebar.scss";
import {
  IoNotificationsOutline,
  IoHomeOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { AiOutlineMessage, AiOutlineGithub } from "react-icons/ai";
import { FaTwitter } from "react-icons/fa";
import { useGlobalContext } from "./Context";
import { signOut, getAuth } from "../Firebase.js";

function Sidebar() {
  const { user, setUser } = useGlobalContext();

  useEffect(() => {
    console.log(user);
  }, []);

  const signOutUser = async () => {
    signOut(getAuth()).then(() => {
      setUser(null);
      console.log(user);
    });
  };

  const profile = () => {
    return (
      <>
        <div id="profile-nav">
          <img
            className="profile-avatar"
            src={user?.photoURL ?? ""}
            alt="User Avatar"
          ></img>
          <p>
            {user?.displayName} <br></br>@temp-handle1
          </p>
        </div>

        <div className="signOutContainer">
          <button onClick={() => signOutUser()} className="signOutButton">
            Sign Out
          </button>
        </div>
      </>
    );
  };

  return (
    <nav id="sidebar">
      <div>
        <FaTwitter size={30} color="aquamarine" />
      </div>

      <div id="home-nav">
        <IoHomeOutline size={30} />
        <a href="#">Home</a>
      </div>

      <div id="notifications-nav">
        <IoNotificationsOutline size={30} />
        <a href="#">Notifications</a>
      </div>

      <div id="messages-nav">
        <AiOutlineMessage size={30} />
        <a href="#">Messages</a>
      </div>

      <div id="settings-nav">
        <IoSettingsOutline size={30} />
        <a href="#">Settings</a>
      </div>

      <div id="github-nav">
        <AiOutlineGithub size={30} />
        <a
          href="https://github.com/jason21715/Jwitter"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
      </div>

      <button id="tweetButton">Publish a Tweet</button>

      {user ? profile() : null}
    </nav>
  );
}

export default Sidebar;
