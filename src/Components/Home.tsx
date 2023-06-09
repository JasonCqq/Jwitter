import React, { useEffect, useState } from "react";
import "../Styles/Home.scss";
import { CSSTransitionGroup } from "react-transition-group";
import {
  collection,
  doc,
  getDocs,
  app,
  getFirestore,
  onSnapshot,
  getDoc,
} from "../Firebase.js";
import { useGlobalContext } from "./AuthContext";
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

function Home() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  //Snapshot Reload
  const [newTweets, setNewTweets] = useState(0);
  const { user } = useGlobalContext();

  //References
  const [bookmarksSet, setBookmarksSet] = useState<Set<string>>(
    new Set<string>()
  );

  const [followingSet, setFollowingSet] = useState<Set<string>>(
    new Set<string>()
  );

  //Bookmarks Reference
  const createBookmarksSet = async () => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", `${user?.uid}`, "bookmarks", "tweets");
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return;
    }
    const userBookmarks = userSnap.data().userArray;
    const userBookmarksSet = new Set(userBookmarks);
    setBookmarksSet(userBookmarksSet as Set<string>);
  };

  //Users Reference
  const createFollowingSet = async () => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", `${user?.uid}`, "follows", "following");
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return;
    }
    const userFollowing = userSnap.data().following;
    const userFollowingSet = new Set(userFollowing);
    console.log(userFollowingSet);
    setFollowingSet(userFollowingSet as Set<string>);
  };

  useEffect(() => {
    createBookmarksSet();
    createFollowingSet();
  }, []);

  //Adds a snapshot listener on tweets collection.
  useEffect(() => {
    const fetchTweets = async () => {
      const db = getFirestore(app);
      const unsubscribe = onSnapshot(
        collection(db, "allTweets"),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added" || change.type === "removed") {
              setNewTweets((prevNewTweets) => prevNewTweets + 1);
            }
          });
        }
      );
      return () => {
        unsubscribe();
      };
    };
    fetchTweets();
  }, []);
  useEffect(() => {
    displayData();
  }, [newTweets]);
  //Add tweets from database
  const displayData = async () => {
    try {
      setTweets([]);
      const db = getFirestore(app);
      const collectionSnapshot = await getDocs(collection(db, "allTweets"));
      const queries: any = [];

      //Display without bookmark function if not logged in
      if (!user) {
        collectionSnapshot.forEach((doc) => {
          const data = {
            key: uniqid(),
            ...doc.data(),
          };
          queries.push(data);
        });
        //Sort tweets by time
        const newQueries = queries.sort(
          (a: { timestamp: string }, b: { timestamp: string }) => {
            const timestampA = new Date(a.timestamp).getTime();
            const timestampB = new Date(b.timestamp).getTime();
            return timestampB - timestampA;
          }
        );
        setTweets(newQueries);
        return;
      }

      collectionSnapshot.forEach((doc) => {
        const data = {
          key: uniqid(),
          ...doc.data(),
        };
        queries.push(data);
      });
      //Sort tweets by time
      const newQueries = queries.sort(
        (a: { timestamp: string }, b: { timestamp: string }) => {
          const timestampA = new Date(a.timestamp).getTime();
          const timestampB = new Date(b.timestamp).getTime();
          return timestampB - timestampA;
        }
      );
      setTweets(newQueries);
    } catch (error) {
      console.error(error);
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

        <div id="tweets">
          {tweets.map((tweet) => {
            return (
              <Post
                tweet={tweet}
                userBookmarks={bookmarksSet}
                userFollowing={followingSet}
                key={uniqid()}
              />
            );
          })}
        </div>
      </div>
    </CSSTransitionGroup>
  );
}

export default Home;
