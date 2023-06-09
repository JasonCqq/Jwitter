import React, { useState, useEffect } from "react";
import "../Styles/Profile.scss";
import { CSSTransitionGroup } from "react-transition-group";
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
} from "./UtilFunctions";
import { User } from "firebase/auth";
import Loading from "./Loading";
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

  //Set References
  const [followingSet, setFollowingSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [followerSet, setFollowerSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [bookmarksSet, setBookmarksSet] = useState<Set<string>>(
    new Set<string>()
  );
  const [userBrowsingFollowing, setUserBrowsingFollowing] = useState<
    Set<string>
  >(new Set<string>());

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

        const [tweets, bookmarks] = await Promise.all([
          displayData(db, user as User),
          createBookmarksSet(db, user as User),
        ]);

        setTweets(tweets);
        setBookmarksSet(bookmarks);

        await Promise.all([
          getUserData(),
          createProfileFollowingSet(),
          createBrowsingUserFollowing(),
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
              <button
                className="button"
                onClick={async () => {
                  await unfollowUser(db, user as User, userProfile as string);
                  setFollowed(false);
                }}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="button"
                onClick={async () => {
                  await followUser(db, user as User, userProfile as string);
                  setFollowed(true);
                }}
              >
                Follow
              </button>
            )}
          </div>

          <div className="profile-description">
            <h1>{userData?.settings.username}</h1>
            <p>A Jwitter User (Joined {userData?.settings.created})</p>

            <div>
              <div>
                <p className="profile-follows">{followerSet.size}</p>
                <span>Followers</span>
              </div>
              <div>
                <p className="profile-follows">{followingSet.size}</p>
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
              userFollowing={userBrowsingFollowing}
              key={uniqid()}
            />
          );
        })}
      </div>
    </CSSTransitionGroup>
  );
};

export default Profile;
