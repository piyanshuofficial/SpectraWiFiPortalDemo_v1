// src/components/Button.js

import React from "react";
import Spinner from "./Loading/Spinner";
import "./Button.css";

const Button = React.forwardRef(
  (
    { 
      variant = "primary", 
      disabled = false, 
      loading = false,
      children, 
      onClick, 
      title, 
      type = "button", 
      ...rest 
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const className = `btn btn-${variant}${isDisabled ? " btn-disabled" : ""}${loading ? " btn-loading" : ""}`;
    
    return (
      <button
        type={type}
        className={className}
        disabled={isDisabled}
        onClick={onClick}
        title={title}
        aria-disabled={isDisabled}
        aria-busy={loading}
        ref={ref}
        {...rest}
      >
        {loading && <Spinner size="sm" color="white" className="btn-spinner" />}
        <span className={loading ? "btn-content-loading" : "btn-content"}>
          {children}
        </span>
      </button>
    );
  }
);

export default Button;