import React, { useEffect, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  app,
  doc,
  getFirestore,
  getDoc,
  collection,
  getDocs,
} from "../Firebase.js";
import { RxCross2 } from "react-icons/rx";
import "../Styles/CommentPop.scss";
import { useGlobalContext } from "./AuthContext";
import { createComment } from "./UtilFunctions";
import { User } from "firebase/auth";
import uniqid from "uniqid";

interface CommentProps {
  tweetID: string;
  tweetUserID: string;
  close: () => void;
}

interface Tweet {
  tweetText: string;
  likes: number;
  timestamp: string;
  userName: string;
  userProfileURL: string;
}

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

interface Comment {
  username: string;
  userPhoto: string;
  text: string;
  timestamp: string;
}

const db = getFirestore(app);
const CommentPop: React.FC<CommentProps> = (props) => {
  const { user } = useGlobalContext();
  const { tweetID, tweetUserID, close } = props;
  const [tweet, setTweet] = useState<Tweet>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commented, setCommented] = useState<boolean>(false);

  const getTweet = async () => {
    const tweetRef = doc(db, "users", tweetUserID, "tweets", tweetID);
    const tweetSnap = await getDoc(tweetRef);
    if (!tweetSnap.exists()) {
      return;
    }
    const tweetData = {
      tweetText: tweetSnap.data().tweetText.textValue,
      likes: tweetSnap.data().likes,
      timestamp: tweetSnap.data().timestamp,
      userName: tweetSnap.data().userName,
      userProfileURL: tweetSnap.data().userProfileURL,
    };

    setTweet(tweetData as Tweet);
  };

  const getUserData = async () => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", `${user?.uid}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserData(userSnap.data() as UserData);
    } else {
      return;
    }
  };

  useEffect(() => {
    getUserData();
  }, [user]);

  const getComments = async () => {
    const tweetDoc = doc(db, "allTweets", tweetID);
    const tweetSnap = await getDoc(tweetDoc);
    if (!tweetSnap.exists()) {
      return;
    }
    const commentRef = collection(tweetDoc, "comments");
    const commentSnapshot = await getDocs(commentRef);
    const queries: any = [];
    commentSnapshot.forEach((comm) => {
      const commData = {
        username: comm.data().authorUsername,
        userPhoto: comm.data().authorPhoto,
        text: comm.data().text,
        timestamp: comm.data().time,
      };
      queries.push(commData);
    });

    const newQueries = queries.sort(
      (a: { timestamp: string }, b: { timestamp: string }) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampB - timestampA;
      }
    );

    setComments(newQueries);
  };

  const commentText = () => {
    const comment = document.getElementById(
      "commentInput"
    ) as HTMLTextAreaElement;
    return comment.value;
  };

  useEffect(() => {
    getTweet();
    getComments();
  }, []);

  return (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
        <div className="comments-container">
          <RxCross2 size={25} className="exitButton" onClick={() => close()} />
          <div className="main-tweet">
            <div className="main-tweet-handle">
              {" "}
              <img src={tweet?.userProfileURL}></img>
              <p>{tweet?.userName}</p>
            </div>
            <p className="main-tweet-stats">{tweet?.tweetText}</p>
            <div>
              <p className="main-tweet-stats">Posted {tweet?.timestamp}</p>
            </div>
          </div>

          <div className="tweet-comments">
            <h1>Comments</h1>
            <div className="comments">
              {comments.map((c) => {
                return (
                  <div className="comment" key={uniqid()}>
                    <div className="comments-handle">
                      <img src={c.userPhoto}></img>
                      <h1>{c.username}</h1>
                    </div>

                    <p className="comments-stats">{c.text}</p>

                    <p className="comments-stats">
                      <span>{c.timestamp}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {commented ? null : (
            <div className="post-comment">
              <textarea
                placeholder="Write a comment..."
                id="commentInput"
              ></textarea>
              <button
                onClick={() => {
                  createComment(
                    db,
                    user as User,
                    userData?.settings.username || "",
                    tweetID,
                    tweetUserID,
                    commentText(),
                    userData?.settings.photoURL || ""
                  );
                  setCommented(true);
                }}
                className="comment-button"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default CommentPop;
