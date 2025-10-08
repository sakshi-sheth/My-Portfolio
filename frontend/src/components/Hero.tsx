import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Hero: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <motion.div
          ref={ref}
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* <motion.div className="hero-image" variants={itemVariants}>
            <img
              src="/api/placeholder/300/300"
              alt="Sakshi Sheth"
              className="profile-image"
            />
          </motion.div> */}

          <motion.h1 className="hero-title" variants={itemVariants}>
            Hi, I am <span className="highlight">Sakshi Sheth</span>
          </motion.h1>

          <motion.h2 className="hero-subtitle" variants={itemVariants}>
            Jr. Developer / Data Scientist
          </motion.h2>

          <motion.p className="hero-description" variants={itemVariants}>
            I am a Junior Developer and Data Scientist with a strong foundation
            in Python, SQL, and data visualization. I enjoy creating efficient
            software solutions and leveraging data to drive insights and
            decisions. With hands-on experience in web development, database
            management, and analytical tools like Power BI and Tableau, I aim to
            grow as a versatile professional who bridges the gap between
            development and data science.
          </motion.p>

          <motion.div className="hero-buttons" variants={itemVariants}>
            <motion.a
              href="#contact"
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
            <motion.a
              href="#projects"
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.a>
          </motion.div>

          <motion.div className="hero-social" variants={itemVariants}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <span>GitHub</span>
            </a>
            <span className="social-separator"> | </span>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <span>LinkedIn</span>
            </a>
            <span className="social-separator"> | </span>
            <a
              href="/assets/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              download="Sakshi_Sheth_Resume.pdf"
            >
              <span>Resume</span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span style={{ marginLeft: "2rem" }}>Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
