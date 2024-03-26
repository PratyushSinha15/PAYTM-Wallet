import React, { useState } from "react";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/user/signin", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signin failed:", error);
      alert("Invalid credentials");
    }
  };

  const clickHandler = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign In"} />
          <SubHeading label="Enter your credentials to access your account" />
          <form onSubmit={handleSubmit}>
            <InputBox
              type="email"
              name="username"
              placeholder="email@gmail.com"
              label={"Email"}
              value={formData.username}
              onChange={handleChange}
            />
            <InputBox
              type="password"
              name="password"
              placeholder="Your password"
              label={"Password"}
              value={formData.password}
              onChange={handleChange}
            />

            <div className="pt-4">
              <Button onClick={clickHandler} type="submit" label={"Sign in"} />
            </div>
          </form>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
