import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import { Edit, Trash2, Plus, X, Search, Upload, Image, Loader } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    product_code: '',
    product_long: '',
    sale_price: 0,
    promo_price: 0,
    image: '',
    status: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('dilinh_product')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) console.error('Error fetching products:', error);
    else setProducts(data);
    setLoading(false);
  }

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        product_code: product.product_code,
        product_long: product.product_long,
        sale_price: product.sale_price,
        promo_price: product.promo_price || 0,
        image: product.image || '',
        status: product.status
      });
    } else {
      setEditingProduct(null);
      setFormData({
        product_code: '',
        product_long: '',
        sale_price: 0,
        promo_price: 0,
        image: '',
        status: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    
    if (editingProduct) {
      const { error } = await supabase
        .from('dilinh_product')
        .update(payload)
        .eq('id', editingProduct.id);
      if (!error) {
        setShowModal(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase
        .from('dilinh_product')
        .insert([payload]);
      if (!error) {
        setShowModal(false);
        fetchProducts();
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      const { error } = await supabase
        .from('dilinh_product')
        .delete()
        .eq('id', id);
      if (!error) fetchProducts();
    }
  };

  // --- STORAGE LOGIC ---

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('dilinh')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dilinh')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image: publicUrl });
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
      .list('', { limit: 100, offset: 0, sortBy: { column: 'name', order: 'desc' } });

    if (error) {
      console.error('Error fetching library:', error);
    } else {
      const imagesWithUrl = data.map(file => ({
        ...file,
        url: supabase.storage.from('dilinh').getPublicUrl(file.name).data.publicUrl
      }));
      setLibraryImages(imagesWithUrl);
    }
  };

  const selectLibraryImage = (url) => {
    setFormData({ ...formData, image: url });
    setShowLibrary(false);
  };

  const filteredProducts = products.filter(p => 
    (p.product_long || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.product_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Quản lý sản phẩm</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Thêm sản phẩm
        </button>
      </div>

      <div className="admin-card">
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} size={18} />
          <input 
            type="text" 
            className="admin-input" 
            placeholder="Tìm kiếm theo tên hoặc mã SP..." 
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
                <th>Hình ảnh</th>
                <th>Mã SP</th>
                <th>Tên sản phẩm</th>
                <th>Giá thường</th>
                <th>Giá KM</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td>{p.product_code}</td>
                  <td>{p.product_long}</td>
                  <td>{(p.sale_price || 0).toLocaleString()}đ</td>
                  <td style={{ color: '#E91E63' }}>{p.promo_price ? p.promo_price.toLocaleString() + 'đ' : '-'}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      backgroundColor: p.status ? '#E8F5E9' : '#FFEBEE',
                      color: p.status ? '#2E7D32' : '#C62828'
                    }}>
                      {p.status ? 'Đang bán' : 'Tạm ngưng'}
                    </span>
                  </td>
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
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button className="admin-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-form-group">
                  <label>Mã sản phẩm</label>
                  <input 
                    type="text" className="admin-input" required
                    value={formData.product_code}
                    onChange={(e) => setFormData({...formData, product_code: e.target.value})}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Tên sản phẩm</label>
                  <input 
                    type="text" className="admin-input" required
                    value={formData.product_long}
                    onChange={(e) => setFormData({...formData, product_long: e.target.value})}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Giá thường (đ)</label>
                  <input 
                    type="number" className="admin-input" required
                    value={formData.sale_price}
                    onChange={(e) => setFormData({...formData, sale_price: Number(e.target.value)})}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Giá KM (đ - để 0 nếu không có)</label>
                  <input 
                    type="number" className="admin-input"
                    value={formData.promo_price}
                    onChange={(e) => setFormData({...formData, promo_price: Number(e.target.value)})}
                  />
                </div>
                
                <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Hình ảnh sản phẩm</label>
                  
                  {formData.image ? (
                    /* Trạng thái 1: Đã có ảnh sản phẩm - hiển thị preview kèm nút thay đổi */
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
                        src={formData.image} 
                        alt="Preview" 
                        style={{ 
                          width: '90px', 
                          height: '90px', 
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
                            <Image size={14} /> Chọn từ kho ảnh
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
                    /* Trạng thái 2: Chưa có ảnh sản phẩm - hiển thị Dropzone rỗng tinh tế */
                    <div style={{ 
                      border: '2.5px dashed rgba(139, 90, 43, 0.25)',
                      borderRadius: '12px',
                      padding: '30px 20px',
                      textAlign: 'center',
                      backgroundColor: '#FCFAF7',
                      transition: 'var(--transition-smooth)'
                    }}>
                      <div style={{ color: '#888', marginBottom: '15px', fontSize: '13px' }}>
                        Chưa có hình ảnh sản phẩm. Chọn ảnh từ kho hoặc tải lên tệp mới.
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <button 
                          type="button" 
                          className="admin-btn admin-btn-outline" 
                          onClick={fetchLibraryImages}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '50px' }}
                        >
                          <Image size={15} /> Chọn từ kho ảnh
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

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Trạng thái</label>
                  <select 
                    className="admin-select"
                    value={formData.status ? 'true' : 'false'}
                    onChange={(e) => setFormData({...formData, status: e.target.value === 'true'})}
                  >
                    <option value="true">Đang bán</option>
                    <option value="false">Tạm ngưng</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginTop: '30px', textAlign: 'right' }}>
                <button type="button" className="admin-btn admin-btn-outline" style={{ marginRight: '10px' }} onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={uploading}>Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- STORAGE LIBRARY MODAL --- */}
      {showLibrary && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Thư viện hình ảnh</h2>
              <button className="admin-btn" onClick={() => setShowLibrary(false)}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', maxHeight: '500px', overflowY: 'auto', padding: '10px' }}>
              {libraryImages.length === 0 ? (
                <p>Chưa có ảnh nào trong thư viện.</p>
              ) : (
                libraryImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    style={{ cursor: 'pointer', border: '2px solid transparent', borderRadius: '8px', overflow: 'hidden', transition: 'all 0.2s' }}
                    onClick={() => selectLibraryImage(img.url)}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#2E7D32'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                  </div>
                ))
              )}
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button className="admin-btn admin-btn-outline" onClick={() => setShowLibrary(false)}>Đóng</button>
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
