import logo from "./logo.svg";
import styles from "./App.module.css";
import { Login } from "./LoginSection/Login";
import { TabularData } from "./TabularDataSection/TabularData";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { UserProvider } from "./UserContext";
import Test from "./test";

function App() {
  const [subscribers, setSubscribers] = useState([]);

  const handleJoinButton = ({ name, email, hexCode }) => {
    const newData = [...subscribers, { name, email, hexCode }];
    setSubscribers(newData);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(newData),
      "unique-school"
    ).toString();
    localStorage.setItem("subscribers", encryptedData);
    console.log(subscribers, "subScribers data0");
  };

  return (
    <UserProvider>
      <div className={styles.container}>
        <Login />
        <TabularData />
      </div>
    </UserProvider>
  );
}

export default App;
