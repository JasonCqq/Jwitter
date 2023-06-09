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
} from "../Firebase.js";
import uniqid from "uniqid";
import { useParams } from "react-router-dom";
import Post from "./Post";

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
const Profile = () => {
  const { user } = useGlobalContext();
  const { userId } = useParams();

  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userProfile, setUserProfile] = useState("");
  const [bookmarksSet, setBookmarksSet] = useState<Set<string>>(
    new Set<string>()
  );

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

  //Displays tweets in database
  const displayData = async () => {
    const db = getFirestore(app);

    const collectionSnapshot = await getDocs(
      collection(db, "users", userProfile, "tweets")
    );
    const queries: any = [];

    if (!collectionSnapshot.empty) {
      collectionSnapshot.docs.forEach((doc) => {
        queries.push(doc.data());
      });

      //Get user bookmarks
      const userRef = doc(db, "users", `${user?.uid}`, "bookmarks", "tweets");
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        return;
      }
      const userBookmarks = userSnap.data().userArray;
      const userBookmarksSet = new Set<string>(userBookmarks);
      setBookmarksSet(userBookmarksSet);
    }
    //Sort Tweets by Time
    const newQueries = queries.sort(
      (a: { timestamp: string }, b: { timestamp: string }) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB;
      }
    );

    setTweets(newQueries);
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
            <Post tweet={tweet} userBookmarks={bookmarksSet} key={uniqid()} />
          );
        })}
      </div>
    </CSSTransitionGroup>
  );
};

export default Profile;
