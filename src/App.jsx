import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"
import Boot from './components/Boot/Boot';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Contact from './components/Contact/Contact';
import NotFound from './components/404/404';
import Status from './api/Status/Status';
import Robots from '../robots.txt';
import SiteMap from '../sitemap.xml';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Boot />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/status" element={<Status />} />
        <Route path="/sitemap.xml" element={<SiteMap />} />
        <Route path="/robots.txt" element={<Robots />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    <Analytics/>
    </Router>
  );
};

export default App;
