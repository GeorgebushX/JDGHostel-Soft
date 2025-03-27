import React from "react";

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="d-flex align-items-center rounded bg-white border shadow-sm p-3">
      <div
        className={`d-flex align-items-center justify-content-center ${color} text-white px-3 fs-2 rounded-start`}
      >
        {icon}
      </div>
      <div className="ps-3">
        <p className="h6 fw-semibold mb-1">{text}</p>
        <p className="h5 fw-bold">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
