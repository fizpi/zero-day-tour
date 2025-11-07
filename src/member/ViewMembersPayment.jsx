import { useEffect, useState } from "react";
import "./AllMembers.css";
import callGetApi from "../apiWrapper";
import { formatDDMON } from "../utils/date";

export default function ViewMembersPayment({members}) {
  const [payments, setPayments] = useState([]);
  const [name, setName] = useState('');
  const [totalPayments, setTotalPayements] = useState(0);
    const [status, setStatus] = useState("Loading");
    // Simulate API call
    useEffect(() => {
      fetchMembersPayment();
    }, []);

  const handleChange = (e) => {
    let nn = e.target.value
    setName(nn)
    const f = payments.filter((e) => (e['Name'] === nn || nn === ''));
    let sum = f.reduce((a, b) => a + b.Amount, 0);
    setTotalPayements(sum);
  };
  
  const fetchMembersPayment = async () => {
    setStatus("Loading");
    callGetApi("getAllPaids").then((res) => {
      if (res.status === "Success") {
        res.data.sort((a, b) => Date.parse(b.Date) - Date.parse(a.Date));
        setPayments(res.data);
        let sum = res.data.reduce((a, b) => a + b.Amount, 0);
        setTotalPayements(sum);
        setStatus("Success");
      } else {
        setStatus("Error");
      }
    })
  };
  return (
    <div className="members-container">
      <h2>All Payments</h2>
      <div className="paymentHeader">
        <select name="whoPaid" value={name} onChange={handleChange} required>
          <option value="">All</option>
          {members.map((m) => (
            <option key={m[0]} value={m[0]}>{m[0]}</option>
          ))}
        </select>
        <p>Total Collected: ₹<b>{totalPayments}</b></p>
      </div>
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
          {
            status === "Success" && <tbody>
            {payments.map((m, index) => (
              (m.Name===name || name==='') &&
              <tr key={index}>
                <td>{m.Name}</td>
                <td>₹<b>{m.Amount}</b></td>
                <td>{m['Paid to']}</td>
                <td>{formatDDMON(Date.parse(m.Date))}</td>
              </tr>
            ))}
            </tbody>
          }
          {
            status === "Loading" && <tbody>
            <tr>
              <td>Loading...</td>
            </tr>
            </tbody>
          }
          {
            status === "Error" && <tbody>
            <tr>
              <td>Error</td>
            </tr>
            </tbody>
          }
          
        </table>
      </div>
    </div>
  );
}
