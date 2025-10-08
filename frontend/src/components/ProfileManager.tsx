import React, { useState, useEffect } from "react";
import "./ProfileManager.css";

interface PersonalInfo {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  linkedin_url?: string;
  github_url?: string;
  resume_url?: string;
  profile_image_url?: string;
  updated_at: string;
}

interface ProfileFormData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  resume_url: string;
  profile_image_url: string;
}

const ProfileManager: React.FC = () => {
  const [profile, setProfile] = useState<PersonalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    linkedin_url: "",
    github_url: "",
    resume_url: "",
    profile_image_url: "",
  });

  // Fetch profile from API
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching profile data...");
      console.log("Auth token:", localStorage.getItem("auth_token"));

      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      console.log("Profile response status:", response.status);
      console.log("Profile response ok:", response.ok);

      if (response.ok) {
        const profileData = await response.json();
        console.log("Profile data received:", profileData);
        setProfile(profileData);
        // Populate form data
        setFormData({
          name: profileData.name || "",
          title: profileData.title || "",
          bio: profileData.bio || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          linkedin_url: profileData.linkedin_url || "",
          github_url: profileData.github_url || "",
          resume_url: profileData.resume_url || "",
          profile_image_url: profileData.profile_image_url || "",
        });
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(
          `Error loading profile: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(
        error instanceof Error ? error.message : "Network error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.name || !formData.title || !formData.email) {
      setError("Please fill in all required fields: Name, Title, and Email");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting profile data:", formData);

      const url = "/api/profile";
      const method = "PUT"; // Backend only supports PUT for create/update

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(formData),
      });
      console.log("Profile response status:", response.status);

      if (response.ok) {
        const savedProfile = await response.json();
        console.log("Profile saved successfully:", savedProfile);
        setProfile(savedProfile);
        setIsEditing(false);
        setError(null);
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error saving profile:", errorData);

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
          setError(`Validation failed:\n${errorMessages}`);
        } else {
          setError(
            errorData.error || errorData.message || "Failed to save profile"
          );
        }
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      setError(
        error instanceof Error ? error.message : "Network error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        resume_url: profile.resume_url || "",
        profile_image_url: profile.profile_image_url || "",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="profile-manager loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-manager">
      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-header">
          <h2>Personal Information</h2>
          {!isEditing && (
            <button className="edit-profile-btn" onClick={handleEdit}>
              <span className="btn-icon">✏️</span>
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          // Profile View Mode
          <div className="profile-view">
            {profile ? (
              <div className="profile-content">
                <div className="profile-card">
                  <div className="profile-avatar">
                    {profile.profile_image_url ? (
                      <img
                        src={profile.profile_image_url}
                        alt={profile.name}
                        className="avatar-img"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {profile.name
                          ? profile.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    )}
                  </div>

                  <div className="profile-info">
                    <h1>{profile.name}</h1>
                    <h2>{profile.title}</h2>
                    <p className="bio">{profile.bio}</p>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-section">
                    <h3>Contact Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">📧 Email:</span>
                        <span className="detail-value">{profile.email}</span>
                      </div>
                      {profile.phone && (
                        <div className="detail-item">
                          <span className="detail-label">📱 Phone:</span>
                          <span className="detail-value">{profile.phone}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="detail-label">📍 Location:</span>
                        <span className="detail-value">{profile.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Social Links</h3>
                    <div className="detail-grid">
                      {profile.linkedin_url && (
                        <div className="detail-item">
                          <span className="detail-label">💼 LinkedIn:</span>
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="detail-link"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                      {profile.github_url && (
                        <div className="detail-item">
                          <span className="detail-label">💻 GitHub:</span>
                          <a
                            href={profile.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="detail-link"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                      {profile.resume_url && (
                        <div className="detail-item">
                          <span className="detail-label">📄 Resume:</span>
                          <a
                            href={profile.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="detail-link"
                          >
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <h3>No Profile Found</h3>
                <p>Create your profile to get started.</p>
                <button className="create-profile-btn" onClick={handleEdit}>
                  Create Profile
                </button>
              </div>
            )}
          </div>
        ) : (
          // Profile Edit Mode
          <div className="profile-edit">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="title">
                      Professional Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Full Stack Developer"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Professional Bio</label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    placeholder="Tell visitors about yourself, your experience, and what you're passionate about..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile_image_url">Profile Image URL</label>
                  <input
                    type="url"
                    id="profile_image_url"
                    value={formData.profile_image_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile_image_url: e.target.value,
                      })
                    }
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
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
                    placeholder="City, State/Country"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Social Links</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="linkedin_url">LinkedIn Profile</label>
                    <input
                      type="url"
                      id="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          linkedin_url: e.target.value,
                        })
                      }
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="github_url">GitHub Profile</label>
                    <input
                      type="url"
                      id="github_url"
                      value={formData.github_url}
                      onChange={(e) =>
                        setFormData({ ...formData, github_url: e.target.value })
                      }
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="resume_url">Resume/CV URL</label>
                  <input
                    type="url"
                    id="resume_url"
                    value={formData.resume_url}
                    onChange={(e) =>
                      setFormData({ ...formData, resume_url: e.target.value })
                    }
                    placeholder="https://example.com/your-resume.pdf"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileManager;
