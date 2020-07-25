import React from "react";

const footerStyle = {
  backgroundColor: "white",
  color: "black",
  borderTop: "1px solid #E7E7E7",
  //textAlign: "center",
  padding: "1rem",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "30px",
  width: "100%"
};


const phantomStyle = {
  display: "block",
  padding: "20px",
  height: "60px",
  width: "100%"
};

function Footer({ children }) {
  return (
    <div>
      <div style={phantomStyle} />
      <div style={footerStyle}>{children}</div>
    </div>
  );
}

export default Footer;