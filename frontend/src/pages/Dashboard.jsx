import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  //access the user's balance from the backend
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState("");
  // i want to show the id of current user also
  const [id, setId] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const formattedBalance = parseFloat(response.data.balance).toFixed(2);
        setBalance(formattedBalance);
      })
      .catch((error) => {
        console.error(error);
      });
    // Fetching user ID from the backend
    axios
      .get("http://localhost:3000/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setId(response.data._id);
        setUsername(response.data.firstName);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div>
      <Appbar username={username}/>
      <div className="m-8">
        <div>
          <p>User ID: {id.slice(-4)}</p>
        </div>
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
};

export default Dashboard;
