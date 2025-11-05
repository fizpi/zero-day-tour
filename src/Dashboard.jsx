import "./Dashboard.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import AllMembers from "./member/AllMembers";
import AddMemberPayment from "./member/AddMemberPayment";
import callGetApi from "./apiWrapper";
import ViewMembersPayment from "./member/ViewMembersPayment";

export default function Dashboard({ onLogout }) {
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("Loading");
  // Simulate API call
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setStatus("Loading");
    callGetApi("getAllMembers").then((res) => {
      if (res.status === "Success") {
        setMembers(res.data);
        setStatus("Success");
      } else {
        setStatus("Error");
      }
    })
  };

  return (
    <main>
      <Navbar onLogout={onLogout} />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<DashboardContent onLogout={onLogout} status={status} />} />
          <Route path="/members" element={<AllMembers members={members} />} />
          <Route path="/add-member-payment" element={<AddMemberPayment members={members} />} />
          <Route path="/view-member-payment" element={<ViewMembersPayment members={members} />} />
          <Route path="/add-expense" element={<ViewMembersPayment members={members} />} />
          <Route path="/view-expenses" element={<ViewMembersPayment members={members} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </main>
  );
}

function DashboardContent({onLogout, status}) {
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
        <div className="dashboard-box">
          <h2>Welcome, {name} 👋</h2>
          <p>Select an option below:</p>
          {
            status === "Success" && <div className="dashboard-buttons">
              <button onClick={() => navigate("/members")}>View All Members</button>
              <button onClick={() => navigate("/add-member-payment")}>Add Member Payment</button>
              <button onClick={() => navigate("/view-member-payment")}>View Member Payment</button>
              <button onClick={() => navigate("/add-expense")}>Add Expanse</button>
              <button onClick={() => navigate("/view-expenses")}>View All Expanse</button>
            </div>
          }
          {
            status === "Loading" && <p>Please wait</p>
          }
          {
            status === "Error" && <p>Something went wrong! Please try again later</p>
          }

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
  )
}