import React from 'react';
import { useParams } from 'react-router-dom';

const ChapterDetail = () => {
    const { topic } = useParams();

    const contentData = {
        "Computer Fundamental & Office Automation": {
            title: "Computer Fundamental & Office Automation",
            description: "Introduction to computer systems and office tools.",
            points: ["Hardware/Software", "Operating Systems", "MS Office", "Networking"],
            pdfUrl: "https://www.tutorialspoint.com/computer_fundamentals/computer_fundamentals_tutorial.pdf"
        },
        "Business Communication": {
            title: "Business Communication",
            description: "Professional communication skills for business environments.",
            points: ["Verbal/Non-verbal", "Report Writing", "Interviews", "Presentations"],
            pdfUrl: "https://www.tutorialspoint.com/business_communication/business_communication_tutorial.pdf"
        },
        "Principle of Management": {
            title: "Principle of Management",
            description: "Fundamentals of management and organizational behavior.",
            points: ["Planning", "Organizing", "Staffing", "Leading"],
            pdfUrl: "https://www.tutorialspoint.com/management_principles/management_principles_tutorial.pdf"
        },
        "Digital Electronics": {
            title: "Digital Electronics Syllabus",
            description: "Digital circuits, logic gates, and Boolean algebra.",
            points: ["Logic Gates", "K-Maps", "Flip Flops", "Registers"],
            pdfUrl: "https://www.tutorialspoint.com/digital_circuits/digital_circuits_tutorial.pdf"
        },
        "Object Oriented Programming": {
            title: "Object Oriented Programming (C++)",
            description: "Classes, Objects, and OOPs concepts using C++.",
            points: ["Classes/Objects", "Inheritance", "Polymorphism", "Encapsulation"],
            pdfUrl: "https://www.tutorialspoint.com/cplusplus/cpp_tutorial.pdf"
        },
        "Database Management System": {
            title: "Database Management System (DBMS)",
            description: "Data management and SQL query handling.",
            points: ["ER Model", "SQL Queries", "Normalization", "Concurrency"],
            pdfUrl: "https://www.tutorialspoint.com/dbms/dbms_tutorial.pdf"
        }
    };

    const decodedTopic = decodeURIComponent(topic);
    const currentData = contentData[decodedTopic] || contentData[topic];

    if (!currentData) {
        return (
            <div style={{ padding: "50px", textAlign: "center" }}>
                <h1>Subject Not Found!</h1>
                <p>Kripya sahi subject select karein.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif" }}>
            <div style={{ 
                background: "#fff", 
                padding: "30px", 
                borderRadius: "15px", 
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                borderLeft: "8px solid #ff4d4d"
            }}>
                <h1 style={{ color: "#333" }}>{currentData.title}</h1>
                <p style={{ fontSize: "17px", color: "#555" }}>{currentData.description}</p>
                <h3 style={{ color: "#ff4d4d" }}>Key Topics:</h3>
                <ul>
                    {currentData.points.map((p, i) => (
                        <li key={i}>{p}</li>
                    ))}
                </ul>
                <a 
                    href={currentData.pdfUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                        display: "inline-block", 
                        marginTop: "20px", 
                        padding: "12px 25px", 
                        backgroundColor: "#28a745", 
                        color: "white", 
                        textDecoration: "none", 
                        borderRadius: "5px",
                        fontWeight: "bold"
                    }}
                >
                    View PDF
                </a>
            </div>
        </div>
    );
};

export default ChapterDetail;