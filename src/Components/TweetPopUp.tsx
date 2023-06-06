import React, { useContext, useRef, useState, useEffect } from "react";
import { useGlobalContext } from "./AuthContext";
import "../Styles/TweetPopUp.scss";
import { RxCross2 } from "react-icons/rx";
import { FiImage } from "react-icons/fi";
import { AiOutlineFileGif } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";

import { TweetWindowContext } from "./Sidebar";
import {
  collection,
  addDoc,
  app,
  getFirestore,
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  updateDoc,
  doc,
  getDoc,
} from "../Firebase.js";
import { CSSTransitionGroup } from "react-transition-group";

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

const TweetPopUp = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  // User profile picture
  // Image option
  // Textfield with character limit
  // Tweet
  const { tweetWindow, openTweetWindow } = useContext(TweetWindowContext);
  const [images, setImages] = useState<File[]>([]);

  const { user } = useGlobalContext();
  const imageCount = useRef(0);

  const getUserData = async () => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", `${user?.uid}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserData(userSnap.data() as UserData);
    } else {
      return;
    }
  };

  useEffect(() => {
    getUserData();
  }, [user]);

  const db = getFirestore(app);

  //Submit Tweet Information to user.
  const submitTweetFunction = async () => {
    //Timestamp
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const AMPM = hour < 12 ? "AM" : "PM";
    const newHour = hour < 12 ? hour : hour - 12;

    //Tweet Text
    const text = document.getElementById("tweetText") as HTMLTextAreaElement;
    const textValue = text.value;

    const userRef = collection(db, "users", `${user?.uid}`, "tweets");

    const docRef = await addDoc(userRef, {
      tweetText: { textValue },
      likes: 0,
      comments: 0,
      timestamp: `${newHour}:${minute} ${AMPM}, ${month}/${day}/${year}`,
      images: "",
      userID: `${user?.uid}`,
      userProfileURL: `${
        userData?.settings.photoURL ||
        "https://firebasestorage.googleapis.com/v0/b/jwitter-c2e99.appspot.com/o/abstract-user-flat-4.svg?alt=media&token=1a86b625-7555-4b52-9f0f-0cd89bffeeb6"
      }`,
      userName: `${userData?.settings.username}`,
    });
    //Add DocID Attribute
    const docID = docRef.id;
    await updateDoc(docRef, { docID });

    //Stores each image into firebase storage
    try {
      const updatedImages = images.map(async (image) => {
        const filePath = `${user?.uid}/${docRef.id}/${image.name}`;
        const newImageRef = ref(getStorage(), filePath);
        const fileSnapshot = await uploadBytesResumable(newImageRef, image);
        const publicImageUrl = await getDownloadURL(newImageRef);

        return {
          images: publicImageUrl,
          storageUri: fileSnapshot.metadata.fullPath,
        };
      });

      const updatedImagesUrls = await Promise.all(updatedImages);

      await updateDoc(docRef, {
        images: updatedImagesUrls,
      });
    } catch (error: any) {
      console.error(error.code, error.message);
    }

    openTweetWindow();
  };

  //Add small images to imgContainer
  const previewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;

    if (
      target &&
      target.files &&
      target.files?.length + imageCount.current > 4
    ) {
      alert("You can only upload 4 images");
      return;
    }

    if (target && target.files && target.files.length > 0) {
      const files = Array.from(target.files);
      const newFilesArray: File[] = [];

      files.forEach((file) => {
        const reader = new FileReader();
        imageCount.current = imageCount.current + 1;
        newFilesArray.push(file);

        reader.onload = function (e: ProgressEvent<FileReader>) {
          const imageContainer = document.getElementById("tweetImageContainer");
          if (imageContainer !== null) {
            const imgElement = document.createElement("img");
            imgElement.src = e.target?.result as string;

            imageContainer.appendChild(imgElement);
          }
        };
        reader.readAsDataURL(file);
      });

      setImages(newFilesArray);
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
      <div id="tweetPopUp">
        <div className="tweet-container">
          <RxCross2
            size={50}
            className="tweet-container-exit"
            onClick={() => (tweetWindow ? openTweetWindow() : null)}
          />

          <div className="tweet-container-middle">
            <img
              src={
                userData?.settings?.photoURL ??
                "https://firebasestorage.googleapis.com/v0/b/jwitter-c2e99.appspot.com/o/abstract-user-flat-4.svg?alt=media&token=1a86b625-7555-4b52-9f0f-0cd89bffeeb6"
              }
            ></img>
            <form>
              <textarea
                placeholder="Write your tweet..."
                maxLength={500}
                required
                id="tweetText"
              ></textarea>
            </form>
          </div>

          <div id="tweetImageContainer"></div>

          <div className="tweet-container-bottom">
            <label htmlFor="tweetFile">
              <FiImage
                size={30}
                color="#7856ff"
                className="tweet-container-submit-image"
              />
            </label>
            <input
              name="tweetFile"
              type="file"
              id="tweetFile"
              accept="image/*"
              onChange={previewImage}
              multiple
            ></input>

            <AiOutlineFileGif size={30} color="#7856ff72" />
            <BsEmojiSmile size={30} color="#7856ff72" />
            <HiOutlineLocationMarker size={30} color="#7856ff72" />
            <SlCalender size={30} color="#7856ff72" />

            <button
              onClick={() => submitTweetFunction()}
              type="submit"
              className="tweet-container-button"
            >
              Tweet
            </button>
          </div>
        </div>
      </div>
    </CSSTransitionGroup>
  );
};

export default TweetPopUp;
