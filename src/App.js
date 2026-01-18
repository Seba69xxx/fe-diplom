import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Main from './pages/Main/Main';
import Order from './pages/Order/Order';
import Success from './pages/Success/Success';
import './index.scss';

function App() {
  return (
    <BrowserRouter>
      <div className="app" id="top">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/order/*" element={<Order />} />
          <Route path="/success" element={<Success />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;