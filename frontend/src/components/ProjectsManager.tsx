import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ProjectsManager.css";

interface Project {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  is_featured: boolean;
  display_order: number;
  status: "completed" | "in-progress" | "planned";
  created_at: string;
  updated_at: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  long_description: string;
  technologies: string[];
  image_url: string;
  demo_url: string;
  github_url: string;
  is_featured: boolean;
  display_order: number;
  status: "completed" | "in-progress" | "planned";
}

const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    long_description: "",
    technologies: [""],
    image_url: "",
    demo_url: "",
    github_url: "",
    is_featured: false,
    display_order: 0,
    status: "completed",
  });

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/projects");
      if (response.ok) {
        const projectData = await response.json();
        setProjects(projectData);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields: Title and Description");
      return;
    }

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const projectData = {
        ...formData,
        technologies: formData.technologies.filter((t) => t.trim() !== ""),
      };

      console.log("Submitting project data:", projectData);
      console.log("URL:", url, "Method:", method);

      const authToken = localStorage.getItem("auth_token");
      console.log("Auth token present:", !!authToken);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(projectData),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const savedProject = await response.json();
        console.log("Project saved successfully:", savedProject);
        await fetchProjects();
        handleCloseForm();
        alert("Project saved successfully!");
        // Don't redirect to dashboard, stay on projects manager
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }

        console.error("Error saving project:", errorData);
        alert(
          `Error saving project: ${
            errorData.error || errorData.message || errorText || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      alert(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        await fetchProjects();
        alert("Project deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error deleting project: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
    }
  };

  // Handle edit
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      long_description: project.long_description || "",
      technologies: project.technologies,
      image_url: project.image_url || "",
      demo_url: project.demo_url || "",
      github_url: project.github_url || "",
      is_featured: project.is_featured,
      display_order: project.display_order,
      status: project.status,
    });
    setIsFormOpen(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      long_description: "",
      technologies: [""],
      image_url: "",
      demo_url: "",
      github_url: "",
      is_featured: false,
      display_order: 0,
      status: "completed",
    });
  };

  // Handle technology input
  const handleTechnologyChange = (index: number, value: string) => {
    const newTechnologies = [...formData.technologies];
    newTechnologies[index] = value;
    setFormData({ ...formData, technologies: newTechnologies });
  };

  const addTechnology = () => {
    setFormData({
      ...formData,
      technologies: [...formData.technologies, ""],
    });
  };

  const removeTechnology = (index: number) => {
    const newTechnologies = formData.technologies.filter((_, i) => i !== index);
    setFormData({ ...formData, technologies: newTechnologies });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="projects-manager">
        <div className="loading-spinner">Loading projects...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="projects-manager"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="projects-header" variants={itemVariants}>
        <h2>Projects Management</h2>
        <button className="add-btn" onClick={() => setIsFormOpen(true)}>
          <span className="btn-icon">+</span>
          Add New Project
        </button>
      </motion.div>

      <motion.div className="projects-stats" variants={itemVariants}>
        <div className="stat-card">
          <div className="stat-number">{projects.length}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {projects.filter((p) => p.is_featured).length}
          </div>
          <div className="stat-label">Featured</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {projects.filter((p) => p.status === "completed").length}
          </div>
          <div className="stat-label">Completed</div>
        </div>
      </motion.div>

      <motion.div className="projects-list" variants={itemVariants}>
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No Projects Yet</h3>
            <p>Start by adding your first project to showcase your work.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="project-card"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="project-header">
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                  </div>
                  <div className={`project-status status-${project.status}`}>
                    {project.status}
                  </div>
                </div>

                <div className="project-meta">
                  <div className="project-technologies">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="tech-more">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="project-badges">
                    {project.is_featured && (
                      <span className="featured-badge">★ Featured</span>
                    )}
                  </div>
                </div>

                <div className="project-links">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link demo-link"
                    >
                      🌐 Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link github-link"
                    >
                      💻 GitHub
                    </a>
                  )}
                </div>

                <div className="project-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseForm}
          >
            <motion.div
              className="project-form-modal"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="form-header">
                <h3>{editingProject ? "Edit Project" : "Add New Project"}</h3>
                <button className="close-btn" onClick={handleCloseForm}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="project-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">
                      Project Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as
                            | "completed"
                            | "in-progress"
                            | "planned",
                        })
                      }
                    >
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    Short Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="long_description">Detailed Description</label>
                  <textarea
                    id="long_description"
                    value={formData.long_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        long_description: e.target.value,
                      })
                    }
                    rows={5}
                  />
                </div>

                <div className="form-group">
                  <label>Technologies Used</label>
                  <div className="technologies-input">
                    {formData.technologies.map((tech, index) => (
                      <div key={index} className="tech-input-row">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) =>
                            handleTechnologyChange(index, e.target.value)
                          }
                          placeholder="e.g., React, Node.js, MongoDB"
                        />
                        <button
                          type="button"
                          className="remove-tech-btn"
                          onClick={() => removeTechnology(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-tech-btn"
                      onClick={addTechnology}
                    >
                      + Add Technology
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="demo_url">Demo URL</label>
                    <input
                      type="url"
                      id="demo_url"
                      value={formData.demo_url}
                      onChange={(e) =>
                        setFormData({ ...formData, demo_url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="github_url">GitHub URL</label>
                    <input
                      type="url"
                      id="github_url"
                      value={formData.github_url}
                      onChange={(e) =>
                        setFormData({ ...formData, github_url: e.target.value })
                      }
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="image_url">Project Image URL</label>
                    <input
                      type="url"
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="display_order">Display Order</label>
                    <input
                      type="number"
                      id="display_order"
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          display_order: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_featured: e.target.checked,
                        })
                      }
                    />
                    <span className="checkmark"></span>
                    Feature this project (show prominently on homepage)
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCloseForm}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingProject ? "Update Project" : "Save Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectsManager;
