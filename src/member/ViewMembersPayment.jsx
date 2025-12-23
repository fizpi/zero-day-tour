import { useEffect, useState } from "react";
import "./AllMembers.css";
import callGetApi from "../apiWrapper";
import { formatDDMON } from "../utils/date";

export default function ViewMembersPayment({members}) {
  const [payments, setPayments] = useState([]);
  const [name, setName] = useState('');
  const [totalPayments, setTotalPayements] = useState(0);
  const [status, setStatus] = useState("Loading");
  const [activeTab, setActiveTab] = useState("concrete"); // all | concrete
  const [concreteData, setConcreteData] = useState([]);
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
        setConcreteData(generateConcreteData(res.data));
        let sum = res.data.reduce((a, b) => a + b.Amount, 0);
        setTotalPayements(sum);
        setStatus("Success");
      } else {
        setStatus("Error");
      }
    })
  };

  const generateConcreteData = (data) => {
  const map = {};


  members.forEach(i=> {
      if (!map[i[0]]) {
      map[i[0]] = 0;
    }});

  data.forEach(item => {
    const name = item.Name;
    const amount = Number(item.Amount);

    if (!map[name]) {
      map[name] = 0;
    }
    map[name] += amount;
  });
    

  return Object.entries(map).map(([name, total]) => ({
    name,
    total
  }));
};

  return (
    <div className="members-container">
      <h2>All Payments</h2>
      <div className="paymentTabs">
      <button
        className={activeTab === "concrete" ? "activeTab" : ""}
        onClick={() => {setActiveTab("concrete"); handleChange({target:{value:''}})}}
      >
        Concrete
      </button>
      <button
        className={activeTab === "all" ? "activeTab" : ""}
        onClick={() => setActiveTab("all")}
      >
        All Payments
      </button>
    </div>
      {activeTab === "all" && (<div className="paymentHeader">
        <select name="whoPaid" value={name} onChange={handleChange} required>
          <option value="">All</option>
          {members.map((m) => (
            <option key={m[0]} value={m[0]}>{m[0]}</option>
          ))}
        </select>
        <p>Total Collected: ₹<b>{totalPayments}</b></p>
      </div>)}
      {
      activeTab === "all" && ( <div className="table-wrapper">
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
)}
{activeTab === "concrete" && (
  <div className="table-wrapper">
    <table className="members-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Total Amount</th>
        </tr>
      </thead>

      <tbody>
        {concreteData.map((c, index) => (
          <tr key={index}>
            <td>{c.name}</td>
            <td>₹<b>{c.total}</b></td>
          </tr>
        ))}
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
      </tbody>
    </table>
  </div>
)}
      <div className="memberTotalCollection">
          <h5>Total Collections</h5>
          <h4>₹<b>{totalPayments}</b></h4>
      </div>
    </div>
  );
}
