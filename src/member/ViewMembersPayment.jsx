import { useEffect, useState } from "react";
import "./AllMembers.css";
import callGetApi from "../apiWrapper";

export default function ViewMembersPayment({members}) {
  const [payments, setPayments] = useState([]);
  const [name, setName] = useState('');
    const [status, setStatus] = useState("Loading");
    // Simulate API call
    useEffect(() => {
      fetchMembersPayment();
    }, []);

  const handleChange = (e) => {
    setName(e.target.value)
  };
  
  const fetchMembersPayment = async () => {
    setStatus("Loading");
    callGetApi("getAllPaids").then((res) => {
      if (res.status === "Success") {
        setPayments(res.data);
        setStatus("Success");
      } else {
        setStatus("Error");
      }
    })
  };
  return (
    <div className="members-container">
      <h2>All Payments</h2>
      <select name="whoPaid" value={name} onChange={handleChange} required>
        <option value="">All</option>
        {members.map((m) => (
          <option key={m[0]} value={m[0]}>{m[0]}</option>
        ))}
      </select>
      <div className="table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Paid To</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((m, index) => (
              (m.Name===name || name==='') &&
              <tr key={index}>
                <td>{m.Name}</td>
                <td>{m.Amount}</td>
                <td>{m['Paid to']}</td>
                <td>{Date.parse(m.Date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
