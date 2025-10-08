import React, { useState, useEffect } from "react";
import "./Experience.css";

interface ExperienceItem {
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

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/experience");
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error("Error fetching experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="experience" className="experience-section">
        <div className="experience-content">
          <div className="experience-header">
            <h2 className="experience-title">Experience</h2>
            <p className="experience-subtitle">My Professional Journey</p>
          </div>
          <p>Loading experiences...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="experience-section">
      <div className="experience-content">
        <div className="experience-header">
          <h2 className="experience-title">Experience</h2>
          <p className="experience-subtitle">My Professional Journey</p>
        </div>
        {experiences.length === 0 ? (
          <p className="no-experiences">
            No experience data available. Please add experiences through the
            admin dashboard.
          </p>
        ) : (
          <div className="experience-grid">
            {experiences.map((experience) => (
              <div key={experience.id} className="experience-card">
                <div className="experience-card-header">
                  <h3 className="experience-position-title">
                    {experience.title}
                  </h3>
                  <div className="experience-company-name">
                    {experience.company}
                  </div>
                  <div className="experience-period">
                    {experience.start_date} - {experience.end_date || "Present"}
                    {experience.is_current && " (Current)"}
                  </div>
                  <div className="experience-location">
                    {experience.location}
                  </div>
                </div>

                <p className="experience-description">
                  {experience.description}
                </p>

                <div className="experience-details-grid">
                  {experience.responsibilities &&
                    experience.responsibilities.length > 0 && (
                      <div className="experience-detail-card">
                        <h4 className="detail-card-title">
                          Key Responsibilities
                        </h4>
                        <ul className="responsibilities-list">
                          {experience.responsibilities.map(
                            (responsibility: string, idx: number) => (
                              <li key={idx}>{responsibility}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {experience.technologies &&
                    experience.technologies.length > 0 && (
                      <div className="experience-detail-card">
                        <h4 className="detail-card-title">Technologies Used</h4>
                        <div className="tech-tags">
                          {experience.technologies.map(
                            (tech: string, idx: number) => (
                              <span key={idx} className="tech-tag">
                                {tech}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
