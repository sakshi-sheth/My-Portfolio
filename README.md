# Portfolio Website

A modern, full-stack portfolio website built with React, TypeScript, Express.js, and PostgreSQL. Features beautiful animations, responsive design, and an admin dashboard for content management.

## ✨ Features

### 🎨 Visual Design & Theme

- **Vibrant Gradient Theme**: Beautiful blue-to-teal gradient background with energetic, professional colors
- **Modern Typography**: Clean, readable fonts with proper hierarchy
- **Responsive Design**: Perfectly adapts to desktop, tablet, and mobile screens
- **Professional Color Scheme**: Carefully selected theme colors for buttons, cards, and accents

### ✨ Animations & Motion Effects

- **Smooth Fade-In Animations**: All sections animate into view as you scroll
- **Staggered Entry Animations**: List items appear one after another for visual flow
- **Hover Effects**: Interactive buttons and cards respond to mouse hover with smooth transitions
- **Progress Bar Animations**: Skills animate from 0% to their actual percentages
- **Page Transition Animations**: Smooth movement between different pages
- **Floating Elements**: Subtle floating animations for visual interest
- **Card Hover Transforms**: Project cards lift and scale on hover
- **Button Ripple Effects**: Interactive feedback on all clickable elements

### 🧭 Navigation & Layout

- **Floating Navigation Bar**: Fixed navigation that stays visible while scrolling
- **Smooth Scrolling**: Seamless movement between portfolio sections
- **Active Section Highlighting**: Navigation shows which section you're currently viewing
- **Mobile-Friendly Menu**: Responsive navigation that works on all devices

### 📝 Content Sections

- **Hero Section**: Animated introduction with name, title, and call-to-action buttons
- **Skills Section**: Categorized skills with animated progress bars and skill badges
- **Experience Section**: Work history with technology tags and expandable descriptions
- **Projects Section**: Featured project highlighting with interactive cards
- **Contact Section**: Animated contact form with validation

### 🔐 Admin Management System

- **Secure Authentication**: Login system with JWT tokens
- **Admin Dashboard**: Complete content management interface
- **Real-Time Updates**: Changes appear immediately on the live site
- **Content Management**: Add/edit skills, experience, projects, and personal info

### ⚡ Technical Features

- **Full-Stack Architecture**: React frontend with Express.js backend
- **Database Integration**: MySQL database for persistent content storage
- **Type Safety**: Complete TypeScript implementation
- **Form Management**: Advanced form handling with validation
- **State Management**: Efficient data caching and updates
- **SEO Optimization**: Proper meta tags and page structure
- **Performance Optimized**: Fast loading with optimized assets

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Set up the database**

   Create a MySQL database:

   ```sql
   CREATE DATABASE portfolio_db;
   ```

4. **Configure environment variables**

   Copy the example environment file:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Update the `.env` file with your database credentials:

   ```env
   DATABASE_URL=mysql://username:password@localhost:3306/portfolio_db
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=portfolio_db
   DB_USER=your_username
   DB_PASSWORD=your_password

   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ADMIN_EMAIL=admin@portfolio.com
   ADMIN_PASSWORD=admin123
   ```

5. **Run database migrations**

   ```bash
   cd backend
   npm run migrate
   ```

6. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start:

   - Frontend server: http://localhost:3000
   - Backend server: http://localhost:5000

## 🏗️ Project Structure

```
portfolio/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   ├── styles/         # CSS and styling files
│   │   └── App.tsx         # Main App component
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express.js backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   ├── migrations/     # Database migration scripts
│   │   └── index.ts        # Main server file
│   ├── package.json
│   └── tsconfig.json
├── package.json              # Root package.json for scripts
└── README.md
```

## 🛠️ Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm run start` - Start the backend in production mode
- `npm run install:all` - Install dependencies for all packages

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations

## 🎨 Customization

### Colors and Theme

Edit the CSS variables in `frontend/src/styles/App.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  /* ... more variables */
}
```

### Personal Information

1. Log in to the admin dashboard at `/admin`
2. Update your personal information, skills, experience, and projects
3. Changes will appear immediately on the live site

### Content Management

The admin dashboard allows you to:

- Add/edit/delete skills with proficiency levels
- Manage work experience and responsibilities
- Upload and manage project information
- Update personal information and contact details

## 🔧 API Endpoints

### Public Endpoints

- `GET /api/skills` - Get all skills
- `GET /api/skills/featured` - Get featured skills
- `GET /api/experience` - Get work experience
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Authentication Required)

- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- Similar CRUD endpoints for experience and projects

## 🚀 Deployment

### Frontend (Netlify/Vercel)

1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to your hosting service
3. Set environment variables for the API URL

### Backend (Heroku/Railway)

1. Set up your PostgreSQL database
2. Configure environment variables
3. Deploy the backend code
4. Run migrations: `npm run migrate`

### Database

1. Set up a PostgreSQL database (ElephantSQL, Supabase, etc.)
2. Update connection strings in environment variables
3. Run migrations to set up the schema

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support

If you have any questions or need help setting up the project, please feel free to:

- Open an issue on GitHub
- Contact me at [your-email@example.com]

---

Built with ❤️ using React, TypeScript, Express.js, and PostgreSQL
