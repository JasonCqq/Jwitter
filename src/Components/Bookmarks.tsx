import React, { useEffect } from "react";
import "../Styles/Bookmarks.scss";
import { useGlobalContext } from "./AuthContext";
import { useState } from "react";
import {
  getFirestore,
  app,
  doc,
  getDocs,
  collection,
  getDoc,
} from "../Firebase";
import { CSSTransitionGroup } from "react-transition-group";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";

interface Tweet {
  comments: number;
  docID: string;
  images: Image[];
  likes: number;
  timestamp: string;
  tweetText: {
    textValue: string;
  };
  userID: string;
  userName: string;
  userProfileURL: string;
}

interface Image {
  images: string;
  storageUri: string;
}

const Bookmarks = () => {
  const { user } = useGlobalContext();
  const [tweets, setTweets] = useState<Tweet[]>([]);

  const retrieveBookmarks = async () => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", `${user?.uid}`, "bookmarks", "tweets");
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return;
    }
    const userBookmarks = userSnap.data().userArray;
    const userBookmarksSet = new Set(userBookmarks);
    const mainRef = await getDocs(collection(db, "allTweets"));
    const tweetsArray: any = [];
    // Retrieve all Tweets from database
    if (!mainRef.empty) {
      console.log(mainRef.docs);
      mainRef.docs.forEach((doc) => {
        if (userBookmarksSet.has(doc.id)) {
          tweetsArray.push(doc.data());
        }
      });
    }

    //Sort tweets by time
    const newTweets = tweetsArray.sort(
      (a: { timestamp: string }, b: { timestamp: string }) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampB - timestampA;
      }
    );

    setTweets(newTweets);
  };

  //Renders images from tweet
  const mapImages = (image: Image[] = []) => {
    if (image.length === 0) {
      return;
    }
    return (
      <>
        {image.map((img) => (
          <img key={img.storageUri} src={img.images} />
        ))}
      </>
    );
  };
  useEffect(() => {
    retrieveBookmarks();
  }, []);

  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="main-bookmarks">
        <div className="info-bar">
          {" "}
          <h1>Your Bookmarks</h1>
        </div>

        <div className="bookmarked-tweets">
          {tweets.map((tweet) => {
            return (
              <div className="tweet" key={tweet.docID}>
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
                    // onClick={() => revealFunction()}
                  />
                  {/* {reveal && revealContainer()} */}
                </div>

                <div className="tweet-body">
                  <p>{tweet?.tweetText.textValue}</p>
                  <div>
                    {tweet.images.length === undefined ? (
                      <div>Loading...</div>
                    ) : (
                      mapImages(tweet.images)
                    )}
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
                      //   onClick={() => bookmarkTweet(tweet.docID)}
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
};

export default Bookmarks;
