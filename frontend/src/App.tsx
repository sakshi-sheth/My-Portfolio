import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation.tsx";
import Hero from "./components/Hero.tsx";
import Skills from "./components/Skills.tsx";
import Experience from "./components/Experience.tsx";
import Projects from "./components/Projects.tsx";
import Contact from "./components/Contact.tsx";
import Login from "./components/Login.tsx";
import AdminDashboard from "./components/AdminDashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AdminFloatingButton from "./components/AdminFloatingButton.tsx";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navigation />
                  <main>
                    <Hero />
                    <Experience />
                    <Skills />
                    <Projects />
                    <Contact />
                  </main>
                  <AdminFloatingButton />
                </>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
