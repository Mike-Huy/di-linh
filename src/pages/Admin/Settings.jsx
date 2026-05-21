import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import { Save, Building, Phone, Mail, Instagram, MessageCircle, Plus, Trash2, Image as ImageIcon, Upload, Loader, X } from 'lucide-react';

export default function Settings() {
  const [config, setConfig] = useState({
    company_name: 'Đặc Sản Di Linh',
    phone: '0901 234 567',
    zalo: '0901 234 567',
    email: 'contact@dilinhgift.vn',
    address: '123 Đường 25/5, TT. Di Linh, Lâm Đồng',
    facebook: 'https://fb.com/dilinhgift',
    instagram: 'https://instagram.com/dilinhgift',
    partners: []
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState([]);
  const [activePartnerIndex, setActivePartnerIndex] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    setLoading(true);
    const { data } = await supabase
      .from('dilinh_app_settings')
      .select('*')
      .eq('key', 'site_config')
      .single();
    
    if (data && data.value) {
      const { company_info, partners } = data.value;
      setConfig({ 
        ...config, 
        ...(company_info || {}), 
        partners: partners || [] 
      });
    }
    setLoading(false);
  }

  async function handleSave() {
    setLoading(true);
    const { data: currentData } = await supabase
      .from('dilinh_app_settings')
      .select('value')
      .eq('key', 'site_config')
      .single();
    
    const { partners, ...company_info } = config;
    const newValue = { 
      ...(currentData?.value || {}), 
      company_info, 
      partners 
    };
    
    const { error } = await supabase
      .from('dilinh_app_settings')
      .upsert({ 
        key: 'site_config', 
        value: newValue,
        description: 'Thông tin công ty và đối tác'
      }, { onConflict: 'key' });
    
    if (error) alert('Lỗi khi lưu: ' + error.message);
    else alert('Đã cập nhật thông tin thành công!');
    setLoading(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const addPartner = () => {
    setConfig({
      ...config,
      partners: [...config.partners, { name: '', logo: '' }]
    });
  };

  const removePartner = (index) => {
    const newPartners = config.partners.filter((_, i) => i !== index);
    setConfig({ ...config, partners: newPartners });
  };

  const updatePartner = (index, field, value) => {
    const newPartners = config.partners.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    );
    setConfig({ ...config, partners: newPartners });
  };

  // --- UPLOAD LOGIC ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || activePartnerIndex === null) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `partner-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('dilinh')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dilinh')
        .getPublicUrl(filePath);

      updatePartner(activePartnerIndex, 'logo', publicUrl);
    } catch (error) {
      alert('Lỗi khi tải ảnh: ' + error.message);
    } finally {
      setUploading(false);
      setActivePartnerIndex(null);
    }
  };

  const fetchLibraryImages = async (index) => {
    setActivePartnerIndex(index);
    setShowLibrary(true);
    const { data, error } = await supabase.storage
      .from('dilinh')
      .list('', { limit: 100, sortBy: { column: 'name', order: 'desc' } });

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
    updatePartner(activePartnerIndex, 'logo', url);
    setShowLibrary(false);
    setActivePartnerIndex(null);
  };

  return (
    <div style={{ paddingBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>Cài đặt chung</h1>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={loading || uploading}>
          <Save size={18} style={{ marginRight: '8px' }} />
          Lưu tất cả thay đổi
        </button>
      </div>

      <div className="admin-card">
        <h2 style={{ marginBottom: '20px' }}>Thông tin cơ bản</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="admin-form-group">
            <label><Building size={16} /> Tên cửa hàng</label>
            <input type="text" name="company_name" className="admin-input" value={config.company_name} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label><Phone size={16} /> Số điện thoại</label>
            <input type="text" name="phone" className="admin-input" value={config.phone} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label><MessageCircle size={16} /> Zalo</label>
            <input type="text" name="zalo" className="admin-input" value={config.zalo} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label><Mail size={16} /> Email liên hệ</label>
            <input type="email" name="email" className="admin-input" value={config.email} onChange={handleChange} />
          </div>
          <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
            <label>Địa chỉ cửa hàng</label>
            <input type="text" name="address" className="admin-input" value={config.address} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Quản lý Đối tác</h2>
          <button className="admin-btn-outline" onClick={addPartner}>
            <Plus size={16} style={{ marginRight: '5px' }} /> Thêm đối tác
          </button>
        </div>
        
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
          {config.partners.map((partner, index) => (
            <div key={index} style={{ 
              display: 'grid', 
              gridTemplateColumns: '50px 180px 1fr auto', 
              gap: '12px', 
              alignItems: 'center',
              padding: '12px',
              background: '#f9f9f9',
              borderRadius: '8px',
              border: '1px solid #eee'
            }}>
              <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
                {partner.logo ? <img src={partner.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><ImageIcon size={20} color="#ccc" /></div>}
              </div>
              <input 
                type="text" 
                placeholder="Tên đối tác" 
                className="admin-input" 
                style={{ padding: '8px 12px' }}
                value={partner.name} 
                onChange={(e) => updatePartner(index, 'name', e.target.value)} 
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Link Logo (URL)" 
                  className="admin-input" 
                  style={{ padding: '8px 12px', flex: 1 }}
                  value={partner.logo} 
                  onChange={(e) => updatePartner(index, 'logo', e.target.value)} 
                />
                <button 
                  type="button" 
                  className="admin-btn-outline" 
                  onClick={() => fetchLibraryImages(index)}
                  title="Kho ảnh"
                  style={{ padding: '8px' }}
                >
                  <ImageIcon size={16} />
                </button>
                <button 
                  type="button" 
                  className="admin-btn-primary" 
                  onClick={() => { setActivePartnerIndex(index); fileInputRef.current.click(); }}
                  disabled={uploading}
                  title="Tải lên"
                  style={{ padding: '8px' }}
                >
                  {uploading && activePartnerIndex === index ? <Loader className="spin" size={16} /> : <Upload size={16} />}
                </button>
              </div>
              <button className="admin-btn-outline" style={{ padding: '8px', borderColor: '#ff4d4f', color: '#ff4d4f' }} onClick={() => removePartner(index)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {config.partners.length === 0 && <p style={{ color: '#999', textAlign: 'center' }}>Chưa có đối tác nào.</p>}
          
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
             <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={loading}>
                <Save size={18} style={{ marginRight: '8px' }} /> Lưu danh sách đối tác
             </button>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Mạng xã hội</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="admin-form-group">
            <label>Link Facebook</label>
            <input type="text" name="facebook" className="admin-input" value={config.facebook} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label><Instagram size={16} /> Link Instagram</label>
            <input type="text" name="instagram" className="admin-input" value={config.instagram} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* --- STORAGE LIBRARY MODAL --- */}
      {showLibrary && (
        <div className="admin-modal-overlay" style={{ zIndex: 3000 }}>
          <div className="admin-modal" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Thư viện hình ảnh</h2>
              <button className="admin-btn" onClick={() => setShowLibrary(false)}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', maxHeight: '500px', overflowY: 'auto', padding: '10px' }}>
              {libraryImages.map((img, idx) => (
                <div 
                  key={idx} 
                  style={{ cursor: 'pointer', border: '2px solid transparent', borderRadius: '8px', overflow: 'hidden' }}
                  onClick={() => selectLibraryImage(img.url)}
                >
                  <img src={img.url} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
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
