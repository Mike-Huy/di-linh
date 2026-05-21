import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Leaf, ChefHat, Flame, Snowflake, Search, Calendar, User } from 'lucide-react';
import { supabase } from '../supabase';

const Home = () => {
  const [sections, setSections] = useState([
    { id: 'hero', visible: true, media_url: '/qc.mp4', media_type: 'video' },
    { id: 'featured', visible: true },
    { id: 'process', visible: true },
    { id: 'testimonials', visible: true },
    { id: 'news', visible: true },
    { id: 'partners', visible: true }
  ]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [news, setNews] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    // Fetch layout & partners
    const { data: configData } = await supabase
      .from('dilinh_app_settings')
      .select('value')
      .eq('key', 'site_config')
      .single();
    
    if (configData && configData.value) {
      if (configData.value.home_sections) setSections(configData.value.home_sections);
      if (configData.value.partners) setPartners(configData.value.partners);
    }

    // Fetch featured products
    const { data: prodData } = await supabase
      .from('dilinh_product')
      .select('*')
      .eq('status', true)
      .limit(6);
    if (prodData) setProducts(prodData);

    // Fetch testimonials
    const { data: testData } = await supabase
      .from('dilinh_posts')
      .select('*')
      .eq('post_type', 'testimonial')
      .eq('status', true)
      .limit(10);
    if (testData) setTestimonials(testData);

    // Fetch news
    const { data: newsData } = await supabase
      .from('dilinh_posts')
      .select('*')
      .eq('post_type', 'article')
      .eq('status', true)
      .order('created_at', { ascending: false })
      .limit(3);
    if (newsData) setNews(newsData);

    setLoading(false);
  }

  const renderSection = (id) => {
    const sectionConfig = sections.find(s => s.id === id);
    if (!sectionConfig || !sectionConfig.visible) return null;

    switch (id) {
      case 'hero':
        return (
          <section className="hero">
            <video 
              className="hero-video" 
              autoPlay 
              loop 
              muted 
              playsInline 
              src="/qc.mp4"
            />
            <div className="hero-overlay"></div>
            <div className="hero-content fade-in">
              <h1>Tinh Hoa Nông Sản Di Linh</h1>
              <p>Món quà từ đất mẹ Lâm Đồng, kết tinh giữa hương vị truyền thống và quy trình sản xuất hiện đại.</p>
              <button className="btn-premium">Khám phá ngay <ArrowRight size={20} /></button>
            </div>
          </section>
        );
      case 'featured':
        if (products.length === 0) return null;
        return (
          <section className="container">
            <div className="section-title">
              <h2>Sản Phẩm Nổi Bật</h2>
              <p>Những hương vị được yêu thích nhất từ vùng đất Di Linh nắng gió.</p>
            </div>
            <div className="product-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.product_long} className="product-image" />
                  </div>
                  <div className="product-info">
                    <h3>{product.product_long}</h3>
                    <div className="price-container">
                      <span className="price-original">{product.sale_price?.toLocaleString()}đ</span>
                      <span className="price-promo">{product.promo_price > 0 ? product.promo_price.toLocaleString() + 'đ' : ''}</span>
                    </div>
                    <button className="btn-outline">Thêm vào giỏ hàng</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'process':
        const steps = [
          { title: 'Chọn lọc nguyên liệu', desc: 'Rau củ được thu hái tươi mới từ các trang trại VietGAP tại Di Linh.', Icon: Leaf, num: '1' },
          { title: 'Sơ chế thủ công', desc: 'Rửa sạch, gọt vỏ và thái lát tỉ mỉ bởi những người thợ lành nghề.', Icon: ChefHat, num: '2' },
          { title: 'Chế biến bí truyền', desc: 'Sử dụng công thức gia truyền, kết hợp mật ong rừng và đường phèn tinh khiết.', Icon: Flame, num: '3' },
          { title: 'Sấy lạnh công nghệ cao', desc: 'Giữ trọn màu sắc, hương vị và dinh dưỡng tự nhiên của rau củ.', Icon: Snowflake, num: '4' },
        ];
        return (
          <section className="process-section" style={{ background: 'var(--bg-color)' }}>
            <div className="container">
              <div className="section-title">
                <h2>Quy Trình Sản Xuất</h2>
                <p>Tận tâm trong từng công đoạn để mang đến sản phẩm tuyệt hảo nhất.</p>
              </div>
              <div className="process-grid">
                {steps.map((step, index) => (
                  <div key={index} className="process-step">
                    <div className="step-icon-wrapper">
                      <div className="step-number-badge">{step.num}</div>
                      <step.Icon size={40} strokeWidth={1.5} color="white" />
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'testimonials':
        if (testimonials.length === 0) return null;
        const displayTestimonials = [...testimonials, ...testimonials];
        return (
          <section className="testimonials-section" style={{ overflow: 'hidden' }}>
            <div className="container">
              <div className="section-title">
                <h2>Cảm Nhận Khách Hàng</h2>
              </div>
            </div>
            <div className="testimonial-marquee-container">
              <div className="testimonial-track">
                {displayTestimonials.map((t, i) => (
                  <div key={i} className="testimonial-card" style={{ width: '350px', flexShrink: 0 }}>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="var(--primary-color)" color="var(--primary-color)" />)}
                    </div>
                    <p>"{t.content}"</p>
                    <div className="customer-info" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: 'auto' }}>
                      <img src={t.thumbnail || `https://api.dicebear.com/7.x/initials/svg?seed=${t.title}`} alt="customer" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ margin: 0 }}>{t.title}</h4>
                        <span style={{ fontSize: '13px', color: '#888' }}>Khách hàng</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'news':
        if (news.length === 0) return null;
        return (
          <section className="container">
            <div className="section-title">
              <h2>Tin Tức & Cẩm Nang</h2>
              <p>Chia sẻ những kiến thức về nông sản, mẹo nấu ăn và các xu hướng ẩm thực lành mạnh.</p>
            </div>
            <div className="news-grid">
              {news.map(article => (
                <article key={article.id} className="news-card">
                  <div className="news-image-container">
                    <img src={article.thumbnail} alt={article.title} />
                  </div>
                  <div className="news-content">
                    <div className="news-meta">
                      <span><Calendar size={14} /> {new Date(article.created_at).toLocaleDateString('vi-VN')}</span>
                      <span><User size={14} /> Admin</span>
                    </div>
                    <h3>{article.title}</h3>
                    <div 
                      style={{ color: '#777', fontSize: '0.95rem', marginBottom: '25px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    <button className="read-more">Đọc thêm <ArrowRight size={16} /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      case 'partners':
        if (partners.length === 0) return null;
        const displayPartners = [...partners, ...partners];
        return (
          <section className="partners-section">
            <div className="container marquee-container">
              <div className="partner-marquee">
                <div className="partner-track">
                  {displayPartners.map((partner, index) => (
                    <div key={index} className="partner-item">
                      <img src={partner.logo} alt={partner.name} />
                      <span>{partner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      default: return null;
    }
  };

  return (
    <div className="home-page">
      {sections.map(section => (
        <React.Fragment key={section.id}>
          {renderSection(section.id)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Home;
