import React, { useEffect, useState } from "react";
import "../Styles/Settings.scss";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useGlobalContext } from "./AuthContext";
import { getFirestore, app, doc, getDoc } from "../Firebase.js";

type UserData = {
  settings: {
    created: string;
    email: string;
    name: string;
    phone: string;
    photoURL: string;
    username: string;
  };
};

const Settings = () => {
  const { user } = useGlobalContext();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loaded, setLoaded] = useState(false);

  const getUserData = async () => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", `${user?.uid}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserData(userSnap.data() as UserData);
    } else {
      return;
    }
  };

  useEffect(() => {
    getUserData();
  }, [user]);

  useEffect(() => {
    setLoaded(true);
  }, [userData]);

  const displayUserData = () => {
    return (
      <>
        <div className="settings-item">
          <h3>Name</h3>
          <p>
            {" "}
            {user?.displayName
              ? user?.displayName
              : "Please set your name in your Google Account"}
          </p>
        </div>

        <div className="settings-item">
          <h3>Username</h3>
          <p>{userData?.settings.username}</p>
        </div>
        <div className="settings-item">
          <h3>Phone</h3>
          <p>
            {userData?.settings.phone === ""
              ? "Please set your phone in your Google Account"
              : userData?.settings.phone}
          </p>
        </div>
        <div className="settings-item">
          <h3>Email</h3>
          <p>
            {" "}
            {userData?.settings.email === ""
              ? "Please set your email in your Google Account"
              : userData?.settings.email}
          </p>
        </div>
        <div className="settings-item">
          <h3>Account Creation</h3>
          <p>{userData?.settings.created}</p>
        </div>
      </>
    );
  };

  return (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
        <div className="main-settings">
          <h1>Your Account Settings</h1>
          <div id="settings-wrapper">
            <div className="settings-container">
              {loaded ? displayUserData() : null}
              <div className="settings-item">
                <h3>Change Your Password</h3>
                <p>Change your password at any time</p>
              </div>
              <div className="settings-item">
                <h3>Contact Jwitter</h3>
                <p>Email Jwitter for support</p>
              </div>
              <div className="settings-item">
                <h3>Deactivate your account</h3>
                <p>Close your account</p>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Settings;
