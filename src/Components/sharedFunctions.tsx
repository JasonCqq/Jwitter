import { useEffect } from "react";
import {
  onAuthStateChanged,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "../Firebase.js";
import { useGlobalContext } from "./Context";
import React from "react";

//Authentications
export function useAuthentication() {
  const auth = getAuth();
  const { setUser } = useGlobalContext();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [setUser]);

  async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  // createUserWithEmailAndPassword(auth, email, password)
  //   .then((userCredential) => {
  //     const user = userCredential.user;
  //   })
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     console.log(errorCode, errorMessage);
  //   });

  // signInWithEmailAndPassword(auth, email, password)
  //   .then((userCredential) => {
  //     // Signed in
  //     const user = userCredential.user;
  //     // ...
  //   })
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //   });

  return { googleSignIn };
}

export function signInWindow() {
  return (
    <div id="createAccountWindowPopUp">
      <div className="createAccount-window">
        <h1>Create Account</h1>
        <label htmlFor="email">Email</label>
        <input
          className="email-input"
          name="email"
          type="email"
          placeholder="Email..."
        ></input>
        <label htmlFor="password">Password</label>
        <input
          className="password-input"
          name="password"
          type="password"
          placeholder="Password..."
        ></input>
        <label htmlFor="passwordConfirmation">Confirm Password</label>
        <input
          className="passwordConfirmation-input"
          name="passwordConfirmation"
          type="password"
          placeholder="Confirm Password..."
        ></input>
      </div>
    </div>
  );
}

export function createAccountWindow() {
  return (
    <div id="createAccountWindowPopUp">
      <div className="createAccount-window">
        <h1>Sign In</h1>
        <label htmlFor="email">Email</label>
        <input
          className="email-input"
          name="email"
          type="email"
          placeholder="Email..."
        ></input>
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Password..."
        ></input>
      </div>
    </div>
  );
}
