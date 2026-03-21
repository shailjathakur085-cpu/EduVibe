import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCode, FaArrowLeft, FaEye } from 'react-icons/fa';
import './Programs.css';

const Programs = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  
  // State for merged data (Static + Database)
  const [finalList, setFinalList] = useState([]);
  
  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; 

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1); 

    // 1. AAPKA PURANA STATIC DATA (Bilkul Same)
    const allPrograms = {
      "c": [
        { id: 1, name: "Sum of all numbers using loop" },
        { id: 2, name: "Factorial of a number" },
        { id: 3, name: "Fibonacci series" },
        { id: 4, name: "Reverse a number" },
        { id: 5, name: "Check if a number is prime" },
        { id: 6, name: "Check Palindrome Number" },
        { id: 7, name: "Find largest among 3 numbers" },
        { id: 8, name: "Armstrong number check" },
        { id: 9, name: "Swap two numbers without third variable" },
        { id: 10, name: "Matrix Multiplication" },
        { id: 11, name: "Linear Search in Array" }
      ],
      "cpp": [
        { id: 1, name: "C++ Hello World Program" },
        { id: 2, name: "Addition of two numbers (OOPs)" },
        { id: 3, name: "Class and Object Example" },
        { id: 4, name: "Function Overloading" },
        { id: 5, name: "Inheritance Example" },
        { id: 6, name: "Virtual Functions" },
        { id: 7, name: "File Handling in C++" },
        { id: 8, name: "Templates Example" },
        { id: 9, name: "Inline Functions" },
        { id: 10, name: "Exception Handling in C++" }
      ],
      "java": [
        { id: 1, name: "Hello World in Java" },
        { id: 2, name: "Taking Input using Scanner" },
        { id: 3, name: "Method Overriding" },
        { id: 4, name: "Abstract Class Example" },
        { id: 5, name: "Interface Implementation" },
        { id: 6, name: "Custom Exception Handling" },
        { id: 7, name: "ArrayList and LinkedList" },
        { id: 8, name: "HashMap Operations" },
        { id: 9, name: "String Manipulation" },
        { id: 10, name: "Java JDBC Connection" }
      ],
      "dsa": [
        { id: 1, name: "Linear Search Algorithm" },
        { id: 2, name: "Binary Search (Recursive)" },
        { id: 3, name: "Bubble Sort Implementation" },
        { id: 4, name: "Insertion Sort" },
        { id: 5, name: "Selection Sort" },
        { id: 6, name: "Stack using Linked List" },
        { id: 7, name: "Queue using Array" },
        { id: 8, name: "Inorder Traversal of Binary Tree" },
        { id: 9, name: "BFS - Graph Traversal" },
        { id: 10, name: "DFS Algorithm" }
      ],
      "notes": [
        { id: 1, name: "Introduction to Computer Basics" },
        { id: 2, name: "Understanding RAM and ROM" },
        { id: 3, name: "Network OSI Model (7 Layers)" },
        { id: 4, name: "Database Normalization (1NF, 2NF, 3NF)" },
        { id: 5, name: "Software Development Life Cycle" },
        { id: 6, name: "Cyber Law & Professional Ethics" },
        { id: 7, name: "Cloud Computing Architectures" },
        { id: 8, name: "Mobile App Development Roadmap" }
      ]
    };

    // --- 2. NEW LOGIC: Fetch from Database & Merge ---
    const loadData = async () => {
      const staticData = allPrograms[lang] || [];
      
      try {
        // Backend se data mangwana
        const res = await fetch(`http://localhost:8081/api/programs/${lang}`);
        const dbData = await res.json();
        
        if (res.ok && Array.isArray(dbData)) {
          // Static + Dynamic ko jodna
          setFinalList([...staticData, ...dbData]);
        } else {
          setFinalList(staticData);
        }
      } catch (error) {
        console.error("API Error:", error);
        setFinalList(staticData); // Error aaye toh sirf purana dikhao
      }
    };

    loadData();

  }, [lang]);

  // Pagination Logic (Ab 'finalList' use karega)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = finalList.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(finalList.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="programs-page">
      <button className="btn-back-nav" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="programs-header">
        <div className="header-content">
          <FaCode style={{ fontSize: '3rem', color: '#FF5733', marginBottom: '10px' }} />
          <h1>{lang === 'dsa' ? 'Data Structures' : lang.toUpperCase()} Content</h1>
          <p>Displaying Page {currentPage} of {pageNumbers.length}</p>
        </div>
      </div>

      <div className="programs-container">
        <h2 className="table-heading">Study Materials & Programs</h2>
        
        <table className="programs-table">
          <thead>
            <tr>
              <th width="10%">No</th>
              <th width="75%">Name</th>
              <th width="15%">View</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              // Logic: Check karo ye Static hai ya Database item
              // Database items ke paas '_id' hoti hai, Static ke paas number 'id' hoti hai
              const isDatabaseItem = item._id ? true : false;
              
              // Agar DB item hai, toh uska serial number calculate karo
              // (Pagination Index + Row Index + 1)
              const displayId = indexOfFirstItem + index + 1;
              
              // Link ke liye sahi ID use karo
              const linkId = isDatabaseItem ? item._id : item.id;

              return (
                <tr key={isDatabaseItem ? item._id : item.id} style={isDatabaseItem ? {backgroundColor: '#fff5f2'} : {}}>
                  <td>{displayId}</td>
                  
                  <td className="program-name">
                    {item.name || item.title} 
                    {/* NEW Badge for Database Items */}
                    {isDatabaseItem && (
                      <span style={{
                        fontSize:'10px', 
                        background:'#FF5733', 
                        color:'white', 
                        padding:'2px 6px', 
                        borderRadius:'4px', 
                        marginLeft:'10px'
                      }}>
                        NEW
                      </span>
                    )}
                  </td>
                  
                  <td>
                    <button className="btn-view" onClick={() => navigate(`/view-program/${lang}/${linkId}`)}>
                      <FaEye />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Pagination Buttons */}
        <div className="pagination">
          {pageNumbers.map(number => (
            <button 
              key={number} 
              onClick={() => {
                setCurrentPage(number);
                window.scrollTo(0, 350); 
              }}
              className={currentPage === number ? "active" : ""}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Programs;