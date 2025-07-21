import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {
  const variantClass =
    variant === "secondary" ? $.secondary : $.primary;

  return (
    <button
      className={`${$.button} ${variantClass}`}
      type={type}
      onClick={onClick}
    >
      {children}
      {loading && (
        <span
          className={$.loading}
          data-testid="loading-spinner"
          aria-label="Loading"
        >
          Loading...
        </span>
      )}
    </button>
  );
};

export default Button;
