import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope
} from 'react-icons/fa';
import './About.css';

let About = () => {
  let [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  let openMap = () => {
    let address = 'Swami Vivekanand Govt. College Ghumarwin';
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      '_blank'
    );
  };

  return (
    <div className="about-page">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="about-header"
        style={{
          // Header background fix: link ko correct format mein dala hai
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQV5RUn-RnbvIPP6XiDRwnEKiAsk4y5THpFw&s')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Us
        </motion.h1>
      </motion.div>

      <div className="about-container" ref={ref}>
        {/* ===== INTRO SECTION ===== */}
        <div className="about-grid">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="about-image-side"
          >
           <div className="code-office-image">
  {/* Niche wali line add karein */}
  <img src="/image/images.jpg" alt="EduVibe Banner" style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', zIndex: '0'}} />
  
  
</div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="about-text-side"
          >
            <h2>Your Complete Study Hub for Computer Science</h2>
            <p>
              EduVibe is a dedicated learning platform for Computer Science students.
              Here you get section-wise notes, easy explanations, Programs,
              and Quiz prepared according to Computer syllabus.
            </p>

            <div className="about-features">
              <div className="feature-box">
                
                <h3>Computer Science Students</h3>
                <p>Section-wise Pdf notes for Computer Science Students.</p>
              </div>
              
              <div className="feature-box">
                <p>Simple and working practical programs with easy explanations.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== MEET OUR TEAM SECTION ===== */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="founders-section team-section"
        >
          <h2>Meet Our Team</h2>

          <div className="team-grid">
            {/* CARD 1: Prof. Amar Paul Singh */}
            <div className="team-card founder-card">
              <div className="founder-image team-image">
                <div className="founder-badge team-badge">Prof. Guide</div>
                <img src="/image/amarpaul.jpg" alt="Prof. Amar Paul Singh" />
              </div>
              <div className="founder-info team-info">
                <h3>Prof. Amar Paul Singh</h3>
                <p className="founder-tagline">Project Guide</p>
              </div>
            </div>

            {/* CARD 2: Sanjna Devi */}
            <div className="team-card founder-card">
              <div className="founder-image team-image">
                <div className="founder-badge team-badge student-badge">Team Member</div>
                <img src="/image/Sanjna.jpg" alt="Sanjna Devi" />
              </div>
              <div className="founder-info team-info">
                <h3>Sanjna Devi</h3>
                <p className="founder-tagline">Team Member</p>
              </div>
            </div>

            {/* CARD 3: Shailja Thakur */}
            <div className="team-card founder-card">
              <div className="founder-image team-image">
                <div className="founder-badge team-badge student-badge">Team Member</div>
                <img src="/image/shailja.jpeg" alt="Shailja Thakur" />
              </div>
              <div className="founder-info team-info">
                <h3>Shailja Thakur</h3>
                <p className="founder-tagline">Team Member</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="about-footer">
        <div className="footer-container">
          <div className="footer-col">
            {/* Logo path fixed */}

          </div>

          <div className="footer-col contact-col">
            <h4>Get In Touch</h4>
            <div className="contact-item clickable" onClick={openMap}>
              <FaMapMarkerAlt className="icon-red" />
              <p>Swami Vivekanand Govt. Utkrisht College Ghumarwin</p>
            </div>
            <div className="contact-item">
              <FaPhoneAlt className="icon-red" />
              <span>+91 88941-84047</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="icon-red" />
              <span>eduVibe@gmail.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;