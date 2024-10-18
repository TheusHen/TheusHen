// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import Boot from './components/Boot/Boot';
import Projects from './components/Projects/Projects';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import NotFound from './components/404/404';
import Status from './api/Status/Status';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Boot />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/status" element={<Status />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </Router>
  );
};

export default App;
