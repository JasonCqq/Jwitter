import React from "react";
import "../Styles/Home.scss";

function Home() {
  return (
    <div className="main-home">
      <div className="info-bar">
        {" "}
        <h1>Home</h1>
      </div>

      <div id="tweets">
        <div>
          <h1>Test Tweet</h1>
          <p>This is a test tweet. I repeat, this is a test tweet.</p>
        </div>

        <div>
          <h1>Test Tweet</h1>
          <p>This is a test tweet. I repeat, this is a test tweet.</p>
        </div>

        <div>
          <h1>Test Tweet</h1>
          <p>This is a test tweet. I repeat, this is a test tweet.</p>
        </div>

        <div>
          <h1>Test Tweet</h1>
          <p>This is a test tweet. I repeat, this is a test tweet.</p>
        </div>

        <div>
          <h1>Test Tweet</h1>
          <p>This is a test tweet. I repeat, this is a test tweet.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
