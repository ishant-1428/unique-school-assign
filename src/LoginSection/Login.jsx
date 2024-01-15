import React, { useState } from "react";
import styles from "./Login.module.css";
import { useUserContext } from "../UserContext";

export const Login = () => {
  // State variables to manage user input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hexCode, setHexCode] = useState("");

  // Access the handleJoin function from the context
  const { handleJoin } = useUserContext();

  // Handle join button click
  const handleOnClick = (e) => {
    e.preventDefault();
    // Validate user input
    if (name && email && hexCode && hexCode.length === 16) {
      // Call handleJoin function with user data and reset input fields
      handleJoin({ name, email, hexCode });
      setName("");
      setEmail("");
      setHexCode("");
    } else {
      // Show alert if input is invalid
      alert("Check your input and try again!");
    }
  };

  // Function to generate a random 16-digit hex code
  const hexCodeGenerator = () => {
    let n = Math.floor(Math.random() * 0xffffffffffffffff).toString(16);
    return n.slice(0, 16);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {/* Title */}
        <h1 className="" style={{ textAlign: "center" }}>
          Join{" "}
          {/* Colored part of the title */}
          <span className={styles.coloredLetter}>
            Unique <br />
            Schools
          </span>
        </h1>
      </div>
      {/* Form */}
      <form className={styles.form}>
        <label
          className={styles.formInput}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            style={{ paddingInline: 20 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          {/* Name Input */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            style={{ paddingInline: 20 }}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          {/* Hex Code Input */}
          <div className="flex">
            <input
              type="text"
              placeholder="16 digit hex code"
              value={hexCode}
              maxLength={16}
              style={{ paddingInline: 20 }}
              onChange={(e) => setHexCode(e.target.value)}
            />
          </div>
          {/* Generate Hex Code Button */}
          <button
            style={{
              background: "#d97083",
              padding: "10px 20px",
              borderRadius: "6px",
              marginTop: "8px",
              border: "none",
              fontWeight: "bold",
              color: "white",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              setHexCode(hexCodeGenerator().toString());
            }}
          >
            Generate Hex Code
          </button>
          <br />
          {/* Join Button */}
          <button
            className={styles.submitButton}
            onClick={handleOnClick}
            style={{ marginTop: 20 }}
          >
            Join
          </button>
        </label>
      </form>
    </div>
  );
};