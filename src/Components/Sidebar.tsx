import React from "react";
import "../Styles/Sidebar.scss";
import {
  IoNotificationsOutline,
  IoHomeOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { AiOutlineMessage, AiOutlineGithub } from "react-icons/ai";
import { FaTwitter } from "react-icons/fa";

function Sidebar() {
  return (
    <nav id="sidebar">
      <div>
        <FaTwitter size={30} color="aquamarine" />
      </div>

      <div id="home-nav">
        <IoHomeOutline size={30} />
        <p>Home</p>
      </div>

      <div id="notifications-nav">
        <IoNotificationsOutline size={30} />
        <p>Notifications</p>
      </div>

      <div id="messages-nav">
        <AiOutlineMessage size={30} />
        <p>Messages</p>
      </div>

      <div id="settings-nav">
        <IoSettingsOutline size={30} />
        <p>Settings</p>
      </div>

      <div id="github-nav">
        <AiOutlineGithub size={30} />
        <p>Github</p>
      </div>

      <button id="tweetButton">Tweet</button>

      <div id="profile-nav">
        <span></span>
        <p>Temp Name</p>
      </div>
    </nav>
  );
}

export default Sidebar;
