import React, { useState, useEffect } from "react";
import "./AddMemberPayment.css";
import callGetApi, { callPostApi } from "../apiWrapper";

export default function AddMemberPayment({members,organizer, refresh}) {
  const [form, setForm] = useState({
    whoPaid: "",
    amount: "",
    paidTo: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // console.log("Submitting:", form);
    if (form.whoPaid === "" || form.amount==="" || form.paidTo==="") {
      alert("Please fill all the fields");
      return
    }

    callPostApi("addNewPayment", {
      "name": form.whoPaid,
      "amount": parseFloat(form.amount),
      "paidTo": form.paidTo
    }).then((res) => {
      if (res.status === "Success") {
        alert(res.message);
        setForm({
          whoPaid: "",
          amount: "",
          paidTo: ""
        })
        refresh();
      } else {
        alert(res.message);
      }
    })
  };

  return (
    <div className="add-payment-container">
      <h2>Add Member Payment</h2>

      <form onSubmit={handleSubmit} className="add-payment-form">
        <label>Who Paid:</label>
        <select name="whoPaid" value={form.whoPaid} onChange={handleChange} required>
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m[0]} value={m[0]}>{m[0]}</option>
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

        <label>Paid To:</label>
        <select name="paidTo" value={form.paidTo} onChange={handleChange} required>
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
