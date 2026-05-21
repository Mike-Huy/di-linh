import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoading(true);
    const { data, error } = await supabase
      .from('dilinh_posts')
      .select('*')
      .eq('post_type', 'article')
      .eq('status', true)
      .order('created_at', { ascending: false });
    
    if (data) setArticles(data);
    setLoading(false);
  }

  return (
    <div className="news-page">
      <section className="container">
        <div className="section-title">
          <h2>Tin Tức & Cẩm Nang</h2>
          <p>Chia sẻ những kiến thức về nông sản, mẹo nấu ăn và các xu hướng ẩm thực lành mạnh.</p>
        </div>
        
        {loading ? (
          <p style={{ textAlign: 'center' }}>Đang tải tin tức...</p>
        ) : (
          <div className="news-grid">
            {articles.map(article => (
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
            {articles.length === 0 && <p style={{ textAlign: 'center', gridColumn: 'span 3', color: '#999', padding: '40px' }}>Chưa có bài viết nào được đăng.</p>}
          </div>
        )}
      </section>
    </div>
  );
};

export default News;
