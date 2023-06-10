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
import { increment } from "firebase/firestore";

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

//Creates Following Set Reference
export const createFollowingSet = async (db: any, user: User) => {
  const userRef = doc(db, "users", `${user?.uid}`, "follows", "following");
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    return new Set<string>();
  }
  const userFollowing = userSnap.data().following;
  return new Set<string>(userFollowing);
};

//Creates Bookmarks Set Reference
export const createBookmarksSet = async (db: any, user: User) => {
  const userRef = doc(db, "users", `${user?.uid}`, "bookmarks", "tweets");
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    return new Set<string>();
  }
  const userBookmarks = userSnap.data().userArray;
  return new Set<string>(userBookmarks);
};

//Display Tweets
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

//otherUser = other user's ID
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

export const createLikesSet = async (db: any, user: User) => {
  const userRef = collection(db, "users");
  const likesRef = doc(userRef, `${user?.uid}`, "likes", "tweets");
  const userSnap = await getDoc(likesRef);

  if (!userSnap.exists()) {
    await setDoc(likesRef, {
      likes: [],
    });

    return new Set<string>();
  }

  const userSnapSet = userSnap.data().likes;
  return new Set<string>(userSnapSet);
};

export const likePost = async (
  db: any,
  user: User,
  postID: string,
  otherUserID: string
) => {
  //Add to user's likes
  const usersCollectionRef = collection(db, "users");
  const userLikes = doc(usersCollectionRef, `${user?.uid}`, "likes", "tweets");
  const userLikesSnap = await getDoc(userLikes);
  if (!userLikesSnap.exists()) {
    await setDoc(doc(usersCollectionRef, `${user?.uid}`, "likes", "tweets"), {
      likes: arrayUnion(postID),
    });
  } else if (userLikesSnap.exists()) {
    await updateDoc(
      doc(usersCollectionRef, `${user?.uid}`, "likes", "tweets"),
      {
        likes: arrayUnion(postID),
      }
    );
  }

  //Update allTweet likes
  const tweetLikes = collection(db, "allTweets");
  const tweetLikesSnap = await getDoc(doc(tweetLikes, postID));
  if (!tweetLikesSnap.exists()) {
    return;
  }
  const tweetLikesRef = tweetLikesSnap.ref;
  await updateDoc(tweetLikesRef, { likes: increment(1) });

  //Add to other user's tweet likes
  const usersCollectionRef2 = collection(db, "users");
  const userLikes2 = doc(usersCollectionRef2, otherUserID, "tweets", postID);
  const userLikesSnap2 = await getDoc(userLikes2);
  if (!userLikesSnap2.exists()) {
    return;
  }
  const userLikes2Ref = userLikesSnap2.ref;
  await updateDoc(userLikes2Ref, { likes: increment(1) });
};

export const unlikePost = async (
  db: any,
  user: User,
  postID: string,
  otherUserID: string
) => {
  //Remove from user's likes
  const usersCollectionRef = collection(db, "users");
  const userLikes = doc(usersCollectionRef, `${user?.uid}`, "likes", "tweets");
  const userLikesSnap = await getDoc(userLikes);
  if (!userLikesSnap.exists()) {
    return;
  }
  await updateDoc(doc(usersCollectionRef, `${user?.uid}`, "likes", "tweets"), {
    likes: arrayRemove(postID),
  });

  //Update allTweet likes
  const tweetLikes = collection(db, "allTweets");
  const tweetLikesSnap = await getDoc(doc(tweetLikes, postID));
  if (!tweetLikesSnap.exists()) {
    return;
  }
  const tweetLikesRef = tweetLikesSnap.ref;
  await updateDoc(tweetLikesRef, { likes: increment(-1) });

  //Remove from other user's tweet likes
  const usersCollectionRef2 = collection(db, "users");
  const userLikes2 = doc(usersCollectionRef2, otherUserID, "tweets", postID);
  const userLikesSnap2 = await getDoc(userLikes2);
  if (!userLikesSnap2.exists()) {
    return;
  }
  const userLikes2Ref = userLikesSnap2.ref;
  await updateDoc(userLikes2Ref, { likes: increment(-1) });
};
