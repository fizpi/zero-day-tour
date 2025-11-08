import React, { useState, useEffect } from "react";
import "./AddMemberPayment.css";
import callGetApi, { callPostApi } from "../apiWrapper";

export default function FundTransfer({organizer, refresh}) {
  const [form, setForm] = useState({
    from: "",
    amount: "",
    to: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // console.log("Submitting:", form);
    if (form.from === "" || form.amount==="" || form.to==="") {
      alert("Please fill all the fields");
      return
    }

    if (form.from === form.to) {
      alert("Please select different members");
      return
    }

    setLoading(true);

    callPostApi("fundTransfer", {
      "from": form.from,
      "amount": parseFloat(form.amount),
      "to": form.to
    }).then((res) => {
      setLoading(false);
      if (res.status === "Success") {
        alert(res.message);
        setForm({
          from: "",
          amount: "",
          to: ""
        })
        refresh();
      } else {
        alert(res.message);
      }
    })
  };

  return (
    <div className="add-payment-container">
      <h2>Fund Transfer</h2>

      <form onSubmit={handleSubmit} className="add-payment-form">
        <label>From:</label>
        <select name="from" value={form.from} onChange={handleChange} required>
          <option value="">Select Member</option>
          {organizer.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <label>Amount:</label>
        <input
          type="number"
          step="0.01"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          required
        />

        <label>To:</label>
        <select name="to" value={form.to} onChange={handleChange} required>
          <option value="">Select Member</option>
          {organizer.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>

        {loading && <p>Loading...</p>}
        {!loading && <button type="submit">Submit</button>}
      </form>
    </div>
  );
}
