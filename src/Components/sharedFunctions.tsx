import { useContext, useEffect } from "react";
import {
  onAuthStateChanged,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "../Firebase.js";
import { useGlobalContext } from "./Context";
import React from "react";
import "../Styles/sharedFunctions.scss";
import { RxCross2 } from "react-icons/rx";
import { LogInContext } from "./Routeswitch";

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

export function createAccountWindow() {
  const { closeBothWindows, handleSignInClick } = useContext(LogInContext);

  return (
    <div className="createAccountWindowPopUp">
      <div className="createAccount-window">
        <RxCross2
          size={25}
          className="exitButton"
          onClick={() => closeBothWindows()}
        />
        <div className="innerWindow">
          <h1>Create Your Account</h1>
          <form>
            <input
              className="handle-input"
              name="handle"
              type="name"
              placeholder="Handle"
            ></input>

            <input
              className="email-input"
              name="email"
              type="email"
              placeholder="Email"
            ></input>

            <input
              className="password-input"
              name="password"
              type="password"
              placeholder="Password"
            ></input>
            <input
              className="passwordConfirmation-input"
              name="passwordConfirmation"
              type="password"
              placeholder="Confirm Password"
            ></input>

            <button type="submit">Create Account</button>

            <p>
              Already have an account?{" "}
              <strong onClick={() => handleSignInClick()}>Log in</strong>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export function signInWindow() {
  const { closeBothWindows, handleCreateAccountClick } =
    useContext(LogInContext);
  return (
    <div className="createAccountWindowPopUp">
      <div className="createAccount-window">
        <RxCross2
          size={25}
          className="exitButton"
          onClick={() => closeBothWindows()}
        />
        <div className="innerWindow">
          <h1>Sign In</h1>
          <form>
            <input
              className="email-input"
              name="email"
              type="email"
              placeholder="Email..."
            ></input>
            <input
              name="password"
              type="password"
              placeholder="Password..."
            ></input>
            <button type="submit">Sign In</button>

            <p>
              Don&apos;t have an account?{" "}
              <strong onClick={() => handleCreateAccountClick()}>
                Create one
              </strong>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
