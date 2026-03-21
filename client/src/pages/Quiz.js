import React, { useState } from 'react';
import './Quiz.css'; 

const Quiz = () => {
  const questions = [
    {
      questionText: "CPU ki full form kya hai?",
      answerOptions: [
        { answerText: "Central Processing Unit", isCorrect: true },
        { answerText: "Computer Processing Unit", isCorrect: false },
        { answerText: "Central Programming Unit", isCorrect: false },
        { answerText: "Control Power Unit", isCorrect: false },
      ],
    },
    {
      questionText: "Computer ka 'Brain' kise kaha jata hai?",
      answerOptions: [
        { answerText: "RAM", isCorrect: false },
        { answerText: "Hard Disk", isCorrect: false },
        { answerText: "CPU", isCorrect: true },
        { answerText: "Monitor", isCorrect: false },
      ],
    },
    {
      questionText: "1 KB mein kitne Bytes hote hain?",
      answerOptions: [
        { answerText: "1000 Bytes", isCorrect: false },
        { answerText: "1024 Bytes", isCorrect: true },
        { answerText: "2048 Bytes", isCorrect: false },
        { answerText: "512 Bytes", isCorrect: false },
      ],
    },
    {
      questionText: "C++ kis tarah ki language hai?",
      answerOptions: [
        { answerText: "Object-Oriented (OOP)", isCorrect: true },
        { answerText: "Low-level", isCorrect: false },
        { answerText: "Markup", isCorrect: false },
        { answerText: "Styling", isCorrect: false },
      ],
    },
    {
      questionText: "Kaunsi memory 'Volatile' (temporary) hoti hai?",
      answerOptions: [
        { answerText: "ROM", isCorrect: false },
        { answerText: "Hard Drive", isCorrect: false },
        { answerText: "RAM", isCorrect: true },
        { answerText: "Pendrive", isCorrect: false },
      ],
    },
    {
      questionText: "HTML ki full form kya hai?",
      answerOptions: [
        { answerText: "Hyper Text Markup Language", isCorrect: true },
        { answerText: "High Text Machine Language", isCorrect: false },
        { answerText: "Hyper Tabular Marking Language", isCorrect: false },
        { answerText: "None of these", isCorrect: false },
      ],
    },
    {
      questionText: "C++ mein 'cout' ka use kis liye hota hai?",
      answerOptions: [
        { answerText: "Input lene ke liye", isCorrect: false },
        { answerText: "Output print karne ke liye", isCorrect: true },
        { answerText: "Variable declare karne ke liye", isCorrect: false },
        { answerText: "Loop chalane ke liye", isCorrect: false },
      ],
    },
    {
      questionText: "Inme se kaunsa ek Operating System (OS) hai?",
      answerOptions: [
        { answerText: "Windows 11", isCorrect: true },
        { answerText: "Google Chrome", isCorrect: false },
        { answerText: "MS Office", isCorrect: false },
        { answerText: "Python", isCorrect: false },
      ],
    },
    {
      questionText: "MERN stack mein 'M' ka kya matlab hai?",
      answerOptions: [
        { answerText: "MySQL", isCorrect: false },
        { answerText: "Microsoft", isCorrect: false },
        { answerText: "MongoDB", isCorrect: true },
        { answerText: "Memory", isCorrect: false },
      ],
    },
    {
      questionText: "WWW ki full form kya hai?",
      answerOptions: [
        { answerText: "World Wide Web", isCorrect: true },
        { answerText: "World Whole Web", isCorrect: false },
        { answerText: "Wide World Website", isCorrect: false },
        { answerText: "Web World Wide", isCorrect: false },
      ],
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [clickedAnswer, setClickedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerButtonClick = (answerOption, index) => {
    if (isAnswered) return;
    setClickedAnswer(index);
    setIsAnswered(true);
    if (answerOption.isCorrect) setScore(score + 1);

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setClickedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowScore(true);
      }
    }, 1000); 
  };

  return (
    <div className="quiz-page-container">
      <div className="quiz-box-main">
        {showScore ? (
          <div className="score-area">
            <h2 style={{color: '#ff5722'}}>Aapka Result 🎓</h2>
            <div style={{fontSize: '2rem', margin: '20px 0'}}>
                Score: <strong>{score}</strong> / {questions.length}
            </div>
            <button className="reset-btn" onClick={() => window.location.reload()}>Restart Quiz</button>
          </div>
        ) : (
          <>
            <div className="q-header">
              <p className="q-count">Sawaal {currentQuestion + 1}<span>/{questions.length}</span></p>
              <h2 className="q-text">{questions[currentQuestion].questionText}</h2>
            </div>
            <div className="options-grid">
              {questions[currentQuestion].answerOptions.map((answer, index) => {
                let status = "";
                if (isAnswered) {
                  if (answer.isCorrect) status = "correct-opt";
                  else if (clickedAnswer === index) status = "wrong-opt";
                }
                return (
                  <button
                    key={index}
                    className={`opt-button ${status}`}
                    onClick={() => handleAnswerButtonClick(answer, index)}
                    disabled={isAnswered}
                  >
                    {answer.answerText}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;