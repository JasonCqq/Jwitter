import React, { useState, useEffect } from "react";
import "../Styles/Profile.scss";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useGlobalContext } from "./AuthContext";
import {
  getFirestore,
  app,
  collection,
  doc,
  getDoc,
  updateDoc,
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  setDoc,
  getDocs,
} from "../Firebase.js";
import uniqid from "uniqid";
import { useParams } from "react-router-dom";
import Post from "./Post";
import {
  createFollowingSet,
  displayData,
  createBookmarksSet,
  followUser,
  unfollowUser,
  createLikesSet,
} from "./UtilFunctions";
import { User } from "firebase/auth";
import Loading from "./Loading";
import FollowPop from "./FollowingPop";

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

const Profile = () => {
  const { user } = useGlobalContext();
  const db = getFirestore(app);
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);

  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [userData, setUserData] = useState<UserData>();
  const [userProfile, setUserProfile] = useState<string>();

  //Follow status for button
  const [followed, setFollowed] = useState<boolean>();
  //Profile and the browsing user's Set References data
  const [followingSet, setFollowingSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [followerSet, setFollowerSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [bookmarksSet, setBookmarksSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [likesSet, setLikesSet] = useState<Set<string>>(new Set<string>());
  const [userBrowsingFollowing, setUserBrowsingFollowing] = useState<
    Set<string>
  >(new Set<string>());

  const [buttonClicked, setButtonClicked] = useState<string>();
  const handleClick = (value: string) => {
    setButtonClicked(value);
  };

  const closeWindow = () => {
    setButtonClicked(undefined);
  };

  //Profile Following Reference Number
  const createProfileFollowingSet = async () => {
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
  };

  const getProfileTweets = async (id: string) => {
    if (!user) {
      return;
    }

    const userRef = collection(db, "users");
    const collectionSnapshot = await getDocs(collection(userRef, id, "tweets"));
    const queries: any = [];

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
      const fetchData = async () => {
        setLoading(true);

        const [bookmarks, likes] = await Promise.all([
          createBookmarksSet(db, user as User),
          createLikesSet(db, user as User),
        ]);

        setBookmarksSet(bookmarks);
        setLikesSet(likes);

        await Promise.all([
          getUserData(),
          createProfileFollowingSet(),
          createBrowsingUserFollowing(),
          getProfileTweets(userProfile),
        ]);
        setLoading(false);
      };
      fetchData();
    }
  }, [userProfile]);

  useEffect(() => {
    if (!userId) {
      if (user && user.uid) {
        setUserProfile(user?.uid);
      }
    } else if (userId) {
      setUserProfile(userId);
    }
  }, [user]);

  //Get profile user's information
  const getUserData = async () => {
    const dbRef = collection(db, "users");
    const userRef = doc(dbRef, userProfile);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserData(userSnap.data() as UserData);
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
          //Upload photo to firebase storage
          const filePath = `${user?.uid}/${file.name}`;
          const newImageRef = ref(getStorage(), filePath);
          await uploadBytesResumable(newImageRef, file);
          const publicImageUrl = await getDownloadURL(newImageRef);

          const userRef = doc(db, "users", `${user?.uid}`);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          //Add photo to user
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

  const createBrowsingUserFollowing = async () => {
    const userSnapDataSet = await createFollowingSet(db, user as User);
    setUserBrowsingFollowing(userSnapDataSet);
  };

  return loading ? (
    <Loading />
  ) : (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
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
              {userProfile === user?.uid && user ? (
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
                <button
                  className="button"
                  onClick={async () => {
                    await unfollowUser(db, user as User, userProfile as string);
                    setFollowed(false);
                  }}
                >
                  Unfollow
                </button>
              ) : user ? (
                <button
                  className="button"
                  onClick={async () => {
                    await followUser(db, user as User, userProfile as string);
                    setFollowed(true);
                  }}
                >
                  Follow
                </button>
              ) : null}
            </div>

            <div className="profile-description">
              <h1>{userData?.settings.username}</h1>
              <p>A Jwitter User (Joined {userData?.settings.created})</p>

              <div className="profile-description-div">
                <div>
                  <p
                    onClick={() => handleClick("followers")}
                    className="profile-follows"
                  >
                    {followerSet.size}
                  </p>
                  <span>Followers</span>
                </div>
                <div>
                  <p
                    onClick={() => handleClick("following")}
                    className="profile-follows"
                  >
                    {followingSet.size}
                  </p>
                  <span>Following</span>
                </div>
              </div>

              {buttonClicked && user && (
                <FollowPop
                  tab={buttonClicked || "N/A"}
                  profileID={userProfile || ""}
                  close={closeWindow}
                />
              )}
            </div>

            <h3>Tweets</h3>
          </div>

          {tweets.map((tweet) => {
            return (
              <Post
                tweet={tweet}
                userBookmarks={bookmarksSet}
                userFollowing={userBrowsingFollowing}
                userLikes={likesSet}
                key={uniqid()}
              />
            );
          })}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Profile;
