import React from 'react';
import { Phone, MessageCircle, ShoppingCart } from 'lucide-react';

const FloatingSidebar = () => {
  return (
    <div className="floating-sidebar">
      <a href="tel:0901234567" className="floating-btn" title="Số điện thoại">
        <Phone size={24} />
      </a>
      <a href="https://zalo.me/0901234567" target="_blank" rel="noopener noreferrer" className="floating-btn" title="Zalo">
        <MessageCircle size={24} />
      </a>
      <button className="floating-btn" title="Giỏ hàng">
        <ShoppingCart size={24} />
        <span className="badge">3</span>
      </button>
    </div>
  );
};

export default FloatingSidebar;
