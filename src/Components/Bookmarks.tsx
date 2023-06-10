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
import { User } from "firebase/auth";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import uniqid from "uniqid";
import Post from "./Post";
import { createFollowingSet, createLikesSet } from "./UtilFunctions";

interface Tweet {
  comments: number;
  docID: string;
  images: [];
  likes: number;
  timestamp: string;
  tweetText: {
    textValue: string;
  };
  userID: string;
  userName: string;
  userProfileURL: string;
}

const Bookmarks = () => {
  const { user } = useGlobalContext();
  const db = getFirestore(app);

  const [tweets, setTweets] = useState<Tweet[]>([]);

  //Set References
  const [bookmarksSet, setBookmarksSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [followingSet, setFollowingSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [likesSet, setLikesSet] = useState<Set<string>>(new Set<string>());

  useEffect(() => {
    retrieveBookmarks();

    const setFollowings = async () => {
      const followings = await createFollowingSet(db, user as User);
      setFollowingSet(followings);
    };

    const createLikes = async () => {
      const likesSet = await createLikesSet(db, user as User);
      setLikesSet(likesSet);
    };

    createLikes();
    setFollowings();
  }, []);
  //Users Reference

  const retrieveBookmarks = async () => {
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
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
        <div className="main-bookmarks">
          <div className="info-bar">
            {" "}
            <h1>Your Bookmarks</h1>
          </div>

          <div className="bookmarked-tweets">
            {tweets.map((tweet) => {
              return (
                <Post
                  tweet={tweet}
                  userBookmarks={bookmarksSet}
                  userFollowing={followingSet}
                  userLikes={likesSet}
                  key={uniqid()}
                />
              );
            })}
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Bookmarks;
