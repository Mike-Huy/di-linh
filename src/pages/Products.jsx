import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('dilinh_product')
      .select('*')
      .eq('status', true)
      .order('id', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  }

  return (
    <div className="product-page">
      <section className="container">
        <div className="section-title">
          <h2>Danh Mục Sản Phẩm</h2>
          <p>Tận hưởng hương vị cao cấp từ Di Linh. Mỗi sản phẩm được đóng gói tỉ mỉ, sang trọng, là món quà sức khỏe tuyệt vời cho người thân và đối tác.</p>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Đang tải sản phẩm...</p>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.product_long} className="product-image" />
                </div>
                <div className="product-info">
                  <h3>{product.product_long}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Được chế biến từ rau củ tươi Di Linh kết hợp cùng mật ong rừng nguyên chất.</p>
                  <div className="price-container">
                    <span className="price-original">{product.sale_price?.toLocaleString()}đ</span>
                    <span className="price-promo">{product.promo_price > 0 ? product.promo_price.toLocaleString() + 'đ' : ''}</span>
                  </div>
                  <button className="btn-premium">Thêm vào giỏ</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;
