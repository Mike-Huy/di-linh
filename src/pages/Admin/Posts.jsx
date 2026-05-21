import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import { Edit, Trash2, Plus, X, Search, MessageSquare, FileText, Upload, Image as ImageIcon, Loader } from 'lucide-react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('article'); 
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState([]);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    thumbnail: '',
    post_type: 'article',
    status: true
  });



  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('dilinh_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching posts:', error);
    else setPosts(data);
    setLoading(false);
  }

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug || '',
        content: post.content || '',
        thumbnail: post.thumbnail || '',
        post_type: post.post_type || 'article',
        status: post.status
      });
      setActiveType(post.post_type || 'article');
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        thumbnail: '',
        post_type: activeType,
        status: true
      });
    }
    setShowModal(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData({ ...formData, title, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, post_type: activeType };
    
    if (activeType === 'testimonial' && !payload.slug) {
      payload.slug = `testimonial-${Date.now()}`;
    }

    if (editingPost) {
      const { error } = await supabase
        .from('dilinh_posts')
        .update(payload)
        .eq('id', editingPost.id);
      if (error) {
        alert('Lỗi cập nhật: ' + error.message);
      } else {
        setShowModal(false);
        fetchPosts();
      }
    } else {
      const { error } = await supabase
        .from('dilinh_posts')
        .insert([payload]);
      if (error) {
        alert('Lỗi khi đăng: ' + error.message);
      } else {
        setShowModal(false);
        fetchPosts();
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      const { error } = await supabase
        .from('dilinh_posts')
        .delete()
        .eq('id', id);
      if (!error) fetchPosts();
    }
  };

  // --- UPLOAD LOGIC ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `post-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('dilinh')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dilinh')
        .getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail: publicUrl });
    } catch (error) {
      alert('Lỗi khi tải ảnh: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchLibraryImages = async () => {
    setShowLibrary(true);
    const { data, error } = await supabase.storage
      .from('dilinh')
      .list('', { limit: 100, sortBy: { column: 'name', order: 'desc' } });

    if (!error) {
      const imagesWithUrl = data.map(file => ({
        ...file,
        url: supabase.storage.from('dilinh').getPublicUrl(file.name).data.publicUrl
      }));
      setLibraryImages(imagesWithUrl);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.post_type === activeType && 
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', background: '#f0f0f0', padding: '5px', borderRadius: '12px' }}>
          <button 
            className={`admin-btn ${activeType === 'article' ? 'admin-btn-primary' : ''}`}
            style={{ borderRadius: '8px', padding: '10px 25px', color: activeType === 'article' ? 'white' : '#666', background: activeType === 'article' ? 'var(--primary-color)' : 'transparent' }}
            onClick={() => setActiveType('article')}
          >
            <FileText size={18} style={{ marginRight: '8px' }} /> Bài viết & Tin tức
          </button>
          <button 
            className={`admin-btn ${activeType === 'testimonial' ? 'admin-btn-primary' : ''}`}
            style={{ borderRadius: '8px', padding: '10px 25px', color: activeType === 'testimonial' ? 'white' : '#666', background: activeType === 'testimonial' ? 'var(--primary-color)' : 'transparent' }}
            onClick={() => setActiveType('testimonial')}
          >
            <MessageSquare size={18} style={{ marginRight: '8px' }} /> Ý kiến khách hàng
          </button>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          {activeType === 'article' ? 'Đăng bài mới' : 'Thêm ý kiến mới'}
        </button>
      </div>

      <div className="admin-card">
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} size={18} />
          <input 
            type="text" 
            className="admin-input" 
            placeholder={activeType === 'article' ? "Tìm kiếm theo tiêu đề..." : "Tìm kiếm tên khách hàng..."}
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>{activeType === 'article' ? 'Tiêu đề' : 'Tên khách hàng'}</th>
                {activeType === 'article' && <th>Loại</th>}
                {activeType === 'testimonial' && <th>Ý kiến</th>}
                <th>Ngày đăng</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(p => (
                <tr key={p.id}>
                  <td>
                    <img src={p.thumbnail || `https://api.dicebear.com/7.x/initials/svg?seed=${p.title}`} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td>{p.title}</td>
                  {activeType === 'article' && <td><span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{p.post_type}</span></td>}
                  {activeType === 'testimonial' && <td><div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.content}</div></td>}
                  <td>{new Date(p.created_at).toLocaleDateString('vi-VN')}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="admin-btn-outline" style={{ padding: '6px', marginRight: '8px' }} onClick={() => handleOpenModal(p)}>
                      <Edit size={16} />
                    </button>
                    <button className="admin-btn-outline" style={{ padding: '6px', borderColor: '#ff4d4f', color: '#ff4d4f' }} onClick={() => handleDelete(p.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Chưa có gì để hiển thị.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: activeType === 'article' ? '1000px' : '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>{editingPost ? 'Chỉnh sửa' : 'Thêm mới'} {activeType === 'article' ? 'bài viết' : 'ý kiến khách hàng'}</h2>
              <button className="admin-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>{activeType === 'article' ? 'Tiêu đề' : 'Tên khách hàng'}</label>
                <input 
                  type="text" className="admin-input" required
                  value={formData.title}
                  onChange={activeType === 'article' ? handleTitleChange : (e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              {activeType === 'article' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="admin-form-group">
                    <label>Đường dẫn (Slug)</label>
                    <input 
                      type="text" className="admin-input" required readOnly
                      value={formData.slug}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Loại bài viết</label>
                    <select 
                      className="admin-select"
                      value={formData.post_type}
                      onChange={(e) => setFormData({...formData, post_type: e.target.value})}
                    >
                      <option value="article">Tin tức</option>
                      <option value="event">Sự kiện</option>
                      <option value="promotion">Khuyến mãi</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="admin-form-group">
                <label>{activeType === 'article' ? 'Ảnh bìa' : 'Ảnh chân dung khách hàng'}</label>
                
                {formData.thumbnail ? (
                  /* Trạng thái 1: Đã có ảnh - hiển thị preview kèm nút thay đổi */
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    border: '1.5px solid rgba(139, 90, 43, 0.15)',
                    borderRadius: '12px',
                    padding: '15px',
                    backgroundColor: '#FCFAF7'
                  }}>
                    <img 
                      src={formData.thumbnail} 
                      alt="Preview" 
                      style={{ 
                        width: '120px', 
                        height: '75px', 
                        objectFit: 'cover', 
                        borderRadius: '8px', 
                        border: '2px solid var(--accent-color)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary-color)', marginBottom: '4px' }}>
                        Hình ảnh đã được tải lên
                      </div>
                      <div style={{ fontSize: '11px', color: '#777', marginBottom: '12px' }}>
                        Đã tự động tối ưu và lưu vào bộ nhớ đám mây của đặc sản Di Linh.
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          type="button" 
                          className="admin-btn admin-btn-outline" 
                          onClick={fetchLibraryImages}
                          style={{ padding: '6px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '50px' }}
                        >
                          <ImageIcon size={14} /> Chọn từ kho ảnh
                        </button>
                        <button 
                          type="button" 
                          className="admin-btn admin-btn-primary" 
                          onClick={() => fileInputRef.current.click()}
                          disabled={uploading}
                          style={{ padding: '6px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '50px' }}
                        >
                          {uploading ? <Loader className="spin" size={14} /> : <Upload size={14} />}
                          Tải ảnh mới
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Trạng thái 2: Chưa có ảnh - hiển thị Dropzone rỗng tinh tế */
                  <div style={{ 
                    border: '2.5px dashed rgba(139, 90, 43, 0.25)',
                    borderRadius: '12px',
                    padding: '30px 20px',
                    textAlign: 'center',
                    backgroundColor: '#FCFAF7',
                    transition: 'var(--transition-smooth)'
                  }}>
                    <div style={{ color: '#888', marginBottom: '15px', fontSize: '13px' }}>
                      {activeType === 'article' ? 'Chưa có ảnh bìa bài viết. Chọn từ kho hoặc tải tệp mới lên.' : 'Chưa có ảnh chân dung khách hàng.'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      <button 
                        type="button" 
                        className="admin-btn admin-btn-outline" 
                        onClick={fetchLibraryImages}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '50px' }}
                      >
                        <ImageIcon size={15} /> Chọn từ kho ảnh
                      </button>
                      <button 
                        type="button" 
                        className="admin-btn admin-btn-primary" 
                        onClick={() => fileInputRef.current.click()}
                        disabled={uploading}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '50px' }}
                      >
                        {uploading ? <Loader className="spin" size={15} /> : <Upload size={15} />}
                        Tải ảnh từ máy tính
                      </button>
                    </div>
                  </div>
                )}

                <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
              </div>

              <div className="admin-form-group">
                <label>{activeType === 'article' ? 'Nội dung chi tiết' : 'Nội dung ý kiến'}</label>
                <textarea 
                  className="admin-textarea" 
                  style={{ height: activeType === 'article' ? '250px' : '120px' }}
                  required
                  placeholder={activeType === 'article' ? "Viết nội dung bài viết ở đây (Hỗ trợ định dạng văn bản thường và mã HTML)..." : "Nhập ý kiến nhận xét của khách hàng..."}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>
              
              <div style={{ marginTop: activeType === 'article' ? '50px' : '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.checked})}
                    id="postStatus"
                  />
                  <label htmlFor="postStatus" style={{ marginBottom: 0 }}>Công khai</label>
                </div>
                <div>
                  <button type="button" className="admin-btn admin-btn-outline" style={{ marginRight: '10px' }} onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="admin-btn admin-btn-primary">Lưu thay đổi</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLibrary && (
        <div className="admin-modal-overlay" style={{ zIndex: 3000 }}>
          <div className="admin-modal" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Thư viện hình ảnh</h2>
              <button className="admin-btn" onClick={() => setShowLibrary(false)}><X size={24} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px', maxHeight: '500px', overflowY: 'auto' }}>
              {libraryImages.map((img, idx) => (
                <div key={idx} style={{ cursor: 'pointer' }} onClick={() => { setFormData({...formData, thumbnail: img.url}); setShowLibrary(false); }}>
                  <img src={img.url} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
