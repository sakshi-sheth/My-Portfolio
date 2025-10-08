import React from "react";
import { useAuth } from "../contexts/AuthContext";

const AuthDebug: React.FC = () => {
  const { user, token, isAuthenticated, isAdmin, isLoading } = useAuth();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "#000",
        color: "#fff",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <div>
        <strong>Auth Debug</strong>
      </div>
      <div>Loading: {isLoading ? "Yes" : "No"}</div>
      <div>Authenticated: {isAuthenticated ? "Yes" : "No"}</div>
      <div>Is Admin: {isAdmin ? "Yes" : "No"}</div>
      <div>User: {user ? user.email : "None"}</div>
      <div>Token: {token ? "Present" : "None"}</div>
    </div>
  );
};

export default AuthDebug;
