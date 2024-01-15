import React, { useState } from "react";
import styles from "./Login.module.css";
import { useUserContext } from "../UserContext";
import CryptoJS from "crypto-js";

export const Login = ({ handleJoinButton }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hexCode, setHexCode] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [count, setCount] = useState(0);

  const { handleJoin } = useUserContext();

  const handleOnClick = (e) => {
    e.preventDefault();
    if (name && email && hexCode && hexCode.length === 16) {
      // handleJoinButton({name,email,hexCode});

      handleJoin({ name, email, hexCode });
      setName("");
      setEmail("");
      setHexCode("");
    } else {
      alert("Check your input and try again!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1 className="" style={{ textAlign: "center" }}>
          Join{" "}
          <span className={styles.coloredLetter}>
            Unique <br />
            Schools
          </span>
        </h1>
      </div>
      <form className={styles.form}>
        <label className={styles.formInput}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="16 digit hex code"
            value={hexCode}
            maxLength={16}
            onChange={(e) => setHexCode(e.target.value)}
          />
          <br />
          <button className={styles.submitButton} onClick={handleOnClick}>
            Join
          </button>
        </label>
      </form>
    </div>
  );
};
