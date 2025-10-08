import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SkillsManager.css";

interface Skill {
  id: number;
  name: string;
  proficiency: number;
  category: string;
}

interface SkillFormData {
  name: string;
  proficiency: number;
  category: string;
}

const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    proficiency: 50,
    category: "frontend",
  });

  const categories = [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "tools", label: "Tools" },
    { value: "other", label: "Other" },
  ];

  // Fetch skills from API
  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/skills");
      if (response.ok) {
        const skillsData = await response.json();
        setSkills(skillsData);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSkill
        ? `/api/skills/${editingSkill.id}`
        : "/api/skills";
      const method = editingSkill ? "PUT" : "POST";

      // Prepare the data with required fields
      const skillData = {
        name: formData.name,
        category: formData.category,
        proficiency: formData.proficiency,
        icon: null, // Set default icon to null
        display_order: 0, // Set default display order
        is_featured: false, // Set default featured status
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(skillData),
      });

      if (response.ok) {
        await fetchSkills(); // Refresh the list
        handleCloseForm();
        console.log("Skill saved successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error saving skill:", errorData);
        alert(`Error saving skill: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        await fetchSkills(); // Refresh the list
        console.log("Skill deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error deleting skill:", errorData);
        alert(`Error deleting skill: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  // Open form for editing
  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      proficiency: skill.proficiency,
      category: skill.category,
    });
    setIsFormOpen(true);
  };

  // Close form and reset
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSkill(null);
    setFormData({
      name: "",
      proficiency: 50,
      category: "frontend",
    });
  };

  if (isLoading) {
    return (
      <div className="skills-manager loading">
        <div className="loading-spinner">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="skills-manager">
      {/* Header */}
      <div className="skills-header">
        <h2>Skills Management</h2>
        <motion.button
          className="add-skill-btn"
          onClick={() => setIsFormOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>+</span> Add New Skill
        </motion.button>
      </div>

      {/* Skills Grid */}
      <div className="skills-grid">
        {categories.map((category) => {
          const categorySkills = skills.filter(
            (skill) => skill.category === category.value
          );

          return (
            <motion.div
              key={category.value}
              className="skills-category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>{category.label}</h3>
              <div className="skills-list">
                {categorySkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    className="skill-item"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="skill-info">
                      <h4>{skill.name}</h4>
                      <div className="skill-proficiency">
                        <div className="proficiency-bar">
                          <div
                            className="proficiency-fill"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span>{skill.proficiency}%</span>
                      </div>
                    </div>
                    <div className="skill-actions">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="edit-btn"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="delete-btn"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.div>
                ))}
                {categorySkills.length === 0 && (
                  <div className="empty-category">
                    No skills in this category
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
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
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{editingSkill ? "Edit Skill" : "Add New Skill"}</h3>

              <form onSubmit={handleSubmit} className="skill-form">
                <div className="form-group">
                  <label htmlFor="name">Skill Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., React, Node.js, Figma"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="proficiency">
                    Proficiency: {formData.proficiency}%
                  </label>
                  <input
                    type="range"
                    id="proficiency"
                    min="0"
                    max="100"
                    value={formData.proficiency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        proficiency: parseInt(e.target.value),
                      })
                    }
                  />
                  <div className="proficiency-preview">
                    <div
                      className="proficiency-bar"
                      style={{
                        background: `linear-gradient(to right, #4f46e5 ${formData.proficiency}%, #e5e7eb ${formData.proficiency}%)`,
                      }}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingSkill ? "Update" : "Add"} Skill
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

export default SkillsManager;
