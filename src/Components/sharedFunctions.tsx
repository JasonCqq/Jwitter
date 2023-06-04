import { FormEvent, useContext, useEffect } from "react";
import {
  onAuthStateChanged,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../Firebase.js";
import { useGlobalContext } from "./AuthContext";
import React, { useState } from "react";
import "../Styles/sharedFunctions.scss";
import { RxCross2 } from "react-icons/rx";
import { LogInContext } from "./Routeswitch";
import { CSSTransitionGroup } from "react-transition-group";

//Authentications
function useAuthentication() {
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
  return { googleSignIn };
}

function CreateAccountWindow() {
  const { closeWindows, toggleSignIn } = useContext(LogInContext);
  const closeAndOpenSignIn = () => {
    closeWindows();
    toggleSignIn();
  };

  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const auth = getAuth();

  const formSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
      })
      .then(() => closeWindows())
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="createAccountWindowPopUp">
        <div className="createAccount-window">
          <RxCross2
            size={25}
            className="exitButton"
            onClick={() => closeWindows()}
          />
          <div className="innerWindow">
            <h1>Create Your Account</h1>
            <form onSubmit={formSubmit}>
              <input
                className="handle-input"
                name="handle"
                type="name"
                placeholder="Handle"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              ></input>

              <input
                className="email-input"
                name="email"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>

              <input
                className="password-input"
                name="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
              ></input>
              <input
                className="passwordConfirmation-input"
                name="passwordConfirmation"
                type="password"
                placeholder="Confirm Password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                minLength={8}
              ></input>

              <button type="submit">Create Account</button>

              <p>
                Already have an account?{" "}
                <strong onClick={() => closeAndOpenSignIn()}>Log in</strong>
              </p>
            </form>
          </div>
        </div>
      </div>
    </CSSTransitionGroup>
  );
}

const SignInWindow = () => {
  const { closeWindows, toggleWindow } = useContext(LogInContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  const formSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
      })
      .then(() => closeWindows())
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const closeAndOpenCreate = () => {
    closeWindows();
    toggleWindow();
  };

  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="createAccountWindowPopUp">
        <div className="createAccount-window">
          <RxCross2
            size={25}
            className="exitButton"
            onClick={() => closeWindows()}
          />
          <div className="innerWindow">
            <h1>Sign In</h1>
            <form onSubmit={formSubmit}>
              <input
                className="email-input"
                name="email"
                type="email"
                placeholder="Email..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <input
                name="password"
                type="password"
                placeholder="Password..."
                required
                value={password}
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <button type="submit">Sign In</button>

              <p>
                Don&apos;t have an account?{" "}
                <strong onClick={() => closeAndOpenCreate()}>Create one</strong>
              </p>
            </form>
          </div>
        </div>
      </div>
    </CSSTransitionGroup>
  );
};

export { useAuthentication, CreateAccountWindow, SignInWindow };
