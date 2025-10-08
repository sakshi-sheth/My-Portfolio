import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ExperienceManager.css";

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  display_order: number;
}

interface ExperienceFormData {
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  display_order: number;
}

const ExperienceManager: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [formData, setFormData] = useState<ExperienceFormData>({
    title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    responsibilities: [""],
    technologies: [""],
    display_order: 0,
  });

  // Fetch experiences from API
  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/experience");
      if (response.ok) {
        const experienceData = await response.json();
        setExperiences(experienceData);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    // Validate required fields
    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.start_date ||
      !formData.description
    ) {
      alert(
        "Please fill in all required fields: Title, Company, Location, Start Date, and Description"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingExperience
        ? `/api/experience/${editingExperience.id}`
        : "/api/experience";
      const method = editingExperience ? "PUT" : "POST";

      // Ensure proper data formatting
      const filteredResponsibilities = formData.responsibilities.filter(
        (r) => r.trim() !== ""
      );
      const filteredTechnologies = formData.technologies.filter(
        (t) => t.trim() !== ""
      );

      const experienceData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        start_date: formData.start_date, // YYYY-MM-DD format should be fine
        end_date: formData.is_current ? null : formData.end_date || null,
        is_current: Boolean(formData.is_current),
        description: formData.description.trim(),
        responsibilities:
          filteredResponsibilities.length > 0 ? filteredResponsibilities : [],
        technologies:
          filteredTechnologies.length > 0 ? filteredTechnologies : [],
        display_order: parseInt(String(formData.display_order)) || 0,
      };

      console.log("=== SENDING EXPERIENCE DATA ===");
      console.log("URL:", url);
      console.log("Method:", method);
      console.log("Data:", JSON.stringify(experienceData, null, 2));
      console.log("Auth token exists:", !!localStorage.getItem("auth_token"));
      console.log("Data types:", {
        title: typeof experienceData.title,
        company: typeof experienceData.company,
        location: typeof experienceData.location,
        start_date: typeof experienceData.start_date,
        end_date: typeof experienceData.end_date,
        is_current: typeof experienceData.is_current,
        description: typeof experienceData.description,
        responsibilities: Array.isArray(experienceData.responsibilities),
        technologies: Array.isArray(experienceData.technologies),
        display_order: typeof experienceData.display_order,
      });

      // Test basic connectivity first
      try {
        const testResponse = await fetch("/api/skills");
        console.log("Basic API test:", testResponse.status);
      } catch (testError) {
        console.error("Basic API connectivity failed:", testError);
        alert(
          "Cannot connect to backend server. Please check if the backend is running on port 5001."
        );
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(experienceData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const savedExperience = await response.json();
        console.log("Experience saved successfully:", savedExperience);
        await fetchExperiences();
        handleCloseForm();
        alert("Experience saved successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error saving experience:", errorData);

        // Show detailed validation errors if available
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors
            .map(
              (err: any) =>
                `${err.param || err.field || "Field"}: ${
                  err.msg || err.message
                }`
            )
            .join("\n");
          alert(`Validation failed:\n${errorMessages}`);
        } else {
          alert(
            `Error saving experience: ${
              errorData.error || errorData.message || "Unknown error"
            }`
          );
        }
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      alert(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const response = await fetch(`/api/experience/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        await fetchExperiences();
        console.log("Experience deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error deleting experience:", errorData);
        alert(
          `Error deleting experience: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  // Open form for editing
  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title,
      company: experience.company,
      location: experience.location,
      start_date: experience.start_date.split("T")[0], // Format for date input
      end_date: experience.end_date ? experience.end_date.split("T")[0] : "",
      is_current: experience.is_current,
      description: experience.description,
      responsibilities: experience.responsibilities,
      technologies: experience.technologies,
      display_order: experience.display_order,
    });
    setIsFormOpen(true);
  };

  // Close form and reset
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExperience(null);
    setFormData({
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      responsibilities: [""],
      technologies: [""],
      display_order: 0,
    });
  };

  // Handle responsibilities array
  const addResponsibility = () => {
    setFormData({
      ...formData,
      responsibilities: [...formData.responsibilities, ""],
    });
  };

  const updateResponsibility = (index: number, value: string) => {
    const newResponsibilities = [...formData.responsibilities];
    newResponsibilities[index] = value;
    setFormData({ ...formData, responsibilities: newResponsibilities });
  };

  const removeResponsibility = (index: number) => {
    const newResponsibilities = formData.responsibilities.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, responsibilities: newResponsibilities });
  };

  // Handle technologies array
  const addTechnology = () => {
    setFormData({
      ...formData,
      technologies: [...formData.technologies, ""],
    });
  };

  const updateTechnology = (index: number, value: string) => {
    const newTechnologies = [...formData.technologies];
    newTechnologies[index] = value;
    setFormData({ ...formData, technologies: newTechnologies });
  };

  const removeTechnology = (index: number) => {
    const newTechnologies = formData.technologies.filter((_, i) => i !== index);
    setFormData({ ...formData, technologies: newTechnologies });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (isLoading) {
    return (
      <div className="experience-manager loading">
        <div className="loading-spinner">Loading experiences...</div>
      </div>
    );
  }

  return (
    <div className="experience-manager">
      {/* Header */}
      <div className="experience-header">
        <h2>Experience Management</h2>
        <motion.button
          className="add-experience-btn"
          onClick={() => setIsFormOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>+</span> Add New Experience
        </motion.button>
      </div>

      {/* Experience List */}
      <div className="experience-list">
        {experiences.map((experience) => (
          <motion.div
            key={experience.id}
            className="experience-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            layout
          >
            <div className="experience-header-card">
              <div className="experience-info">
                <h3>{experience.title}</h3>
                <h4>{experience.company}</h4>
                <p className="location-date">
                  {experience.location} • {formatDate(experience.start_date)} -{" "}
                  {experience.is_current
                    ? "Present"
                    : formatDate(experience.end_date!)}
                  {experience.is_current && (
                    <span className="current-badge">Current</span>
                  )}
                </p>
              </div>
              <div className="experience-actions">
                <button
                  onClick={() => handleEdit(experience)}
                  className="edit-btn"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(experience.id)}
                  className="delete-btn"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="experience-content">
              <p className="description">{experience.description}</p>

              {experience.responsibilities.length > 0 && (
                <div className="responsibilities">
                  <h5>Key Responsibilities:</h5>
                  <ul>
                    {experience.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.technologies.length > 0 && (
                <div className="technologies">
                  <h5>Technologies:</h5>
                  <div className="tech-tags">
                    {experience.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {experiences.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <h3>No experiences yet</h3>
            <p>Add your first work experience to get started!</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
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
              className="modal-content experience-modal"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </h3>

              <form onSubmit={handleSubmit} className="experience-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Job Title</label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Senior Frontend Developer"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder="e.g., Google, Microsoft"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., San Francisco, CA or Remote"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                      type="date"
                      id="start_date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="end_date">End Date</label>
                    <input
                      type="date"
                      id="end_date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      disabled={formData.is_current}
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_current}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_current: e.target.checked,
                          end_date: e.target.checked ? "" : formData.end_date,
                        })
                      }
                    />
                    <span className="checkmark">✓</span>
                    This is my current job
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of your role and the company..."
                    rows={3}
                    required
                  />
                </div>

                {/* Responsibilities */}
                <div className="form-group array-group">
                  <label>Key Responsibilities</label>
                  {formData.responsibilities.map((resp, index) => (
                    <div key={index} className="array-item">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) =>
                          updateResponsibility(index, e.target.value)
                        }
                        placeholder="e.g., Led a team of 5 developers..."
                      />
                      <button
                        type="button"
                        onClick={() => removeResponsibility(index)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="add-array-btn"
                  >
                    + Add Responsibility
                  </button>
                </div>

                {/* Technologies */}
                <div className="form-group array-group">
                  <label>Technologies Used</label>
                  {formData.technologies.map((tech, index) => (
                    <div key={index} className="array-item">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) =>
                          updateTechnology(index, e.target.value)
                        }
                        placeholder="e.g., React, Node.js, PostgreSQL"
                      />
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="add-array-btn"
                  >
                    + Add Technology
                  </button>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="cancel-btn"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : `${editingExperience ? "Update" : "Add"} Experience`}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceManager;
