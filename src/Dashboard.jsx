import "./Dashboard.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import AllMembers from "./member/AllMembers";
import AddMemberPayment from "./member/AddMemberPayment";
import callGetApi from "./apiWrapper";
import ViewMembersPayment from "./member/ViewMembersPayment";
import AllExpanses from "./expanse/AllExpanses";
import AddExpense from "./expanse/AddExpense";

export default function Dashboard({ onLogout }) {
  const [members, setMembers] = useState([]);
  const [overview, setOverview] = useState();
  const organizer = ["Sumit", "Ezra", "Sonu"];
  const [status, setStatus] = useState("Loading");
  const [overviewStatus, setOverviewStatus] = useState("Loading");
  const refresh = () => {
    fetchOverview();
  };
  // Simulate API call
  useEffect(() => {
    fetchMembers();
    fetchOverview();
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

  const fetchOverview = async () => {
    setOverviewStatus("Loading");
    callGetApi("getOverview").then((res) => {
      if (res.status === "Success") {
        setOverviewStatus("Success");
        setOverview(res.data);
      } else {
        setOverviewStatus("Error");
      }
    })
  };

  return (
    <main>
      <Navbar onLogout={onLogout} />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<DashboardContent overview={overview} overviewStatus={overviewStatus} onLogout={onLogout} status={status} organizer={organizer} />} />
          <Route path="/members" element={<AllMembers members={members} />} />
          <Route path="/add-member-payment" element={<AddMemberPayment refresh={refresh} members={members} organizer={organizer} />} />
          <Route path="/view-member-payment" element={<ViewMembersPayment members={members} organizer={organizer} />} />
          <Route path="/add-expense" element={<AddExpense refresh={refresh} members={members} organizer={organizer} />} />
          <Route path="/view-expenses" element={<AllExpanses members={members} organizer={organizer} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </main>
  );
}

function DashboardContent({onLogout, status, overview, overviewStatus, organizer}) {
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  return (
    <div>
      <Overview overview={overview} overviewStatus={overviewStatus} />
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
    </div>
  )
}

const members = [
  { name: "Sumit", totalCollection: 5000, amountSpent: 3200 },
  { name: "Ezra", totalCollection: 4500, amountSpent: 4100 },
  { name: "Sonu", totalCollection: 3000, amountSpent: 2800 },
  { name: "Anjali", totalCollection: 2000, amountSpent: 2500 },
];

// // Example overall calculation
// const totalCollection = members.reduce((a, b) => a + b.totalCollection, 0);
// const totalSpent = members.reduce((a, b) => a + b.amountSpent, 0);
// const notCollected = totalCollection - totalSpent;

const Overview = ( { overview, overviewStatus }) => {
  if (!overview) {
    return (
      "Please wait"
    )
  }
  return (
    <div className="overview-page">
      <h2>Overview Dashboard</h2>

      {/* --- TOP SUMMARY CARDS --- */}
      <div className="top-summary">
        <div className="summary-card highlight">
          <h3>Total Collection</h3>
          <p>₹{overview.totalCollection}</p>
        </div>
        <div className="summary-card warning">
          <h3>Not Collected</h3>
          <p>₹{overview.notCollected}</p>
        </div>
        <div className="summary-card highlight">
          <h3>Balance</h3>
          <p>₹{overview.totalAmountLeft.toFixed(2)}</p>
        </div>
      </div>

      {/* --- MEMBER DETAILS --- */}
      <h3 className="section-title">Member Details</h3>
      <div className="member-grid">
        {overview.organizer.map((m) => {
          const amountExpands = m.total - m.have;
          return (
            <div key={m.name} className="member-card">
              <div className="member-header">
                <h4>{m.name}</h4>
              </div>

              <div className="member-info">
                <div className="info-row">
                  <span>Total Collection</span>
                  <strong>₹{m.total}</strong>
                </div>
                <div className="info-row">
                  <span>Amount Spent</span>
                  <strong>₹{amountExpands.toFixed(2)}</strong>
                </div>
                <div className="info-row">
                  <span>Amount Left</span>
                  <strong
                    style={{ color: "green" }}
                  >
                    ₹{m.have.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
