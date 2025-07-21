import React from "react";
import $ from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return <div className={$.error}>{message}</div>;
};

export default ErrorMessage;