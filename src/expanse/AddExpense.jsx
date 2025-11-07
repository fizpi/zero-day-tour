import React, { useState, useEffect } from "react";
import "./AddExpense.css";
import { callPostApi } from "../apiWrapper";


const AddExpense = ({members, organizer, refresh}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [paidBy, setPaidBy] = useState(organizer[0]);
  const [selectedMembers, setSelectedMembers] = useState([...(members.map((m) => m[0]))]);
  const [splitType, setSplitType] = useState("equal");
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  // Auto calculate when amount or selected members change
  useEffect(() => {
    if (splitType === "equal") {
      autoSplitEqual();
    } else if (splitType === "percentage") {
      autoSplitPercentage();
    }
  }, [amount, selectedMembers, splitType]);

  const handleMemberSelect = (member) => {
    let updated;
    if (selectedMembers.includes(member)) {
      updated = selectedMembers.filter((m) => m !== member);
    } else {
      updated = [...selectedMembers, member];
    }
    setSelectedMembers(updated);
  };

  const autoSplitEqual = () => {
    const total = parseFloat(amount);
    if (!total || selectedMembers.length === 0) return;

    const equalShare = +(total / selectedMembers.length).toFixed(2);
    const newMeta = {};
    selectedMembers.forEach((m) => (newMeta[m] = equalShare));
    setMeta(newMeta);
  };

  const autoSplitPercentage = () => {
    const total = parseFloat(amount);
    if (!total || selectedMembers.length === 0) return;

    let totalPercent = 0;
    const newMeta = {};
    selectedMembers.forEach((m) => {
      const percent = meta[m + "_percent"] || +(100 / selectedMembers.length).toFixed(2);
      totalPercent += percent;
      newMeta[m] = +((total * percent) / 100).toFixed(2);
    });

    if (totalPercent !== 100) {
      console.warn("⚠️ Percentage does not sum to 100%");
    }

    setMeta(newMeta);
  };

  const handleCustomChange = (member, value) => {
    setMeta((prev) => ({ ...prev, [member]: +value }));
  };

  const handlePercentageChange = (member, value) => {
    setMeta((prev) => ({
      ...prev,
      [member + "_percent"]: +value,
    }));
  };

  const handleSubmit = () => {
    if (name=='' || amount=='' || paidBy=='') {
        alert("Please fill all the fields");
        return
    }
    const payload = {
      name,
      amount: +amount,
      paidBy,
      meta,
    };
    setLoading(true);
    callPostApi("addNewExpanse", payload).then((res) => {
        setLoading(false);
        if (res.status === "Success") {
            alert(res.message);
            refresh();
        } else {
            alert(res.message);
        }
    })
  };

  return (
    <div className="add-expense">
      <h2>Add Expense</h2>

      <div className="form">
        <label>Expense Name</label>
        <input
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter amount"
        />

        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <label>Paid By</label>
        <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
          {organizer.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="split-tabs">
        {["equal", "percentage", "custom", "adjust"].map((type) => (
          <button
            key={type}
            className={splitType === type ? "active" : ""}
            onClick={() => setSplitType(type)}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="member-list">
        {members.map((m) => (
          <div
            key={m[0]}
            className={`member-row ${
              selectedMembers.includes(m[0]) ? "selected" : ""
            }`}
          >
            <div className="member-name" onClick={() => handleMemberSelect(m[0])}>
              <input
                type="checkbox"
                checked={selectedMembers.includes(m[0])}
                onChange={() => handleMemberSelect(m[0])}
              />
              <span>{m[0]}</span>
            </div>

            {selectedMembers.includes(m[0]) && (
              <div className="member-value">
                {splitType === "percentage" && (
                  <>
                    <input
                      type="number"
                      value={meta[m[0] + "_percent"] || ""}
                      onChange={(e) =>
                        handlePercentageChange(m, e.target.value)
                      }
                      placeholder="%"
                      min="0"
                      max="100"
                    />
                    <span>%</span>
                  </>
                )}

                {(splitType === "custom" || splitType === "adjust") && (
                  <input
                    type="number"
                    value={meta[m[0]] || ""}
                    onChange={(e) => handleCustomChange(m, e.target.value)}
                    placeholder="Amount"
                  />
                )}

                {splitType === "equal" && (
                  <span className="readonly-amt">
                    ₹{meta[m[0]] ? meta[m[0]].toFixed(2) : "0.00"}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {!loading && <button onClick={handleSubmit} className="submit-btn">
        Add Expense
      </button>}
      
    </div>
  );
};

export default AddExpense;
