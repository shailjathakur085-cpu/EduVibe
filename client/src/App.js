import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubjectList from './pages/SubjectList';
import Programs from './pages/Programs';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Semester from './pages/Semester'; 
import ChapterDetail from './pages/ChapterDetail';
import ViewProgram from './pages/ViewProgram';
import Notes from './pages/Notes';
import ViewNote from './pages/ViewNote';
import Login from './pages/Login';
import Register from './pages/Register';
import AddSubject from './pages/admin/AddSubject';
import AddStream from './pages/admin/AddStream';
import AddProgram from './pages/admin/AddProgram';
import AddSemester from "./pages/admin/AddSemester";
import AddSyllabus from "./pages/admin/AddSyllabus";
import AddNote from "./pages/admin/AddNote";
import Quiz from './pages/Quiz';
import About from './pages/About';
import Contact from "./pages/Contact";
import SectionPage from './pages/Section';


function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar hamesha upar rahega */}
        <Navbar />

        {/* Saare Route hamesha Routes tag ke andar hone chahiye */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Academic Routes */}
          <Route path="/semester/:id" element={<Semester />} />
          <Route path="/subject-list/:semId" element={<SubjectList />} />
          <Route path="/chapter/:topic" element={<ChapterDetail />} />
          <Route path="/programs/:lang" element={<Programs />} />
          <Route path="/view-program/:lang/:id" element={<ViewProgram />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/view-note/:id" element={<ViewNote />} />
<Route path="/cs/:sectionId" element={<SectionPage />} />
          {/* Admin Routes */}
          <Route path="/admin/add-subject" element={<AddSubject />} />
          <Route path="/admin/add-stream" element={<AddStream />} />
          <Route path="/admin/add-program" element={<AddProgram />} />
          <Route path="/admin/add-semester" element={<AddSemester />} />
          <Route path="/admin/add-syllabus" element={<AddSyllabus />} />
          <Route path="/admin/add-note" element={<AddNote />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;