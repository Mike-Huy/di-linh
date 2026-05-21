import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="footer-col brand-col">
          <h3>Bánh Mứt Di Linh</h3>
          <p className="slogan">Mang hương vị tinh túy từ cao nguyên Lâm Đồng đến mọi nhà. Chúng tôi cam kết chất lượng sạch, tự nhiên và an toàn.</p>
        </div>

        {/* Cột 2: Quy định & Chính sách */}
        <div className="footer-col policy-col">
          <h4>Quy định & Chính sách</h4>
          <ul>
            <li><a href="#dieu-khoan">Điều khoản sử dụng</a></li>
            <li><a href="#bao-mat">Bảo mật dữ liệu cá nhân</a></li>
            <li><a href="#giao-hang">Quy định giao hàng</a></li>
            <li><a href="#doi-tra">Quy định đổi trả</a></li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div className="footer-col contact-col">
          <h4>Thông tin liên hệ</h4>
          <p><strong>Địa chỉ:</strong> Tổ 18, Thị trấn Di Linh, Huyện Di Linh, Tỉnh Lâm Đồng</p>
          <p><strong>Hotline:</strong> 0901 234 567</p>
          <p><strong>Email:</strong> lienhe@quatangdilinh.vn</p>
        </div>
      </div>
      
      <div className="container footer-bottom">
        <p>© 2026 Bánh Mứt Di Linh. All rights reserved. Crafted with passion.</p>
      </div>
    </footer>
  );
};

export default Footer;
