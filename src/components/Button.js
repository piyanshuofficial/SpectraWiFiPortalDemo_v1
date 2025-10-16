// src/components/Button.js

import React from "react";
import "./Button.css";

const Button = React.forwardRef(
  (
    { variant = "primary", disabled = false, children, onClick, title, type = "button", ...rest },
    ref
  ) => {
    const className = `btn btn-${variant}${disabled ? " btn-disabled" : ""}`;
    return (
      <button
        type={type}
        className={className}
        disabled={disabled}
        onClick={onClick}
        title={title}
        aria-disabled={disabled}
        ref={ref}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

export default Button;
