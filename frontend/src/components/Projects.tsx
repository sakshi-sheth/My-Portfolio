import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Projects.css";

interface Project {
  id: number;
  title: string;
  description: string;
  long_description: string;
  technologies: string[];
  image_url: string;
  demo_url?: string;
  github_url?: string;
  is_featured: boolean;
  display_order: number;
  status: "completed" | "in-progress" | "planned";
}

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.warn("Failed to fetch projects");
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { key: "all", label: "All Projects" },
    { key: "featured", label: "Featured" },
    { key: "completed", label: "Completed" },
    { key: "in-progress", label: "In Progress" },
  ];

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "featured") return project.is_featured;
    return project.status === filter;
  });

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "in-progress":
        return "🚧";
      case "planned":
        return "📋";
      default:
        return "📁";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in-progress":
        return "#f59e0b";
      case "planned":
        return "#6366f1";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <section id="projects" className="projects-section">
        <div className="container">
          <h2 className="section-title">Projects</h2>
          <p>Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">
            A showcase of my recent work and side projects
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="project-filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {filters.map((filterOption) => (
            <motion.button
              key={filterOption.key}
              className={`filter-btn ${
                filter === filterOption.key ? "active" : ""
              }`}
              onClick={() => setFilter(filterOption.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filterOption.label}
              {filter === filterOption.key && (
                <motion.div
                  className="filter-indicator"
                  layoutId="filterIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          key={filter} // Re-animate when filter changes
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="project-card"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => setSelectedProject(project)}
                layout
              >
                <div className="project-image">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    loading="lazy"
                  />
                  <div className="project-overlay">
                    <div className="project-status">
                      <span
                        className="status-indicator"
                        style={{
                          backgroundColor: getStatusColor(project.status),
                        }}
                      >
                        {getStatusIcon(project.status)}{" "}
                        {project.status.replace("-", " ")}
                      </span>
                    </div>
                    <div className="project-actions">
                      {project.demo_url && project.demo_url !== "#" && (
                        <motion.a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn demo-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          🌐 Demo
                        </motion.a>
                      )}
                      {project.github_url && (
                        <motion.a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn github-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          📁 Code
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  <div className="project-technologies">
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="tech-more">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="project-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                className="project-modal"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setSelectedProject(null)}
                >
                  ✕
                </button>

                <div className="modal-content">
                  <div className="modal-image">
                    <img
                      src={selectedProject.image_url}
                      alt={selectedProject.title}
                    />
                  </div>

                  <div className="modal-details">
                    <div className="modal-header">
                      <h3>{selectedProject.title}</h3>
                      <span
                        className="modal-status"
                        style={{
                          backgroundColor: getStatusColor(
                            selectedProject.status
                          ),
                        }}
                      >
                        {getStatusIcon(selectedProject.status)}{" "}
                        {selectedProject.status.replace("-", " ")}
                      </span>
                    </div>

                    <p className="modal-description">
                      {selectedProject.long_description}
                    </p>

                    <div className="modal-technologies">
                      <h4>Technologies Used:</h4>
                      <div className="tech-list">
                        {selectedProject.technologies.map((tech, index) => (
                          <span key={index} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="modal-actions">
                      {selectedProject.demo_url &&
                        selectedProject.demo_url !== "#" && (
                          <a
                            href={selectedProject.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="modal-btn demo-btn"
                          >
                            🌐 View Demo
                          </a>
                        )}
                      {selectedProject.github_url && (
                        <a
                          href={selectedProject.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="modal-btn github-btn"
                        >
                          📁 View Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
