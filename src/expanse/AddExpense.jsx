import React, { useState, useEffect } from "react";
import "./AddExpense.css";
import { callPostApi } from "../apiWrapper";
import "./ExpanseModal.css";

const AddExpense = ({members, organizer, refresh}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(organizer[0]);
  const [selectedMembers, setSelectedMembers] = useState([...(members.map((m) => m[0]))]);
  const [splitType, setSplitType] = useState("equal");
  const [meta, setMeta] = useState({});
  const [percentages, setPercentages] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  // Auto calculate when amount or selected members change
  useEffect(() => {
    if (splitType === "equal") {
      autoSplitEqual();
    } else if (splitType === "percentage") {
      autoSplitPercentage();
    }
  }, [amount, selectedMembers, splitType]);

  // Recalculate amounts when percentages change
  useEffect(() => {
    if (splitType === "percentage") {
      calculateAmountsFromPercentages();
    }
  }, [percentages]);

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
    if (!total || selectedMembers.length === 0) {
      setMeta({});
      return;
    }

    const equalShare = +(total / selectedMembers.length).toFixed(2);
    const newMeta = {};
    selectedMembers.forEach((m) => (newMeta[m] = equalShare));
    setMeta(newMeta);
  };

  const autoSplitPercentage = () => {
    const total = parseFloat(amount);
    if (!total || selectedMembers.length === 0) {
      setPercentages({});
      setMeta({});
      return;
    }

    // Initialize percentages equally if not set
    const newPercentages = {};
    const equalPercent = +(100 / selectedMembers.length).toFixed(2);
    
    selectedMembers.forEach((m) => {
      newPercentages[m] = percentages[m] !== undefined ? percentages[m] : equalPercent;
    });
    
    setPercentages(newPercentages);
  };

  const calculateAmountsFromPercentages = () => {
    const total = parseFloat(amount);
    if (!total || selectedMembers.length === 0) return;

    const newMeta = {};
    selectedMembers.forEach((m) => {
      const percent = percentages[m] || 0;
      newMeta[m] = +((total * percent) / 100).toFixed(2);
    });

    setMeta(newMeta);
  };

  const handleCustomChange = (member, value) => {
    setMeta((prev) => ({ ...prev, [member]: value === "" ? "" : +value }));
  };

  const handlePercentageChange = (member, value) => {
    setPercentages((prev) => ({
      ...prev,
      [member]: value === "" ? "" : +value,
    }));
  };

  const getTotalPercentage = () => {
    return Object.values(percentages).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  const getTotalCustomAmount = () => {
    return Object.values(meta).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  const handleSubmit = () => {
    if (name === '' || amount === '' || paidBy === '') {
      alert("Please fill all the fields");
      return;
    }

    // Validation for percentage
    if (splitType === "percentage") {
      const totalPercent = getTotalPercentage();
      if (Math.abs(totalPercent - 100) > 0.01) {
        alert(`Total percentage must equal 100%. Current total: ${totalPercent.toFixed(2)}%`);
        return;
      }
    }

    // Validation for custom/adjust
    if (splitType === "custom" || splitType === "adjust") {
      const totalCustom = getTotalCustomAmount();
      const diff = Math.abs(totalCustom - parseFloat(amount));
      if (diff > 0.01) {
        if (splitType === "custom") {
          alert(`Total amounts (${totalCustom.toFixed(2)}) must equal expense amount (${amount})`);
          return;
        }
      }
    }

    const payload = {
      name,
      date,
      amount: +amount,
      paidBy,
      meta,
    };

    setLoading(true);
    callPostApi("addNewExpanse", payload).then((res) => {
      setLoading(false);
      if (res.status === "Success") {
        alert(res.message);
        // Reset form
        setName("");
        setAmount("");
        setMeta({});
        setPercentages({});
        refresh();
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <div className="add-expense">
      <h2>Add Expense</h2>

      <div className="form">
        <label>Expense Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter expense name"
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
        <div className="participant-date">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Participation</label>
            <button onClick={() => setIsModalOpen(true)}><h6>{splitType}</h6></button>
          </div>
        </div>
      </div>

      

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {!loading && (
        <button onClick={handleSubmit} className="submit-btn">
          Add Expense
        </button>
      )}

      <ExpanseParticipantModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          splitType={splitType}
          setSplitType={setSplitType}
          members={members}
          selectedMembers={selectedMembers}
          handleMemberSelect={handleMemberSelect}
          amount={amount}
          percentages={percentages}
          handlePercentageChange={handlePercentageChange}
          meta={meta}
          handleCustomChange={handleCustomChange}
          getTotalPercentage={getTotalPercentage}
          getTotalCustomAmount={getTotalCustomAmount}
          />
    </div>
  );
};

export default AddExpense;


function ExpanseParticipantModal({ isOpen, onClose, splitType, setSplitType, members, selectedMembers, handleMemberSelect, amount, percentages, handlePercentageChange, meta, handleCustomChange, getTotalPercentage, getTotalCustomAmount }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // stop background close
      >
        <div className="modal-header">
          <h2>Participants</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
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
                          value={percentages[m[0]] ?? ""}
                          onChange={(e) =>
                            handlePercentageChange(m[0], e.target.value)
                          }
                          placeholder="%"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                        <span>% = ₹{meta[m[0]]?.toFixed(2) || "0.00"}</span>
                      </>
                    )}

                    {(splitType === "custom" || splitType === "adjust") && (
                      <input
                        type="number"
                        value={meta[m[0]] ?? ""}
                        onChange={(e) => handleCustomChange(m[0], e.target.value)}
                        placeholder="Amount"
                        step="0.01"
                      />
                    )}

                    {splitType === "equal" && (
                      <span className="readonly-amt">
                        ₹{meta[m[0]]?.toFixed(2) || "0.00"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {splitType === "percentage" && (
            <div style={{ textAlign: "center", margin: "0.5rem 0", fontWeight: "600", color: getTotalPercentage() === 100 ? "#28a745" : "#dc3545" }}>
              Total: {getTotalPercentage().toFixed(2)}%
            </div>
          )}

          {(splitType === "custom" || splitType === "adjust") && amount && (
            <div style={{ textAlign: "center", margin: "0.5rem 0", fontWeight: "600", color: Math.abs(getTotalCustomAmount() - parseFloat(amount)) < 0.01 ? "#28a745" : "#dc3545" }}>
              Total: ₹{getTotalCustomAmount().toFixed(2)} / ₹{parseFloat(amount).toFixed(2)}
            </div>
          )}

          <button className="submit-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
