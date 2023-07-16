import React, { useEffect, useState } from "react";
import "../Styles/FollowPop.scss";
import { getFirestore, app, collection, getDoc, doc } from "../Firebase.js";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import uniqid from "uniqid";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";

interface FollowProps {
  tab: string;
  profileID: string;
  close: () => void;
}

interface userData {
  username: string;
  photoURL: string;
  userID: string;
}

const FollowPop: React.FC<FollowProps> = (props) => {
  const { tab, profileID, close } = props;
  const db = getFirestore(app);
  const [users, setUsers] = useState<userData[]>([]);

  //Get user data in following/follower doc
  const getData = async () => {
    const collectionRef = collection(db, "users", profileID, "follows");
    const docSnap = await getDoc(doc(collectionRef, tab));
    if (!docSnap.exists()) {
      return;
    }

    let docData;
    if (tab === "followers") {
      docData = docSnap.data().followers;
    } else if (tab === "following") {
      docData = docSnap.data().following;
    }

    const docSet = new Set<string>(docData);
    const docSetArr = Array.from(docSet);
    const queries: any = [];
    for (const docs of docSetArr) {
      const userRef = doc(db, "users", docs);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        return;
      }
      const userSnapData = {
        username: userSnap.data().settings.username,
        photoURL: userSnap.data().settings.photoURL,
        userID: docs,
      };
      queries.push(userSnapData);
    }
    setUsers(queries as userData[]);
  };

  useEffect(() => {
    const fetch = async () => {
      await getData();
    };
    fetch();
  }, []);

  return (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
        <div className="follow-container">
          <RxCross2 size={25} className="exitButton" onClick={() => close()} />
          {users?.map((dat) => {
            return (
              <div className="user" key={uniqid()}>
                <div>
                  <Link to={`/profile/${dat.userID}`}>
                    <img className="userPfp" src={dat.photoURL}></img>
                    <p>{dat.username}</p>
                  </Link>
                </div>

                <button>Message</button>
              </div>
            );
          })}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default FollowPop;
