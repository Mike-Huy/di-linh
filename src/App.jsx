import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingSidebar from './components/FloatingSidebar';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import News from './pages/News';
import Contact from './pages/Contact';

import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={
          <div className="app-wrapper">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gioi-thieu" element={<About />} />
                <Route path="/san-pham" element={<Products />} />
                <Route path="/tin-tuc" element={<News />} />
                <Route path="/lien-he" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
            <FloatingSidebar />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
