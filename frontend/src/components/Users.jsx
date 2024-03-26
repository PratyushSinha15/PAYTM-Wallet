import { useState, useEffect } from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Users = () => {
  // providing a hard coded list of users later we will fetch it from the backend
  // const [users,setUsers]=useState([{
  //     firstName: "Pratyush",
  //     lastName: "Sinha",
  //     _id:1
  // }]);

  //getting the actual data from the backend
  //here we first initialized it to an empty array and then we will use useEffect to fetch the data from the backend
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  //to store the current user data so that not include it in the list of users
  const [currentUser, setCurrentUser] = useState(null);

  //should add debouncing to the search query so that it will not make the request for every key press
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/user/bulk?filter=" + filter
        );
        setUsers(response.data.user);

        // Fetch the current user's ID
        const currentUserResponse = await axios.get(
          "http://localhost:3000/api/v1/user/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCurrentUser(currentUserResponse.data._id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [filter]);
  //here we are using the filter to filter the users based on the search query
  //if we not provide the dependency array filter then it will run infinitely
  //so we need to provide the filter as a dependency array so that it will run only when the filter value changes

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={handleFilterChange}
          type="text"
          placeholder="Search Users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>

      {/* //here we are rendering the users from the state variable users which we got from the backend */}
      <div>
        {users.map(
          (user) =>
            user._id !== currentUser && <User key={user._id} user={user} />
        )}
      </div>
    </>
  );
};

function User({ user }) {
  //using the navigate hook to navigate to the send money page
  const navigate = useNavigate();
  const lastFourDigits = user._id.slice(-4);
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0].toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col justify-center h-full">
          <div className="font-bold">
            {user.firstName} {user.lastname} (ID: {lastFourDigits})
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center h-full">
        <Button
          onClick={(e) => {
            navigate("/send?id=" + user._id + "&name=" + user.firstName);
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
