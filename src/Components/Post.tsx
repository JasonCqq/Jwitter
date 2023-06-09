import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
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
} from "../Firebase.js";
import { useGlobalContext } from "./AuthContext";

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
interface PostProps {
  tweet: Tweet;
  userBookmarks: Set<string>;
}

const Post: React.FC<PostProps> = (props) => {
  const { tweet, userBookmarks } = props;
  const { user } = useGlobalContext();
  const [bookmarked, setBookmarked] = useState<boolean>();

  //Set bookmark status
  useEffect(() => {
    if (userBookmarks.has(tweet.docID)) {
      setBookmarked(true);
    } else if (!userBookmarks.has(tweet.docID)) {
      setBookmarked(false);
    }
  }, []);

  //Add/Delete bookmark
  const bookmarkTweet = async (tweetID: string) => {
    //Add/Delete bookmark ID
    const db = getFirestore(app);
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
  //Options popup
  const [reveal, setReveal] = useState(false);
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
        <div className="tweet-options">
          <BsThreeDots
            size={15}
            color="white"
            onClick={() => setReveal((prevReveal) => !prevReveal)}
            className="follow-button"
          />
          {reveal ? (
            <div>
              <p>Follow</p>
              <p>Delete</p>
            </div>
          ) : null}
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
          <FaRegComment className="tweet-comment" size={17.5} color="#7856ff" />{" "}
          <p>{tweet?.comments}</p>
        </div>

        <div className="tweet-stat-container">
          <AiOutlineHeart className="tweet-heart" size={20} color="#7856ff" />{" "}
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
  );
};

export default Post;
