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
  setDoc,
  arrayUnion,
  arrayRemove,
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
  const [userProfile, setUserProfile] = useState<string>();
  const [bookmarksSet, setBookmarksSet] = useState<Set<string>>(
    new Set<string>()
  );

  const [followed, setFollowed] = useState<boolean>();

  const [followingSet, setFollowingSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [followerSet, setFollowerSet] = useState<Set<string>>(
    new Set<string>()
  );

  //Users Reference
  const createFollowingSet = async () => {
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, "users");

    const userRef = doc(
      usersCollectionRef,
      userProfile,
      "follows",
      "following"
    );
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(
        doc(usersCollectionRef, userProfile, "follows", "following"),
        {
          following: [],
        }
      );
      setFollowingSet(new Set<string>());
    } else {
      const userFollowing = userSnap.data().following;
      const userFollowingSet = new Set(userFollowing);
      setFollowingSet(userFollowingSet as Set<string>);
    }

    const userRef2 = doc(
      usersCollectionRef,
      userProfile,
      "follows",
      "followers"
    );
    const userSnap2 = await getDoc(userRef2);
    if (!userSnap2.exists()) {
      return;
    }
    const userFollower = userSnap2.data().followers;
    const userFollowerSet = new Set(userFollower);
    setFollowerSet(userFollowerSet as Set<string>);
    console.log(userProfile, userRef2);
  };

  useEffect(() => {
    if (user && user.uid && followerSet.has(user.uid)) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [followerSet]);

  useEffect(() => {
    if (userProfile) {
      displayData();
      getUserData();
      createFollowingSet();
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
    const usersCollectionRef = collection(db, "users");
    const userDocRef = doc(usersCollectionRef, userProfile);
    const collectionSnapshot = await getDocs(collection(userDocRef, "tweets"));
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
    const dbRef = collection(db, "users");
    const userRef = doc(dbRef, userProfile);
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

  const followUser = async () => {
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, "users");
    //Add to user's following
    const userFollowing = doc(
      db,
      "users",
      `${user?.uid}`,
      "follows",
      "following"
    );
    const userFollowingSnap = await getDoc(userFollowing);
    if (!userFollowingSnap.exists()) {
      await setDoc(
        doc(usersCollectionRef, `${user?.uid}`, "follows", "following"),
        {
          following: arrayUnion(userProfile),
        }
      );
    } else if (userFollowingSnap.exists()) {
      await updateDoc(
        doc(usersCollectionRef, `${user?.uid}`, "follows", "following"),
        {
          following: arrayUnion(userProfile),
        }
      );
    }
    //Add to tweeter's follower
    const tweeterFollowing = doc(
      usersCollectionRef,
      userProfile,
      "follows",
      "followers"
    );
    const tweeterFollowerSnap = await getDoc(tweeterFollowing);
    if (!tweeterFollowerSnap.exists()) {
      await setDoc(
        doc(usersCollectionRef, userProfile, "follows", "followers"),
        {
          followers: arrayUnion(`${user?.uid}`),
        }
      );
      setFollowed(true);
    } else if (tweeterFollowerSnap.exists()) {
      await updateDoc(
        doc(usersCollectionRef, userProfile, "follows", "followers"),
        {
          followers: arrayUnion(`${user?.uid}`),
        }
      );
      setFollowed(true);
    }
  };

  const unfollowUser = async () => {
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, "users");
    const userFollowing = doc(
      usersCollectionRef,
      `${user?.uid}`,
      "follows",
      "following"
    );
    //Remove from user's following
    const userFollowingSnap = await getDoc(userFollowing);
    if (!userFollowingSnap.exists()) {
      return;
    }
    await updateDoc(userFollowing, {
      following: arrayRemove(userProfile),
    });

    //Remove from tweeter's followers
    const tweeterFollowing = doc(
      usersCollectionRef,
      userProfile,
      "follows",
      "followers"
    );
    const tweeterFollowerSnap = await getDoc(tweeterFollowing);
    if (!tweeterFollowerSnap.exists()) {
      return;
    }
    await updateDoc(tweeterFollowing, {
      followers: arrayRemove(`${user?.uid}`),
    });
    setFollowed(false);
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
            ) : followed ? (
              <button className="button" onClick={() => unfollowUser()}>
                Unfollow
              </button>
            ) : (
              <button className="button" onClick={() => followUser()}>
                Follow
              </button>
            )}
          </div>

          <div className="profile-description">
            <h1>{userData?.settings.username}</h1>
            <p>A Jwitter User (Joined {userData?.settings.created})</p>

            <div>
              <div>
                <p>{followerSet.size}</p>
                <span>Followers</span>
              </div>
              <div>
                <p>{followingSet.size}</p>
                <span>Following</span>
              </div>
            </div>
          </div>

          <h3>Tweets</h3>
        </div>

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
    </CSSTransitionGroup>
  );
};

export default Profile;
