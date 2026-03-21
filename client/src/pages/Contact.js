import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaMobileAlt,
  FaEnvelope,
  FaGlobe
} from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">

      {/* ===== HERO SECTION ===== */}
      <div className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contact
        </motion.h1>
      </div>

      {/* ===== CONTACT DETAILS ===== */}
      <div className="contact-container">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Contact Details
        </motion.h2>

        <div className="contact-cards">

          {/* ADDRESS */}
          <motion.div
            className="contact-card"
            whileHover={{ y: -8 }}
          >
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h4>Edu Vibe</h4>
              <p>
               Swami Vivekanand Utkrisht Govt. College Ghumarwin
              </p>
            </div>
          </motion.div>

          {/* PHONE */}
          <motion.div className="contact-card" whileHover={{ y: -8 }}>
            <div className="contact-icon">
              <FaPhoneAlt />
            </div>
            <div>
              <h4>Phone</h4>
              <p>+91 88941-84047<br />+91 93174-70140</p>
            </div>
          </motion.div>

          {/* MOBILE */}
          <motion.div className="contact-card" whileHover={{ y: -8 }}>
            <div className="contact-icon">
              <FaMobileAlt />
            </div>
            <div>
              <h4>Mobile</h4>
              <p>+91 88941-84047</p>
            </div>
          </motion.div>

          {/* EMAIL */}
          <motion.div className="contact-card" whileHover={{ y: -8 }}>
            <div className="contact-icon">
              <FaEnvelope />
            </div>
            <div>
              <h4>Email</h4>
              <p>eduvibe@gmail.com</p>
            </div>
          </motion.div>

          {/* WEBSITES */}
          <motion.div className="contact-card" whileHover={{ y: -8 }}>
            <div className="contact-icon">
              <FaGlobe />
            </div>
            <div>
              <h4>Websites</h4>
              <p>
                www.EduVibe.com<br />
              
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ===== STICKY CALL BAR ===== */}
      <div className="contact-call-bar">
        <span>Email: cs@cssoftsolutions.com</span>
        <div className="call-buttons">
          <a href="tel:+911724017707">+91 172 4017707</a>
          <a href="tel:+911725007164">+91 172 5007164</a>
          <a href="tel:+919815701003">+91 98157 01003</a>
        </div>
      </div>

    </div>
  );
};

export default Contact;
