import React, { useState, useEffect } from "react";
import "../Styles/Profile.scss";
import { CSSTransitionGroup } from "react-transition-group";
import { useGlobalContext } from "./AuthContext";
import {
  getFirestore,
  app,
  getDocs,
  collection,
  doc,
  getDoc,
  updateDoc,
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  arrayRemove,
  arrayUnion,
} from "../Firebase.js";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import uniqid from "uniqid";
import { useParams } from "react-router-dom";
import { BsBookmark } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BsFillPatchCheckFill } from "react-icons/bs";

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

const Profile = () => {
  const { user } = useGlobalContext();
  const { userId } = useParams();

  const [tweets, setTweets] = useState<any[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userProfile, setUserProfile] = useState("");

  useEffect(() => {
    if (userProfile) {
      displayData();
      getUserData();
    }
  }, [userProfile]);

  useEffect(() => {
    if (!userId) {
      setUserProfile(user?.uid || "");
    } else if (userId) {
      setUserProfile(userId);
    }
  }, []);

  const bookmarkTweet = async (tweetID: string) => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", `${user?.uid}`, "bookmarks", "tweets");
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return;
    }
    const userBookmarks = userSnap.data().userArray;
    const userBookmarksSet = new Set(userBookmarks);

    //Add/Delete bookmark ID
    if (userBookmarksSet.has(tweetID)) {
      await updateDoc(userRef, {
        userArray: arrayRemove(tweetID),
      });
    } else if (!userBookmarksSet.has(tweetID)) {
      await updateDoc(userRef, {
        userArray: arrayUnion(tweetID),
      });
    }
  };

  //Displays tweets in database
  const displayData = async () => {
    const db = getFirestore(app);

    const collectionSnapshot = await getDocs(
      collection(db, "users", userProfile, "tweets")
    );
    const queries: any = [];

    if (!collectionSnapshot.empty) {
      const userRef = doc(db, "users", `${user?.uid}`, "bookmarks", "tweets");
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        return;
      }
      const userBookmarks = userSnap.data().userArray;
      const userBookmarksSet = new Set(userBookmarks);

      collectionSnapshot.forEach((doc) => {
        if (userBookmarksSet.has(doc.id)) {
          const data = {
            bookmarked: true,
            key: uniqid(),
            ...doc.data(),
          };
          queries.push(data);
        } else if (!userBookmarksSet.has(doc.id)) {
          const data = {
            bookmarked: false,
            key: uniqid(),
            ...doc.data(),
          };
          queries.push(data);
        }
      });
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
  const mapImages = (image: any[]) => {
    return (
      <>
        {image.map((img, index) => (
          <img key={index} src={img.images} />
        ))}
      </>
    );
  };
  //Get user's information
  const getUserData = async () => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", userProfile);
    const userSnap = await getDoc(userRef);
    console.log(userProfile);

    if (userSnap.exists()) {
      setUserData(userSnap.data() as UserData);
    } else {
      return;
    }
  };

  //Changes PFP photo, Edits user's photoURL in firebase
  const editPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const db = getFirestore(app);

    if (target?.files?.length) {
      const file = target.files[0];
      const reader = new FileReader();

      reader.onload = async function (e: ProgressEvent<FileReader>) {
        const result = e.target?.result;
        if (typeof result === "string") {
          const filePath = `${user?.uid}/${file.name}`;
          const newImageRef = ref(getStorage(), filePath);
          await uploadBytesResumable(newImageRef, file);
          const publicImageUrl = await getDownloadURL(newImageRef);

          const userRef = doc(db, "users", `${user?.uid}`);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();

          const updatedUserData = {
            ...userData,
            settings: {
              ...userData?.settings,
              photoURL: publicImageUrl,
            },
          };

          await updateDoc(userRef, updatedUserData);
        }
      };
      reader.readAsDataURL(file);
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
      <div className="main-profile">
        <div className="info-bar">
          {" "}
          <h1>Profile</h1>
        </div>

        <div className="profile-banner">
          <div className="profile-follow">
            <img
              src={
                userData?.settings.photoURL ||
                "https://firebasestorage.googleapis.com/v0/b/jwitter-c2e99.appspot.com/o/abstract-user-flat-4.svg?alt=media&token=1a86b625-7555-4b52-9f0f-0cd89bffeeb6"
              }
            ></img>
            {userProfile === user?.uid ? (
              <div className="editPhoto button">
                <input
                  id="pfpFile"
                  type="file"
                  accept="image/*"
                  title=" "
                  onChange={editPhoto}
                ></input>
                <label htmlFor="pfpFile">Edit Photo</label>
              </div>
            ) : (
              <button className="button">Follow</button>
            )}
          </div>

          <div className="profile-description">
            <h1>{userData?.settings.username}</h1>
            <p>A Jwitter User (Joined {userData?.settings.created})</p>

            <div>
              <div>
                <p>0</p>
                <span>Followers</span>
              </div>
              <div>
                <p>0</p>
                <span>Following</span>
              </div>
            </div>
          </div>

          <h3>Tweets</h3>
        </div>

        {tweets.map((tweet) => {
          return (
            <div className="tweet" key={uniqid()}>
              <div className="tweet-handle">
                <Link to={`/profile/${tweet.userID}`}>
                  <div className="profile-handle">
                    <img src={tweet?.userProfileURL}></img>
                    <p>{tweet?.userName} </p>
                  </div>
                </Link>

                <BsFillPatchCheckFill size={15} color="#1D9BF0" />
              </div>

              <div className="tweet-body">
                <p>{tweet?.tweetText.textValue}</p>
                <div>
                  {tweet.images === "" ? null : mapImages(tweet.images)}
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
                  {tweet.bookmarked ? (
                    <BsBookmark
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
        })}
      </div>
    </CSSTransitionGroup>
  );
};

export default Profile;
