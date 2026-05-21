import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Products from './Admin/Products';
import Posts from './Admin/Posts';
import LayoutMgmt from './Admin/Layout';
import Settings from './Admin/Settings';
import '../styles/Admin.css';
import { 
  ShoppingBag, 
  FileText, 
  Settings as SettingsIcon, 
  Layout as LayoutIcon, 
  LogOut,
  User,
  Package,
  Globe
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');
  const [isLogged, setIsLogged] = useState(false);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [adminName, setAdminName] = useState('Super Admin');
  const [adminNickname, setAdminNickname] = useState('dilinh_sadmin');

  useEffect(() => {
    // Tự động giữ đăng nhập nếu đã login qua Navbar
    if (localStorage.getItem('isAdmin') === 'true') {
      setIsLogged(true);
      setAdminName(localStorage.getItem('adminName') || 'Super Admin');
      setAdminNickname(localStorage.getItem('adminNickname') || 'dilinh_sadmin');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('dilinh_users')
      .select('*')
      .eq('nick_name', nickname)
      .eq('pass', password)
      .eq('user_role', 'admin')
      .single();

    if (data) {
      setIsLogged(true);
      setError('');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminName', data.full_name || 'Super Admin');
      localStorage.setItem('adminNickname', data.nick_name || 'dilinh_sadmin');
      setAdminName(data.full_name || 'Super Admin');
      setAdminNickname(data.nick_name || 'dilinh_sadmin');
    } else {
      setError('Nickname hoặc mật khẩu không chính xác.');
    }
  };

  const handleLogout = () => {
    setIsLogged(false);
    setNickname('');
    setPassword('');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminNickname');
  };

  if (!isLogged) {
    return (
      <div className="admin-modal-overlay">
        <div className="admin-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#2E7D32', fontSize: '24px' }}>Quản trị Di Linh</h1>
            <p style={{ color: '#666' }}>Vui lòng đăng nhập để tiếp tục</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="admin-form-group">
              <label>Nickname</label>
              <input 
                type="text" 
                className="admin-input" 
                required 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label>Mật khẩu</label>
              <input 
                type="password" 
                className="admin-input" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '20px' }}>{error}</p>}
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>Đăng nhập</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-logo">QUẢN TRỊ</div>
        
        <div className="admin-menu">
          <div 
            className={`admin-menu-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} />
            Sản phẩm
          </div>
          <div 
            className={`admin-menu-item ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <FileText size={20} />
            Bài viết
          </div>
          <div 
            className={`admin-menu-item ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            <LayoutIcon size={20} />
            Bố cục & Menu
          </div>
          <div 
            className={`admin-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon size={20} />
            Cài đặt chung
          </div>
        </div>
      </div>

      <div className="admin-content">
        {/* HEADER TOP BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: '1.5px solid rgba(139, 90, 43, 0.1)'
        }}>
          {/* Nút Xem Website */}
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="admin-btn admin-btn-outline" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              textDecoration: 'none',
              padding: '6px 14px',
              fontSize: '12px',
              borderRadius: '50px',
              border: '1.5px solid var(--primary-color)',
              color: 'var(--primary-color)',
              fontWeight: 700
            }}
          >
            <Globe size={14} />
            <span>Xem website</span>
          </a>

          {/* Nút Đăng Xuất */}
          <button 
            onClick={handleLogout} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              cursor: 'pointer',
              border: '1.5px solid #d32f2f',
              color: '#d32f2f',
              padding: '6px 14px',
              borderRadius: '50px',
              background: 'transparent',
              fontWeight: 700,
              fontSize: '12px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d32f2f';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#d32f2f';
            }}
          >
            <LogOut size={14} />
            <span>Đăng xuất</span>
          </button>

          {/* Avatar User */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            marginLeft: '5px',
            paddingLeft: '12px',
            borderLeft: '1.5px solid rgba(139, 90, 43, 0.15)'
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary-color)' }}>{adminName}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>@{adminNickname}</div>
            </div>
            <img 
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${adminNickname}`} 
              alt="avatar" 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                border: '2px solid var(--accent-color)',
                padding: '2px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
              }} 
            />
          </div>
        </div>

        {activeTab === 'products' && <Products />}
        {activeTab === 'posts' && <Posts />}
        {activeTab === 'layout' && <LayoutMgmt />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
}
