import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Skill } from "../types";
import "./Skills.css";

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Helper function to get skill icon based on skill name
  const getSkillIcon = (skillName: string) => {
    const iconMap: Record<string, string> = {
      React: "⚛️",
      JavaScript: "🟨",
      TypeScript: "🔷",
      "Node.js": "🟢",
      Python: "🐍",
      HTML: "🌐",
      CSS: "🎨",
      MongoDB: "🍃",
      MySQL: "🐬",
      Git: "📂",
      Docker: "🐳",
      AWS: "☁️",
      Angular: "🅰️",
      Vue: "💚",
      PHP: "🐘",
      Java: "☕",
      "C++": "⚡",
      Redux: "🔄",
      Express: "🚂",
      Firebase: "🔥",
      PostgreSQL: "🐘",
      GraphQL: "◉",
      "REST API": "🔗",
      Tailwind: "💨",
      Bootstrap: "🅱️",
      Sass: "💅",
      Webpack: "📦",
      Vite: "⚡",
      Jest: "🃏",
      Cypress: "🌲",
      Linux: "🐧",
      Figma: "🎨",
      Photoshop: "🖼️",
    };
    return iconMap[skillName] || "🔧";
  };

  // Helper function to get skill level text
  const getSkillLevel = (proficiency: number) => {
    if (proficiency >= 90) return "Expert";
    if (proficiency >= 75) return "Advanced";
    if (proficiency >= 60) return "Intermediate";
    if (proficiency >= 40) return "Beginner";
    return "Learning";
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Define category display names and order
  const categoryOrder = [
    { key: "frontend", name: "Frontend Development" },
    { key: "backend", name: "Backend Development" },
    { key: "tools", name: "Tools & Technologies" },
    { key: "other", name: "Additional Skills" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut",
      },
    }),
  };

  const skillVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const progressVariants = {
    hidden: { width: "0%" },
    visible: (proficiency: number) => ({
      width: `${proficiency}%`,
      transition: {
        duration: 2,
        ease: "easeOut",
        delay: 0.3,
      },
    }),
  };

  return (
    <section id="skills" className="skills-section">
      <motion.div
        ref={ref}
        className="skills-content"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Section Header */}
        <motion.div className="skills-header" variants={headerVariants}>
          <h2 className="skills-title">SKILLS</h2>
          <p className="skills-subtitle">Professional Expertise</p>
        </motion.div>

        {/* Category Cards Grid */}
        <div className="skills-categories-grid">
          {categoryOrder.map((category, categoryIndex) => {
            const categorySkills = groupedSkills[category.key] || [];

            if (categorySkills.length === 0) return null;

            return (
              <motion.div
                key={category.key}
                className="category-card"
                variants={categoryVariants}
                custom={categoryIndex}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="category-header">
                  <h3 className="category-title">{category.name}</h3>
                </div>

                <div className="category-skills">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.id}
                      className="skill-card"
                      variants={skillVariants}
                      custom={skillIndex}
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="skill-card-header">
                        <div className="skill-icon">
                          {getSkillIcon(skill.name)}
                        </div>
                        <div className="skill-details">
                          <h4 className="skill-name">{skill.name}</h4>
                          <div className="skill-level">
                            {getSkillLevel(skill.proficiency)}
                          </div>
                        </div>
                      </div>

                      <div className="skill-progress-section">
                        <div className="skill-stats">
                          <span className="proficiency-label">Proficiency</span>
                          <motion.span
                            className="skill-percentage"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={
                              inView
                                ? { opacity: 1, scale: 1 }
                                : { opacity: 0, scale: 0.5 }
                            }
                            transition={{
                              delay: 1.5 + skillIndex * 0.1,
                              duration: 0.5,
                              type: "spring",
                            }}
                          >
                            {skill.proficiency}%
                          </motion.span>
                        </div>

                        <div className="skill-progress-container">
                          <div className="progress-track">
                            <motion.div
                              className="progress-fill"
                              variants={progressVariants}
                              custom={skill.proficiency}
                              initial="hidden"
                              animate={inView ? "visible" : "hidden"}
                            />
                          </div>
                          <div className="progress-dots">
                            {Array.from({ length: 5 }, (_, i) => (
                              <motion.div
                                key={i}
                                className={`progress-dot ${
                                  i < Math.ceil(skill.proficiency / 20)
                                    ? "active"
                                    : ""
                                }`}
                                initial={{ scale: 0 }}
                                animate={inView ? { scale: 1 } : { scale: 0 }}
                                transition={{
                                  delay: 2 + skillIndex * 0.1 + i * 0.1,
                                  type: "spring",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fallback for no skills */}
        {skills.length === 0 && (
          <motion.div className="no-skills" variants={headerVariants}>
            <p>No skills found. Add some skills through the admin panel.</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Skills;
