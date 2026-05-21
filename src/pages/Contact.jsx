import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="contact-page">
      <section className="container">
        <div className="section-title">
          <h2>Liên Hệ Với Chúng Tôi</h2>
          <p>Mọi thắc mắc hoặc yêu cầu đặt mua số lượng lớn, vui lòng để lại thông tin bên dưới.</p>
        </div>

        <div className="contact-wrapper" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginTop: '60px' }}>
          <div className="contact-info">
            <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '30px' }}>Thông Tin Văn Phòng</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#555', fontSize: '1.2rem' }}>
                <MapPin size={24} color="var(--primary-color)" /> 
                <span>123 Quốc lộ 20, Thị trấn Di Linh, Lâm Đồng</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#555', fontSize: '1.2rem' }}>
                <Phone size={24} color="var(--primary-color)" /> 
                <span>090 123 4567 / 0263 3234 567</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#555', fontSize: '1.2rem' }}>
                <Mail size={24} color="var(--primary-color)" /> 
                <span>hello@banhmutdilinh.com</span>
              </li>
            </ul>

            <div style={{ marginTop: '50px' }}>
              <h4 style={{ marginBottom: '20px' }}>Giờ làm việc</h4>
              <p style={{ color: '#777' }}>Thứ 2 - Thứ 7: 08:00 - 18:00</p>
              <p style={{ color: '#777' }}>Chủ nhật: 09:00 - 12:00</p>
            </div>
          </div>

          <form className="contact-form" style={{ background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <input type="text" placeholder="Họ và tên" style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd' }} />
              <input type="email" placeholder="Email" style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd' }} />
            </div>
            <input type="text" placeholder="Số điện thoại" style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '20px' }} />
            <textarea placeholder="Tin nhắn của bạn" rows="6" style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '20px' }}></textarea>
            <button className="btn-premium" style={{ width: '100%', justifyContent: 'center' }}>
              Gửi tin nhắn <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
