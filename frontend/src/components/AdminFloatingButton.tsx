import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./AdminFloatingButton.css";

const AdminFloatingButton: React.FC = () => {
  return (
    <motion.div
      className="admin-floating-button"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 2, // Delay appearance so it doesn't interfere with initial page load
        duration: 0.5,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Link to="/admin/login" className="admin-button-link">
        <motion.div
          className="admin-icon"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        >
          🔐
        </motion.div>
      </Link>
      <div className="admin-tooltip">Admin Access</div>
    </motion.div>
  );
};

export default AdminFloatingButton;
