import React from "react";
import "./ExpanseModal.css";
import formatDDMONYYYY from "../utils/date";

export default function ExpanseModal({ isOpen, onClose, title, data }) {
  if (!isOpen || !data) return null;

  const {
    "Date": date, 
    "Expanse name": expanseName,
    Amount,
    "Paid By": paidBy,
    "Added By": addedBy,
    ...participants
  } = data;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // stop background close
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="expense-info">
            <p><strong>Date:</strong> {formatDDMONYYYY(Date.parse(date))}</p>
            <p><strong>Expense:</strong> {expanseName}</p>
            <p><strong>Amount:</strong> ₹{Amount.toFixed(2)}</p>
            <p><strong>Paid By:</strong> {paidBy}</p>
            {addedBy && <p><strong>Added By:</strong> {addedBy}</p>}
          </div>

          <div className="divider" />

          <div className="participants">
            <h3>Participants</h3>
            <div className="participant-grid">
              {Object.entries(participants).map(([name, value]) => (
                <div key={name} className="participant-card">
                  <span className="participant-name">{name}</span>
                  <span className="participant-share">
                    {value ? value : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
