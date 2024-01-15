import styles from "./App.module.css";
import { Login } from "./LoginSection/Login";
import { TabularData } from "./TabularDataSection/TabularData";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <UserProvider>
      <div className={`container ${styles.container}`}>
        <Login />
        <TabularData />
      </div>
    </UserProvider>
  );
}

export default App;