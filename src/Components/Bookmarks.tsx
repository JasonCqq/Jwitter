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
import uniqid from "uniqid";
import Post from "./Post";

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
  const [bookmarksSet, setBookmarksSet] = useState<Set<string>>(
    new Set<string>()
  );

  useEffect(() => {
    retrieveBookmarks();
  }, []);

  const retrieveBookmarks = async () => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", `${user?.uid}`, "bookmarks", "tweets");
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return;
    }
    const userBookmarks = userSnap.data().userArray;
    const userBookmarksSet = new Set<string>(userBookmarks);
    setBookmarksSet(userBookmarksSet);

    const mainRef = await getDocs(collection(db, "allTweets"));
    const tweetsArray: any = [];
    // Retrieve all bookmarked weets from database
    if (!mainRef.empty) {
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
              <Post tweet={tweet} userBookmarks={bookmarksSet} key={uniqid()} />
            );
          })}
        </div>
      </div>
    </CSSTransitionGroup>
  );
};

export default Bookmarks;
