-- Sample data for portfolio website - MySQL Version
-- Insert default admin user (password: admin123 - should be changed in production)
INSERT IGNORE INTO users (email, password, role) VALUES 
('admin@portfolio.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJhNj8V4m', 'admin');

-- Insert personal info
INSERT INTO personal_info (name, title, bio, email, location) VALUES 
('Sakshi Sheth', 'Full Stack Developer', 
'Passionate fresh graduate with expertise in modern web technologies. I love creating beautiful, functional applications that solve real-world problems.',
'sakshi.sheth@example.com', 'India')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample skills
INSERT INTO skills (name, category, proficiency, display_order, is_featured) VALUES 
('React', 'frontend', 90, 1, true),
('TypeScript', 'frontend', 85, 2, true),
('JavaScript', 'frontend', 95, 3, true),
('HTML5', 'frontend', 95, 4, false),
('CSS3', 'frontend', 90, 5, false),
('Tailwind CSS', 'frontend', 80, 6, false),
('Node.js', 'backend', 85, 7, true),
('Express.js', 'backend', 80, 8, true),
('MySQL', 'backend', 75, 9, true),
('MongoDB', 'backend', 70, 10, false),
('Python', 'backend', 75, 11, false),
('Git', 'tools', 85, 12, true),
('VS Code', 'tools', 95, 13, false),
('Docker', 'tools', 60, 14, false),
('AWS', 'tools', 50, 15, false);

-- Insert sample experience
INSERT INTO experience (title, company, location, start_date, is_current, description, responsibilities, technologies, display_order) VALUES 
('Frontend Developer Intern', 'Tech Solutions Inc.', 'Remote', '2024-06-01', false, 
'Worked on developing responsive web applications using modern frontend technologies.',
JSON_ARRAY('Developed responsive user interfaces', 'Collaborated with backend team', 'Implemented interactive features', 'Participated in code reviews'),
JSON_ARRAY('React', 'TypeScript', 'Tailwind CSS', 'Git'), 1),

('Full Stack Developer', 'Freelance', 'Remote', '2024-01-01', true,
'Building custom web applications for small businesses and startups.',
JSON_ARRAY('Design and develop complete web applications', 'Work directly with clients', 'Manage project timelines', 'Provide ongoing maintenance'),
JSON_ARRAY('React', 'Node.js', 'MySQL', 'Express.js', 'TypeScript'), 2);

-- Insert sample projects
INSERT INTO projects (title, description, long_description, technologies, demo_url, github_url, is_featured, display_order, status) VALUES 
('E-Commerce Platform', 'Full-stack e-commerce application with payment integration', 
'A comprehensive e-commerce platform built with React and Node.js. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and admin dashboard. The application is fully responsive and optimized for performance.',
JSON_ARRAY('React', 'Node.js', 'MySQL', 'Express.js', 'Stripe API', 'JWT'),
'https://ecommerce-demo.example.com', 'https://github.com/sakshi/ecommerce-platform', true, 1, 'completed'),

('Task Management App', 'Collaborative task management tool with real-time updates',
'A modern task management application that allows teams to collaborate effectively. Features include drag-and-drop task boards, real-time updates using WebSockets, file attachments, due date reminders, and team member assignments. Built with a focus on user experience and performance.',
JSON_ARRAY('React', 'Node.js', 'Socket.io', 'MongoDB', 'Express.js'),
'https://taskmanager-demo.example.com', 'https://github.com/sakshi/task-manager', true, 2, 'completed'),

('Weather Dashboard', 'Beautiful weather application with location-based forecasts',
'A responsive weather dashboard that provides detailed weather information based on user location or search. Features include current weather, 7-day forecast, weather maps, and severe weather alerts. The app uses modern design principles and smooth animations.',
JSON_ARRAY('React', 'TypeScript', 'Weather API', 'Chart.js', 'CSS3'),
'https://weather-dashboard.example.com', 'https://github.com/sakshi/weather-dashboard', false, 3, 'completed'),

('Portfolio Website', 'This very portfolio website you are viewing',
'A full-stack portfolio website built with modern technologies. Features include admin dashboard for content management, smooth animations, responsive design, contact form, and MySQL database for dynamic content. Showcases my skills in both frontend and backend development.',
JSON_ARRAY('React', 'TypeScript', 'Node.js', 'MySQL', 'Express.js', 'Framer Motion'),
null, 'https://github.com/sakshi/portfolio-website', true, 4, 'in-progress');