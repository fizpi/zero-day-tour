import "./AllMembers.css";

export default function AllMembers(props) {
  return (
    <div className="members-container">
      <h2>All Members</h2>
      <div className="table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {props.members.map((m, index) => (
              <tr key={index}>
                <td>{m[0]}</td>
                <td>{m[1] || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
