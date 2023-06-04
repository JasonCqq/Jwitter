import React, { useEffect, useState } from "react";
import "../Styles/Home.scss";
import { CSSTransitionGroup } from "react-transition-group";
import { collection, doc, getDocs, app, getFirestore } from "../Firebase.js";
import { useGlobalContext } from "./AuthContext";
import uniqid from "uniqid";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

function Home() {
  const { user } = useGlobalContext();
  const [tweets, setTweets] = useState<any[]>([]);

  // !!! REMEMBER TO SET USER.UID TO ALL USERS SO YOU ARE ABLE TO DISPLAY OTHER USERS TWEETS
  const displayData = async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(
      collection(db, "users", `${user?.uid}`, "tweets")
    );
    const queries: any = [];

    querySnapshot.forEach((doc) => {
      queries.push(doc.data());
    });

    setTweets(queries);
  };

  useEffect(() => {
    displayData();
  }, [user]);

  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="main-home">
        <div className="info-bar">
          {" "}
          <h1>Home</h1>
        </div>
        {/* 
    Things to fix: Looping through the image URLS, and Adding user's handle, Making all user's post visible, filter out the undefined objects */}

        <div id="tweets">
          {tweets.map((tweet) => {
            console.log("hi");
            return (
              <div className="tweet" key={uniqid()}>
                <div className="tweet-handle">
                  <img src={tweet?.userProfileURL}></img>
                  <p>@{tweet?.userName}</p>
                </div>

                <div className="tweet-body">
                  <p>{tweet?.tweetText.textValue}</p>
                  <img src={tweet?.images[0].images}></img>
                </div>

                <div className="tweet-stat">
                  <p>
                    <AiOutlineHeart size={20} /> {tweet?.likes}
                  </p>
                  <p>
                    <FaRegComment size={20} /> {tweet?.comments}
                  </p>
                  <p className="tweet-time">Posted on {tweet?.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CSSTransitionGroup>
  );
}

export default Home;
