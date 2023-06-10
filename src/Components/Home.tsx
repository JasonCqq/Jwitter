import React, { useEffect, useState } from "react";
import "../Styles/Home.scss";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { collection, app, getFirestore, onSnapshot } from "../Firebase.js";
import { useGlobalContext } from "./AuthContext";
import uniqid from "uniqid";
import Post from "./Post";
import {
  createFollowingSet,
  createBookmarksSet,
  displayData,
  createLikesSet,
} from "./UtilFunctions";
import { User } from "firebase/auth";

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

const db = getFirestore(app);

const Home = () => {
  const { user } = useGlobalContext();

  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [newTweets, setNewTweets] = useState(0);

  //Set References
  const [bookmarksSet, setBookmarksSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [followingSet, setFollowingSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [likesSet, setLikesSet] = useState<Set<string>>(new Set<string>());

  //Add Bookmarks and Following Set References
  useEffect(() => {
    if (user) {
      const createBookmarks = async () => {
        const bookmarksSet = await createBookmarksSet(db, user as User);
        setBookmarksSet(bookmarksSet);
      };
      const createFollowing = async () => {
        const followSet = await createFollowingSet(db, user as User);
        setFollowingSet(followSet);
      };
      const createLikes = async () => {
        const likesSet = await createLikesSet(db, user as User);
        setLikesSet(likesSet);
      };

      createBookmarks();
      createFollowing();
      createLikes();
    }
  }, [user]);

  //Adds a snapshot listener on tweets collection.
  useEffect(() => {
    const fetchTweets = async () => {
      const unsubscribe = onSnapshot(
        collection(db, "allTweets"),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (
              change.type === "added" ||
              change.type === "removed" ||
              change.type === "modified"
            ) {
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

  //Refresh Tweets
  useEffect(() => {
    const createTweets = async () => {
      const tweets = await displayData(db, user as User);
      setTweets(tweets);
    };
    const createLikes = async () => {
      const likesSet = await createLikesSet(db, user as User);
      setLikesSet(likesSet);
    };

    createLikes();
    createTweets();
  }, [newTweets]);

  return (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
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

export default Home;
