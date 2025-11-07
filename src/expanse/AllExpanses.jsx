import callGetApi from "../apiWrapper";
import formatDDMONYYYY, { formatDDMON } from "../utils/date";
import "./AllExpanses.css";
import React, { useState, useEffect } from "react";
import ExpanseModal from "./ExpanseModal";

export default function AllExpanses(props) {
  const [expanses, setExpanses] = useState([]);
  const [name, setName] = useState('');
  const [totalExpanded, setTotalExpanded] = useState(0);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalData, setModalData] = useState({});
  const [status, setStatus] = useState("Loading");
    // Simulate API call
    useEffect(() => {
      fetchExpanses();
    }, []);

  const handleChange = (e) => {
    let nn = e.target.value
    setName(nn);
    const f = expanses.filter((e) => (e['Paid By'] === nn || nn === ''));
    let sum = f.reduce((a, b) => a + b.Amount, 0);
    setTotalExpanded(sum);
  };
  
  const fetchExpanses = async () => {
    setStatus("Loading");
    callGetApi("getAllExpanses").then((res) => {
      if (res.status === "Success") {
        res.data.sort((a, b) => Date.parse(b.Date) - Date.parse(a.Date));
        setExpanses(res.data);
        let sum = res.data.reduce((a, b) => a + b.Amount, 0);
        setTotalExpanded(sum);
        setStatus("Success");
      } else {
        setStatus("Error");
      }
    })
  };

  return (
    <div className="members-container">
      <h2>All Expanses</h2>
      <div className="headerSection">
        <select name="whoPaid" value={name} onChange={handleChange} required>
          <option value="">All</option>
          {['Sumit', 'Ezra', 'Sonu'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <p>Total Expanse: ₹<b>{totalExpanded}</b></p>
      </div>
      <div className="table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Expanse Name</th>
              <th>Amount</th>
              <th>Paid By</th>
            </tr>
          </thead>
          {
            status === "Success" && <tbody>
            {expanses.map((m, index) => (
              (m['Paid By']===name || name==='') &&
              <tr key={index} onClick={() =>{setModalData(m), setIsModalOpen(true)}}>
                <td>{formatDDMON(Date.parse(m.Date))}</td>
                <td>{m['Expanse name']}</td>
                <td>₹<b>{m.Amount}</b></td>
                <td>{m['Paid By']}</td>
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
      <ExpanseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Details"
        data={modalData}/>
    </div>
  );
}
