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
        <a href="#">Github</a>
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
