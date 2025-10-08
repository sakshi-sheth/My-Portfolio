import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import SkillsManager from "./SkillsManager";
import ExperienceManager from "./ExperienceManager";
import ProjectsManager from "./ProjectsManager";
import MessagesManager from "./MessagesManager";
import ProfileManager from "./ProfileManager";
import "./AdminDashboard.css";

interface DashboardStats {
  totalSkills: number;
  totalProjects: number;
  totalExperience: number;
  totalMessages: number;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalSkills: 0,
    totalProjects: 0,
    totalExperience: 0,
    totalMessages: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch dashboard stats from APIs
  const fetchDashboardStats = async () => {
    try {
      setIsLoadingStats(true);

      // Get auth token from localStorage
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      // Fetch all data in parallel
      const [skillsRes, projectsRes, experienceRes, messagesRes] =
        await Promise.all([
          fetch("/api/skills", { headers }),
          fetch("/api/projects", { headers }),
          fetch("/api/experience", { headers }),
          fetch("/api/contact", { headers }),
        ]);

      // Parse responses
      const [skills, projects, experience, messages] = await Promise.all([
        skillsRes.ok ? skillsRes.json() : [],
        projectsRes.ok ? projectsRes.json() : [],
        experienceRes.ok ? experienceRes.json() : [],
        messagesRes.ok ? messagesRes.json() : [],
      ]);

      // Update stats with actual counts
      setStats({
        totalSkills: Array.isArray(skills) ? skills.length : 0,
        totalProjects: Array.isArray(projects) ? projects.length : 0,
        totalExperience: Array.isArray(experience) ? experience.length : 0,
        totalMessages: Array.isArray(messages) ? messages.length : 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Keep stats at 0 if there's an error
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "messages", label: "Messages", icon: "📧" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  const quickActions = [
    {
      title: "Add New Skill",
      description: "Add a new technical skill",
      icon: "➕",
      action: () => setActiveTab("skills"),
      color: "#10b981",
    },
    {
      title: "Create Project",
      description: "Add a new project to showcase",
      icon: "🎯",
      action: () => setActiveTab("projects"),
      color: "#3b82f6",
    },
    {
      title: "Update Experience",
      description: "Add or edit work experience",
      icon: "📝",
      action: () => setActiveTab("experience"),
      color: "#8b5cf6",
    },
    {
      title: "View Messages",
      description: "Check new contact messages",
      icon: "📨",
      action: () => setActiveTab("messages"),
      color: "#f59e0b",
    },
  ];

  // Generate dynamic recent activity based on current stats
  const recentActivity = [
    {
      action: `Portfolio contains ${stats.totalSkills} technical skills`,
      time: "Updated",
      type: "skill",
    },
    {
      action: `Showcasing ${stats.totalProjects} projects`,
      time: "Current",
      type: "project",
    },
    {
      action: `${stats.totalMessages} contact messages received`,
      time: stats.totalMessages > 0 ? "Recent" : "None yet",
      type: "message",
    },
    {
      action: `${stats.totalExperience} work experiences listed`,
      time: "Professional",
      type: "experience",
    },
    {
      action: "Dashboard statistics updated",
      time: "Just now",
      type: "system",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "skill":
        return "⚡";
      case "project":
        return "🚀";
      case "message":
        return "📧";
      case "experience":
        return "💼";
      case "system":
        return "📊";
      default:
        return "📝";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <motion.header
        className="admin-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.email}</p>
          </div>
          <div className="header-right">
            <motion.button
              className="logout-btn"
              onClick={logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🚪</span>
              Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <motion.nav
        className="admin-nav"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  className="tab-indicator"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.main
        className="admin-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <motion.section className="stats-section" variants={itemVariants}>
              <h2>Portfolio Statistics</h2>
              <div className="stats-grid">
                <motion.div
                  className="stat-card skills"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-icon">⚡</div>
                  <div className="stat-content">
                    <h3>{isLoadingStats ? "..." : stats.totalSkills}</h3>
                    <p>Skills</p>
                  </div>
                </motion.div>

                <motion.div
                  className="stat-card projects"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-icon">🚀</div>
                  <div className="stat-content">
                    <h3>{isLoadingStats ? "..." : stats.totalProjects}</h3>
                    <p>Projects</p>
                  </div>
                </motion.div>

                <motion.div
                  className="stat-card experience"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-icon">💼</div>
                  <div className="stat-content">
                    <h3>{isLoadingStats ? "..." : stats.totalExperience}</h3>
                    <p>Experience</p>
                  </div>
                </motion.div>

                <motion.div
                  className="stat-card messages"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-icon">📧</div>
                  <div className="stat-content">
                    <h3>{isLoadingStats ? "..." : stats.totalMessages}</h3>
                    <p>Messages</p>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Quick Actions */}
            <motion.section
              className="quick-actions-section"
              variants={itemVariants}
            >
              <h2>Quick Actions</h2>
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    className="quick-action-card"
                    onClick={action.action}
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div
                      className="action-icon"
                      style={{ backgroundColor: action.color }}
                    >
                      {action.icon}
                    </div>
                    <div className="action-content">
                      <h3>{action.title}</h3>
                      <p>{action.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.section>

            {/* Recent Activity */}
            <motion.section
              className="activity-section"
              variants={itemVariants}
            >
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="activity-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <p className="activity-action">{activity.action}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </>
        )}

        {/* Placeholder for other tabs */}
        {activeTab === "skills" && (
          <motion.div variants={itemVariants}>
            <SkillsManager />
          </motion.div>
        )}

        {activeTab === "experience" && (
          <motion.div variants={itemVariants}>
            <ExperienceManager />
          </motion.div>
        )}

        {activeTab === "projects" && (
          <motion.div variants={itemVariants}>
            <ProjectsManager />
          </motion.div>
        )}

        {activeTab === "messages" && (
          <motion.div variants={itemVariants}>
            <MessagesManager />
          </motion.div>
        )}

        {activeTab === "profile" && (
          <motion.div variants={itemVariants}>
            <ProfileManager />
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default AdminDashboard;
