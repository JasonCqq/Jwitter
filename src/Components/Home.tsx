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

    const newQueries = queries.sort(
      (a: { timestamp: string }, b: { timestamp: string }) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB;
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

  const likeFunction = async (targetUser: string, id: string) => {
    const db = getFirestore(app);

    const tweetRef = doc(db, "users", `${targetUser}`, "tweets", `${id}`);
    const tweetSnap = await getDoc(tweetRef);

    const userSnap = await getDocs(
      collection(db, "users", `${user?.uid}`, "likedTweets")
    );

    console.log(userSnap);
    for (const snap of userSnap.docs) {
      if (snap.id === user?.uid) {
        continue;
      }

      if (snap.id !== user?.uid) {
        console.log(tweetSnap);
      }
    }
  };

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
                  <p>{tweet?.userName}</p>
                </div>

                <div className="tweet-body">
                  <p>{tweet?.tweetText.textValue}</p>
                  <div>
                    {tweet.images === "" ? null : mapImages(tweet.images)}
                  </div>
                </div>

                <div className="tweet-stat">
                  <div className="tweet-stat-container">
                    <AiOutlineHeart
                      className="tweet-heart"
                      size={20}
                      color="#7856ff"
                      onClick={() => likeFunction(tweet.userID, tweet.docID)}
                    />{" "}
                    <p>{tweet?.likes}</p>
                  </div>
                  <div className="tweet-stat-container">
                    <FaRegComment
                      className="tweet-comment"
                      size={17.5}
                      color="#7856ff"
                    />{" "}
                    <p>{tweet?.comments}</p>
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
