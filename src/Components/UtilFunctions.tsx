import React from "react";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "../Firebase.js";
import { User } from "firebase/auth";
import uniqid from "uniqid";

//Returns images from tweet
interface Image {
  images: string;
  storageUri: string;
}
export const mapImages = (image: Image[] = []) => {
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

//Creates following Set
export const createFollowingSet = async (db: any, user: User) => {
  const userRef = doc(db, "users", `${user?.uid}`, "follows", "following");
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    return new Set<string>();
  }
  const userFollowing = userSnap.data().following;
  return new Set<string>(userFollowing);
};

export const createBookmarksSet = async (db: any, user: User) => {
  const userRef = doc(db, "users", `${user?.uid}`, "bookmarks", "tweets");
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    return new Set<string>();
  }
  const userBookmarks = userSnap.data().userArray;
  return new Set<string>(userBookmarks);
};

export const displayData = async (db: any, user: User) => {
  try {
    const collectionSnapshot = await getDocs(collection(db, "allTweets"));
    const queries: any = [];

    //Display without bookmark function if not logged in
    if (!user) {
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
      return newQueries;
    } else if (user) {
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
      return newQueries;
    }
  } catch (error) {
    console.error(error);
  }
};

//otherUser as in other user's ID
export const followUser = async (db: any, user: User, otherUser: string) => {
  //Add to user's following
  const usersCollectionRef = collection(db, "users");
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
        following: arrayUnion(otherUser),
      }
    );
  } else if (userFollowingSnap.exists()) {
    await updateDoc(
      doc(usersCollectionRef, `${user?.uid}`, "follows", "following"),
      {
        following: arrayUnion(otherUser),
      }
    );
  }
  //Add to tweeter's follower
  const tweeterFollowing = doc(
    usersCollectionRef,
    otherUser,
    "follows",
    "followers"
  );
  const tweeterFollowerSnap = await getDoc(tweeterFollowing);
  if (!tweeterFollowerSnap.exists()) {
    await setDoc(doc(usersCollectionRef, otherUser, "follows", "followers"), {
      followers: arrayUnion(`${user?.uid}`),
    });
  } else if (tweeterFollowerSnap.exists()) {
    await updateDoc(
      doc(usersCollectionRef, otherUser, "follows", "followers"),
      {
        followers: arrayUnion(`${user?.uid}`),
      }
    );
  }
};
export const unfollowUser = async (db: any, user: User, otherUser: string) => {
  //Remove from user's following
  const usersCollectionRef = collection(db, "users");
  const userFollowing = doc(
    usersCollectionRef,
    `${user?.uid}`,
    "follows",
    "following"
  );
  const userFollowingSnap = await getDoc(userFollowing);
  if (!userFollowingSnap.exists()) {
    return;
  }
  await updateDoc(userFollowing, {
    following: arrayRemove(otherUser),
  });

  //Remove from tweeter's followers
  const tweeterFollowing = doc(
    usersCollectionRef,
    otherUser,
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
};
