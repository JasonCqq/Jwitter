import React, { useState, useEffect } from "react";
import "../Styles/Profile.scss";
import { CSSTransitionGroup } from "react-transition-group";
import { useGlobalContext } from "./AuthContext";
import {
  getFirestore,
  app,
  getDocs,
  collection,
  doc,
  getDoc,
} from "../Firebase.js";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import uniqid from "uniqid";

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

const Profile = () => {
  const { user } = useGlobalContext();
  const [tweets, setTweets] = useState<any[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [noTweets, setNoTweets] = useState(false);

  //Displays tweets in database
  const displayData = async () => {
    const db = getFirestore(app);

    const collectionSnapshot = await getDocs(
      collection(db, "users", `${user?.uid}`, "tweets")
    );
    const queries: any = [];

    if (!collectionSnapshot.empty) {
      collectionSnapshot.forEach((doc) => {
        queries.push(doc.data());
      });
    }

    const newQueries = queries.sort(
      (a: { timestamp: string }, b: { timestamp: string }) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB;
      }
    );

    setTweets(newQueries);
  };
  const mapImages = (image: any[]) => {
    console.log;
    return (
      <>
        {image.map((img, index) => (
          <img key={index} src={img.images} />
        ))}
      </>
    );
  };

  const getUserData = async () => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", `${user?.uid}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserData(userSnap.data() as UserData);
    } else {
      setNoTweets(true);
      return;
    }
  };

  useEffect(() => {
    displayData();
    getUserData();
  }, [user]);

  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="main-profile">
        <div className="profile-banner">
          <img
            src={
              user?.photoURL ||
              "https://firebasestorage.googleapis.com/v0/b/jwitter-c2e99.appspot.com/o/abstract-user-flat-4.svg?alt=media&token=1a86b625-7555-4b52-9f0f-0cd89bffeeb6"
            }
          ></img>
          <h1>{userData?.settings.username}</h1>
          <p>A Jwitter User (Joined {userData?.settings.created})</p>
          <h3>Tweets</h3>
        </div>

        <div className="profile-tweets">
          {tweets.map((tweet) => {
            return (
              <div className="tweet" key={uniqid()}>
                <div className="tweet-handle">
                  <img src={tweet?.userProfileURL}></img>
                  <p>{tweet?.userName}</p>
                </div>

                <div className="tweet-body">
                  <p>{tweet?.tweetText.textValue}</p>
                  <div>
                    {tweet.images === "" ? null : mapImages(tweet.images)}
                  </div>
                </div>

                <div className="tweet-stat">
                  <p>
                    <AiOutlineHeart size={20} color="#7856ff" /> {tweet?.likes}
                  </p>
                  <p>
                    <FaRegComment size={20} color="#7856ff" /> {tweet?.comments}
                  </p>
                  <p className="tweet-time">Posted {tweet?.timestamp}</p>
                </div>
              </div>
            );
          })}

          {noTweets ? (
            <div className="tweet" key={uniqid()}>
              <h2 className="empty-tweets">No More Tweets...</h2>
            </div>
          ) : null}
        </div>
      </div>
    </CSSTransitionGroup>
  );
};

export default Profile;
