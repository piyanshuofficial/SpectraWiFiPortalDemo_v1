// src/styles/reportStyles.js

export const tableStyles = {
  container: {
    background: "#fff",
    borderRadius: 6,
    boxShadow: "0 1px 4px #0001",
    marginBottom: 16,
    overflowX: "auto",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    minWidth: 280,
    fontSize: "12px", // Reduced font size
  },
  thead: {
    backgroundColor: "#5B8AC3",
    color: "#fff",
  },
  th: {
    padding: "8px 12px", // Reduced padding
    fontWeight: 600,
    fontSize: 12, // Smaller font
    textAlign: "center",
    userSelect: "none",
  },
  td: {
    padding: "8px 12px", // Reduced padding
    fontSize: 11, // Smaller font
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    verticalAlign: "middle"
  },
  stripedRow: (idx) => ({
    backgroundColor: idx % 2 === 0 ? "#f7faff" : "#fff",
  }),
};


export const chartContainerStyle = {
  margin: "0 auto 12px auto",
  width: "100%",
  maxWidth: "800px", //PREVENT OVER-STRETCHING
  height: 200,
  background: "#fff",
  borderRadius: 6,
  boxShadow: "0 1px 4px #0001",
  padding: 10,
  marginBottom: 12,
  boxSizing: "border-box",
};