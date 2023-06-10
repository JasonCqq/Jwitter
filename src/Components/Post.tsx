import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark, BsBookmarkCheckFill } from "react-icons/bs";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";
import {
  getFirestore,
  app,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  onSnapshot,
  collection,
} from "../Firebase.js";
import { useGlobalContext } from "./AuthContext";
import "../Styles/Post.scss";
import {
  mapImages,
  followUser,
  unfollowUser,
  likePost,
  unlikePost,
} from "./UtilFunctions";
import { User } from "firebase/auth";
import { TransitionGroup, CSSTransition } from "react-transition-group";

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

interface PostProps {
  tweet: Tweet;
  userBookmarks: Set<string>;
  userFollowing: Set<string>;
  userLikes: Set<string>;
}

const Post: React.FC<PostProps> = (props) => {
  const db = getFirestore(app);
  const { tweet, userBookmarks, userFollowing, userLikes } = props;
  const { user } = useGlobalContext();
  const [bookmarked, setBookmarked] = useState<boolean>();
  const [followed, setFollowed] = useState<boolean>();
  const [liked, setLiked] = useState<boolean>();

  //Set bookmark status
  useEffect(() => {
    if (userBookmarks.has(tweet.docID)) {
      setBookmarked(true);
    } else if (!userBookmarks.has(tweet.docID)) {
      setBookmarked(false);
    }

    if (userFollowing.has(tweet.userID)) {
      setFollowed(true);
    } else if (!userFollowing.has(tweet.userID)) {
      setFollowed(false);
    }

    if (userLikes.has(tweet.docID)) {
      setLiked(true);
    } else if (!userLikes.has(tweet.docID)) {
      setLiked(false);
    }
  }, [userBookmarks, userFollowing, userLikes, tweet]);

  //Add/Delete bookmark
  const bookmarkTweet = async (tweetID: string) => {
    //Add/Delete bookmark ID
    if (userBookmarks.has(tweetID)) {
      await updateDoc(doc(db, "users", `${user?.uid}`, "bookmarks", "tweets"), {
        userArray: arrayRemove(tweetID),
      });
      setBookmarked((prevBookmark) => !prevBookmark);
    } else if (!userBookmarks.has(tweetID)) {
      await updateDoc(doc(db, "users", `${user?.uid}`, "bookmarks", "tweets"), {
        userArray: arrayUnion(tweetID),
      });
      setBookmarked((prevBookmark) => !prevBookmark);
    }
  };

  //Remove post from database
  const deletePost = async () => {
    await deleteDoc(doc(db, "allTweets", `${tweet.docID}`));
    await deleteDoc(
      doc(db, "users", `${user?.uid}`, "tweets", `${tweet.docID}`)
    );
  };

  const moreOptions = () => {
    if (user?.uid === tweet.userID) {
      return (
        <div>
          <p onClick={() => deletePost()}>Delete Post</p>
        </div>
      );
    } else if (user?.uid !== tweet.userID) {
      return followed ? (
        <div>
          <p
            onClick={() => {
              unfollowUser(db, user as User, tweet.userID as string);
              setFollowed(false);
            }}
          >
            Unfollow User
          </p>
        </div>
      ) : (
        <div>
          <p
            onClick={() => {
              followUser(db, user as User, tweet.userID as string);
              setFollowed(true);
            }}
          >
            Follow User
          </p>
        </div>
      );
    }
  };

  //Options popup
  const [reveal, setReveal] = useState(false);

  return (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
        <div className="tweet" key={tweet.docID}>
          <div className="tweet-handle">
            <Link to={`/profile/${tweet.userID}`}>
              <div className="profile-handle">
                <img src={tweet?.userProfileURL}></img>
                <p>{tweet?.userName} </p>
              </div>
            </Link>

            <BsFillPatchCheckFill size={15} color="#1D9BF0" />
            <div className="tweet-options">
              <BsThreeDots
                size={15}
                color="white"
                onClick={() => setReveal((prevReveal) => !prevReveal)}
                className="follow-button"
              />
              {reveal ? moreOptions() : null}
            </div>
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
              {liked ? (
                <AiFillHeart
                  className="tweet-heart"
                  size={20}
                  color="#7856ff"
                  onClick={() => {
                    unlikePost(db, user as User, tweet.docID, tweet.userID);
                    setLiked(false);
                  }}
                />
              ) : (
                <AiOutlineHeart
                  className="tweet-heart"
                  size={20}
                  color="#7856ff"
                  onClick={() => {
                    likePost(db, user as User, tweet.docID, tweet.userID);
                    setLiked(true);
                  }}
                />
              )}

              <p>{tweet?.likes}</p>
            </div>

            <div className="tweet-stat-container">
              {bookmarked ? (
                <BsBookmarkCheckFill
                  className="tweet-comment"
                  size={17.5}
                  color="lightgreen"
                  onClick={() => {
                    bookmarkTweet(tweet.docID);
                  }}
                />
              ) : (
                <BsBookmark
                  className="tweet-comment"
                  size={17.5}
                  color="#7856ff"
                  onClick={() => {
                    {
                      bookmarkTweet(tweet.docID);
                    }
                  }}
                />
              )}
            </div>
            <p className="tweet-time">Posted {tweet?.timestamp}</p>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Post;
