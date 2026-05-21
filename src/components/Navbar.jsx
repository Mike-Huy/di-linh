import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, LogIn, ShoppingCart, Search, X, Menu } from 'lucide-react';
import { supabase } from '../supabase';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [credentials, setCredentials] = useState({ nickname: '', pass: '' });
  const [user, setUser] = useState({ name: 'Thành viên', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase
      .from('dilinh_users')
      .select('*')
      .eq('nick_name', credentials.nickname)
      .eq('pass', credentials.pass)
      .single();

    if (data) {
      setUser({ name: data.full_name || data.nick_name, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.nick_name}` });
      setIsLoggedIn(true);
      setShowLogin(false);
      
      // Tự động chuyển trang admin nếu là quyền admin
      if (data.user_role === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      }
    } else {
      setError('Sai nickname hoặc mật khẩu!');
    }
  };

  const navLinks = [
    { to: "/", text: "Trang chủ" },
    { to: "/gioi-thieu", text: "Giới thiệu" },
    { to: "/san-pham", text: "Sản phẩm" },
    { to: "/tin-tuc", text: "Tin tức" },
    { to: "/lien-he", text: "Liên hệ" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="container nav-content">
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <NavLink to="/" className="nav-logo">
            DI LINH GIFT
          </NavLink>

          <ul className={`nav-links ${isMenuOpen ? 'mobile-active' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink 
                  to={link.to} 
                  className={({ isActive }) => isActive ? "active" : ""}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.text}
                </NavLink>
              </li>
            ))}
            {/* Login for mobile menu */}
            <li className="mobile-only">
              {!isLoggedIn ? (
                <button className="btn-premium" onClick={() => { setShowLogin(true); setIsMenuOpen(false); }}>
                  <LogIn size={18} /> Đăng nhập
                </button>
              ) : (
                <div className="user-profile">
                  <span className="user-name">{user.name}</span>
                </div>
              )}
            </li>
          </ul>

          <div className="nav-auth">
            {!isLoggedIn ? (
              <button className="btn-premium" onClick={() => setShowLogin(true)}>
                <LogIn size={18} /> Đăng nhập
              </button>
            ) : (
              <div className="user-profile">
                <span className="user-name">{user.name}</span>
                <img src={user.avatar} alt="avatar" className="user-avatar" />
              </div>
            )}
          </div>
        </div>
      </nav>

      {showLogin && (
        <div className="admin-modal-overlay" style={{ zIndex: 2000 }}>
          <div className="admin-card" style={{ maxWidth: '400px', width: '90%', position: 'relative' }}>
            <button 
              onClick={() => setShowLogin(false)} 
              style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2E7D32' }}>Đăng nhập</h2>
            <form onSubmit={handleLogin}>
              <div className="admin-form-group">
                <label>Nickname</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  required
                  value={credentials.nickname}
                  onChange={(e) => setCredentials({ ...credentials, nickname: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Mật khẩu</label>
                <input 
                  type="password" 
                  className="admin-input" 
                  required
                  value={credentials.pass}
                  onChange={(e) => setCredentials({ ...credentials, pass: e.target.value })}
                />
              </div>
              {error && <p style={{ color: '#C62828', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
