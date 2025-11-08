import { useEffect, useState } from "react";
import "./AllMembers.css";
import callGetApi from "../apiWrapper";
import { formatDDMON } from "../utils/date";

export default function AllFundTransfer({organizer}) {
  const [funds, setFunds] = useState([]);
  const [name, setName] = useState('');
  const [totalPayments, setTotalPayements] = useState(0);
    const [status, setStatus] = useState("Loading");
    // Simulate API call
    useEffect(() => {
      fetchAllTransfer();
    }, []);

  const handleChange = (e) => {
    let nn = e.target.value
    setName(nn)
    const f = funds.filter((e) => (e['To'] === nn || nn === ''));
    let sum = f.reduce((a, b) => a + b.Amount, 0);
    setTotalPayements(sum);
  };
  
  const fetchAllTransfer = async () => {
    setStatus("Loading");
    callGetApi("getAllFundTransfer").then((res) => {
      if (res.status === "Success") {
        res.data.sort((a, b) => Date.parse(b.Date) - Date.parse(a.Date));
        setFunds(res.data);
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
      <h2>All Fund Transfers</h2>
      <div className="paymentHeader">
        <select name="whoPaid" value={name} onChange={handleChange} required>
          <option value="">All</option>
          {organizer.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <p>Total Transfers: ₹<b>{totalPayments}</b></p>
      </div>
      <div className="table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Amount</th>
              <th>To</th>
              <th>Date</th>
            </tr>
          </thead>
          {
            status === "Success" && <tbody>
            {funds.map((m, index) => (
              (m.To===name || name==='') &&
              <tr key={index}>
                <td>{m.From}</td>
                <td>₹<b>{m.Amount}</b></td>
                <td>{m['To']}</td>
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
