import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './index.css'; // Make sure global CSS is imported

// Dummy components for routes we haven't built yet
const Collections = () => <div style={{padding: '5rem', textAlign: 'center'}}><h1>Collections Page Coming Soon</h1></div>;
const Cart = () => <div style={{padding: '5rem', textAlign: 'center'}}><h1>Cart Page Coming Soon</h1></div>;
const Login = () => <div style={{padding: '5rem', textAlign: 'center'}}><h1>Login Page Coming Soon</h1></div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
