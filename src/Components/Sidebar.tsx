import React, { useEffect, useState, useRef, createContext } from "react";
import "../Styles/Sidebar.scss";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { AiOutlineMessage, AiOutlineGithub } from "react-icons/ai";
import { FaTwitter } from "react-icons/fa";
import { useGlobalContext } from "./AuthContext";
import { signOut, getAuth } from "../Firebase.js";
import { Link } from "react-router-dom";
import autoAnimate from "@formkit/auto-animate";
import TweetPopUp from "./TweetPopUp";
import { FaRegBell } from "react-icons/fa";
import { getFirestore, app, doc, getDoc } from "../Firebase.js";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { BsBookmark } from "react-icons/bs";

export const TweetWindowContext = createContext({
  tweetWindow: true,
  openTweetWindow: () => {},
});

const Sidebar = () => {
  const { user, setUser } = useGlobalContext();
  const [username, setUsername] = useState("");
  const [pfp, setPfp] = useState("");

  const getUserData = async () => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", `${user?.uid}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUsername(userSnap.data().settings.username);
      setPfp(userSnap.data().settings.photoURL);
    } else {
      return;
    }
  };

  useEffect(() => {
    if (user) {
      getUserData();
    }
  }, [user]);

  const [tweetWindow, setTweetWindow] = useState(false);

  //Tweet
  const openTweetWindow = () => {
    setTweetWindow((prevTweetWindow) => !prevTweetWindow);
  };

  const signOutUser = async () => {
    signOut(getAuth()).then(() => {
      setUser(null);
    });
  };

  //Profile Dropdown
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
              src={
                pfp ||
                "https://firebasestorage.googleapis.com/v0/b/jwitter-c2e99.appspot.com/o/abstract-user-flat-4.svg?alt=media&token=1a86b625-7555-4b52-9f0f-0cd89bffeeb6"
              }
              alt="User Avatar"
            ></img>
            <p>{username}</p>
          </div>

          {reveal && (
            <div className="profile-buttons">
              <MdLogout size={30} />
              <button onClick={() => signOutUser()} className="signOutButton">
                Sign Out
              </button>
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
          <Link to="/profile">
            <CgProfile size={30} />
            <span>Profile</span>
          </Link>
        </div>

        <div className="sidebarItem">
          <Link to="/bookmarks">
            <BsBookmark size={30} />
            <span>Bookmarks</span>
          </Link>
        </div>

        <div className="sidebarItem">
          <Link to="/settings">
            <IoSettingsOutline size={30} />
            <span>Settings</span>
          </Link>
        </div>

        <div className="sidebarItem blocked">
          <a href="#">
            <FaRegBell size={30} />
            <span>Notifications</span>
          </a>
        </div>

        <div className="sidebarItem blocked">
          <a href="#">
            <AiOutlineMessage size={30} />
            <span>Messages</span>
          </a>
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

        {user ? (
          <button id="tweetButton" onClick={() => openTweetWindow()}>
            Tweet
          </button>
        ) : null}

        {user ? profile() : null}
      </nav>
    );
  };

  return (
    <TweetWindowContext.Provider value={{ tweetWindow, openTweetWindow }}>
      {sideBarContent()}
      {tweetWindow ? <TweetPopUp /> : null}
    </TweetWindowContext.Provider>
  );
};

export default Sidebar;
