import React, { useEffect, useState } from "react";
import "../Styles/Home.scss";
import { CSSTransitionGroup } from "react-transition-group";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  app,
  getFirestore,
  addDoc,
} from "../Firebase.js";
import { useGlobalContext } from "./AuthContext";
import uniqid from "uniqid";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

function Home() {
  const { user } = useGlobalContext();
  const [tweets, setTweets] = useState<any[]>([]);
  const [reveal, setReveal] = useState(false);

  const revealFunction = () => {
    setReveal(!reveal);
  };

  const revealContainer = () => {
    return (
      <div id="revealContainer">
        <p>Follow</p>
        <p>Profile</p>
      </div>
    );
  };

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

    const newQueries = queries.sort(
      (a: { timestamp: string }, b: { timestamp: string }) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampB - timestampA;
      }
    );

    setTweets(newQueries);
  };
  //Displays images from tweet
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
        {/* <div className="info-bar">
          {" "}
          <h1>Home</h1>
        </div> */}

        <div id="tweets">
          {tweets.map((tweet) => {
            return (
              <div className="tweet" key={uniqid()}>
                <div className="tweet-handle">
                  <Link to={`/profile/${tweet.userID}`}>
                    <div className="profile-handle">
                      <img src={tweet?.userProfileURL}></img>
                      <p>{tweet?.userName} </p>
                    </div>
                  </Link>

                  <BsFillPatchCheckFill size={15} color="#1D9BF0" />
                  <BsThreeDots
                    size={15}
                    color="white"
                    className="follow-button"
                    onClick={() => revealFunction()}
                  />
                  {/* {reveal && revealContainer()} */}
                </div>

                <div className="tweet-body">
                  <p>{tweet?.tweetText.textValue}</p>
                  <div>
                    {tweet.images === "" ? null : mapImages(tweet.images)}
                  </div>
                </div>

                <div className="tweet-stat">
                  <div className="tweet-stat-container">
                    <FaRegComment
                      className="tweet-comment"
                      size={17.5}
                      color="#7856ff"
                    />{" "}
                    <p>{tweet?.comments}</p>
                  </div>

                  <div className="tweet-stat-container">
                    <AiOutlineHeart
                      className="tweet-heart"
                      size={20}
                      color="#7856ff"
                    />{" "}
                    <p>{tweet?.likes}</p>
                  </div>

                  <div className="tweet-stat-container">
                    <BsBookmark
                      className="tweet-comment"
                      size={17.5}
                      color="#7856ff"
                    />{" "}
                  </div>
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
