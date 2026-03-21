import React from 'react';
import { FaHome } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  // Yahan legends ki list hai jo scroll hogi
  const legends = [
    { name: "James Gosling", skill: "Java", role: "Founder", img: "https://upload.wikimedia.org/wikipedia/commons/1/14/James_Gosling_2008.jpg" },
    { name: "Linus Torvalds", skill: "Linux", role: "Creator", img: "https://upload.wikimedia.org/wikipedia/commons/0/01/LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg" },
    { name: "Dennis Ritchie", skill: "C", role: "Creator", img: "https://upload.wikimedia.org/wikipedia/commons/2/23/Dennis_Ritchie_2011.jpg" },
    { name: "Bjarne Stroustrup", skill: "C++", role: "Father", img: "https://upload.wikimedia.org/wikipedia/commons/d/da/BjarneStroustrup.jpg" },
    { name: "Tim Berners-Lee", skill: "WWW", role: "Inventor", img: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sir_Tim_Berners-Lee_%28cropped%29.jpg" },
  ];

  return (
    <div className="eduvibe-container">
      {/* --- TOP NAVBAR --- */}
    

      {/* --- MAIN CONTENT AREA --- */}
      <div className="main-layout">
        
        {/* LEFT SCROLLER */}
        <aside className="left-scroller">
          <div className="scroll-track">
            {[...legends, ...legends].map((person, index) => (
              <div className="dev-card" key={index}>
                <div className="avatar-ring">
                  <img src={person.img} alt={person.name} />
                </div>
                <div className="dev-info">
                  <h4 className="dev-name">
                    {person.name}<span className="skill-text">{person.skill}</span>
                  </h4>
                  <p className="role-text">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT HERO SECTION WITH IMAGE OVERLAY */}
        <section className="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>Your Ultimate <br /> Hub for 
             <br /> <span>Computer Science</span></h1>
              <p>
                Get all your <strong>Computer Science</strong> Notes, Solved Programs, 
                and Online Quizzes in one place <strong>EduVibe</strong>.
              </p>
            
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;