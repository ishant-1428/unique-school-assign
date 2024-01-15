import { createContext, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [subscribers, setSubscribers] = useState([]);

  const handleJoin = (userData) => {
    console.log(userData);
    // Your join logic here
    if (userData && userData.name && userData.email && userData.hexCode) {
      const newData = [...subscribers, userData];
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(newData),
        "unique-school"
      ).toString();
      localStorage.setItem("subscribers", encryptedData);
      setSubscribers(newData);
      setUserData(userData);
    } else {
      alert("Invalid input. Please check your data.");
    }
  };

  const contextValue = {
    userData,
    subscribers,
    handleJoin,
    setSubscribers,
  };

  useEffect(() => {
    const data = localStorage.getItem("subscribers");
    if (data) {
      const decryptedData = CryptoJS.AES.decrypt(data, "unique-school");
      const decryptedDataString = decryptedData.toString(CryptoJS.enc.Utf8);
      if (decryptedDataString === "") return;

      const parsedData = JSON.parse(decryptedDataString);
      setSubscribers(parsedData);
    }
  }, []);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
