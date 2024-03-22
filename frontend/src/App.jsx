import React from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" element={<SendMoney />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
