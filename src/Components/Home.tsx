import React, { useEffect, useState } from "react";
import "../Styles/Home.scss";
import { CSSTransitionGroup } from "react-transition-group";
import { collection, doc, getDocs, app, getFirestore } from "../Firebase.js";
import { useGlobalContext } from "./AuthContext";
import uniqid from "uniqid";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";

function Home() {
  const { user } = useGlobalContext();
  const [tweets, setTweets] = useState<any[]>([]);

  //Displays tweets in database
  const displayData = async () => {
    const db = getFirestore(app);

    const collectionSnapshot = await getDocs(collection(db, "users"));
    const queries: any = [];

    for (const userDoc of collectionSnapshot.docs) {
      const userId = userDoc.id;

      const querySnapshot = await getDocs(
        collection(db, "users", userId, "tweets")
      );

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          queries.push(doc.data());
        });
      }
    }

    setTweets(queries);
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

        {/* Things to fix: Adding user's handle,  */}

        <div id="tweets">
          {tweets.map((tweet) => {
            return (
              <div className="tweet" key={uniqid()}>
                <div className="tweet-handle">
                  <img src={tweet?.userProfileURL}></img>
                  <p>@{tweet?.userName}</p>
                </div>

                <div className="tweet-body">
                  <p>{tweet?.tweetText.textValue}</p>
                  <div>
                    {tweet.images === "" ? null : mapImages(tweet.images)}
                  </div>
                </div>

                <div className="tweet-stat">
                  <p>
                    <AiOutlineHeart size={20} /> {tweet?.likes}
                  </p>
                  <p>
                    <FaRegComment size={20} /> {tweet?.comments}
                  </p>
                  <BsBookmark size={20} />
                  <p className="tweet-time">Posted {tweet?.timestamp}</p>
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
