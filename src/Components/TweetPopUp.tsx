import React, { useContext, useRef, useState } from "react";
import { useGlobalContext } from "./AuthContext";
import "../Styles/TweetPopUp.scss";
import { RxCross2 } from "react-icons/rx";
import { FiImage } from "react-icons/fi";
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
} from "../Firebase.js";

const TweetPopUp = () => {
  // User profile picture
  // Image option
  // Textfield with character limit
  // Tweet
  const { tweetWindow, openTweetWindow } = useContext(TweetWindowContext);
  const [images, setImages] = useState<File[]>([]);

  const { user } = useGlobalContext();
  const imageCount = useRef(0);

  const db = getFirestore(app);

  //Submit Tweet Information to user.
  const submitTweetFunction = async () => {
    const userRef = collection(db, "users", `${user?.uid}`, "tweets");
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    const text = document.getElementById("tweetText") as HTMLTextAreaElement;
    const textValue = text.value;

    const docRef = await addDoc(userRef, {
      tweetText: { textValue },
      likes: 0,
      comments: 0,
      timestamp: `${hour} : ${minute}, ${month}/${day}/${year}`,
      images: "",
    });

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
    <div id="tweetPopUp">
      <div className="tweet-container">
        <RxCross2
          size={75}
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
  );
};

export default TweetPopUp;
