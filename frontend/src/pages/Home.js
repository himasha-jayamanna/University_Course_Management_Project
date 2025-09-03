import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const cards = [
    { title: "Student Management", route: "/students" },
    { title: "Course Management", route: "/courses" },
    { title: "Course Enrollment", route: "/registrations" },
    { title: "Results Management", route: "/results" },
  ];

  return (
    <div className="home-container">
      <h1 className="home-header">University Management Dashboard</h1>
      <div className="cards-container">
        {cards.map((card, index) => (
          <div
            key={index}
            className="glass-card"
            onClick={() => navigate(card.route)}
          >
            <h3>{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
