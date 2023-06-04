import React, { useContext } from "react";
import { useGlobalContext } from "./AuthContext";
import "../Styles/TweetPopUp.scss";
import { RxCross2 } from "react-icons/rx";
import { FiImage } from "react-icons/fi";
import { TweetWindowContext } from "./Sidebar";

const TweetPopUp = () => {
  // User profile picture
  // Image option
  // Textfield with character limit
  // Tweet
  const { tweetWindow, openTweetWindow } = useContext(TweetWindowContext);
  const { user } = useGlobalContext();

  return (
    <div id="tweetPopUp">
      <div className="tweet-container">
        <RxCross2
          size={35}
          className="tweet-container-exit"
          onClick={() => (tweetWindow ? openTweetWindow() : null)}
        />

        <div className="tweet-container-middle">
          <img src={user?.photoURL ?? ""}></img>
          <form>
            <textarea
              placeholder="Write your tweet..."
              maxLength={500}
              required
            ></textarea>
          </form>
        </div>

        <div className="tweet-container-bottom">
          <FiImage
            size={30}
            color="#7856ff"
            className="tweet-container-submit-image"
          />
          <button type="submit" className="tweet-container-button">
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetPopUp;
