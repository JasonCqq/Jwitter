import React, { useContext, useEffect, useState } from "react";
import "../Styles/RightSidebar.scss";
import { FcGoogle } from "react-icons/fc";
import { FiEye } from "react-icons/fi";
import { useAuthentication } from "./sharedFunctions";
import { LogInContext } from "./Routeswitch";
import { useGlobalContext } from "./AuthContext";
import { CSSTransitionGroup } from "react-transition-group";
import uniqid from "uniqid";

interface Article {
  title: string;
  url: string;
  publishedAt: string;
  description: string;
}

const RightSidebar = () => {
  const { googleSignIn } = useAuthentication();
  const { toggleWindow, toggleSignIn } = useContext(LogInContext);
  const { user } = useGlobalContext();
  const [hotTopics, setHotTopics] = useState<any>([]);

  //Fetches 4 Articles from newsapi and display
  useEffect(() => {
    const url =
      "https://newsapi.org/v2/top-headlines?" +
      "country=us&" +
      `apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;
    const req = new Request(url);
    fetch(req)
      .then((response) => response.json())
      .then((data: { articles: Article[] }) =>
        setHotTopics([
          data.articles[0],
          data.articles[1],
          data.articles[2],
          data.articles[3],
        ])
      );
  }, []);

  const signUp = () => {
    return (
      <div className="signup-container">
        <h1>New to Jwitter?</h1>
        <p>Sign up now to get your own personalized timeline!</p>
        <button onClick={() => googleSignIn()}>
          <FcGoogle size={20} /> Sign in with Google
        </button>
        <button onClick={() => toggleWindow()}>Create account</button>
        <button onClick={() => toggleSignIn()}>
          <strong>Sign In</strong>
        </button>
        <p>
          By signing up, you agree to the <strong>Terms of Service</strong> and{" "}
          <strong>Privacy Policy</strong>, including <strong>Cookie Use</strong>
          .
        </p>
      </div>
    );
  };

  const trending = () => {
    return (
      <div className="trending-tab">
        <div className="search-bar">
          <input placeholder="Search Jwitter"></input>
        </div>

        <div className="recentevents-tab">
          <h1>Current News</h1>

          <div className="events-container">
            {hotTopics.map((topic: Article) => {
              return (
                <div className="event-item" key={uniqid()}>
                  <h1>{topic.title}</h1>
                  <p>{topic.description}</p>
                  <span>
                    <p>Published: {topic.publishedAt.slice(0, 10)}</p>
                    <a href={topic.url} target="_blank" rel="noreferrer">
                      <FiEye size={20} color="#7856ff"></FiEye>
                    </a>
                  </span>
                </div>
              );
            })}
            <p style={{ paddingLeft: "7px" }}>News source from newsapi.org</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="right-sidebar">
        {user ? trending() : signUp()}

        <div className="footer-notes">
          <div>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
            <p>Cookie Policy</p>
          </div>
          <div>
            <p>Accessibility</p>
            <p>Ads Info</p>
            <p>About Us</p>
            <p>More...</p>
          </div>
        </div>
      </div>
    </CSSTransitionGroup>
  );
};

export default RightSidebar;
