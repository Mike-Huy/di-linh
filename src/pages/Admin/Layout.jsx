import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import { Save, MoveUp, MoveDown, Layout as LayoutIcon, Menu as MenuIcon, Video, Upload, Image as ImageIcon, Loader, X, Link as LinkIcon, Play } from 'lucide-react';

export default function Layout() {
  const [config, setConfig] = useState({
    home_sections: [
      { id: 'hero', name: 'Banner chính', visible: true, media_url: '/qc.mp4', media_type: 'video' },
      { id: 'featured', name: 'Sản phẩm nổi bật', visible: true },
      { id: 'process', name: 'Quy trình sản xuất', visible: true },
      { id: 'testimonials', name: 'Khách hàng nói gì', visible: true },
      { id: 'partners', name: 'Đối tác', visible: true }
    ],
    menu: [
      { id: 'home', name: 'Trang chủ', path: '/' },
      { id: 'about', name: 'Giới thiệu', path: '/gioi-thieu' },
      { id: 'products', name: 'Sản phẩm', path: '/san-pham' },
      { id: 'news', name: 'Tin tức', path: '/tin-tuc' },
      { id: 'contact', name: 'Liên hệ', path: '/lien-he' }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState([]);
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
      // Ensure default hero values if missing
      const sections = data.value.home_sections.map(s => 
        s.id === 'hero' ? { media_url: '/qc.mp4', media_type: 'video', ...s } : s
      );
      setConfig({ ...data.value, home_sections: sections });
    }
    setLoading(false);
  }

  async function handleSave() {
    setLoading(true);
    const { error } = await supabase
      .from('dilinh_app_settings')
      .upsert({ 
        key: 'site_config', 
        value: config,
        description: 'Cấu hình giao diện, menu và media'
      }, { onConflict: 'key' });
    
    if (error) alert('Lỗi khi lưu: ' + error.message);
    else alert('Đã lưu cấu hình thành công!');
    setLoading(false);
  }

  const updateHeroMedia = (field, value) => {
    const newSections = config.home_sections.map(s => 
      s.id === 'hero' ? { ...s, [field]: value } : s
    );
    setConfig({ ...config, home_sections: newSections });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('dilinh')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dilinh')
        .getPublicUrl(filePath);

      updateHeroMedia('media_url', publicUrl);
      updateHeroMedia('media_type', file.type.startsWith('video') ? 'video' : 'image');
    } catch (error) {
      alert('Lỗi khi tải: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchLibrary = async () => {
    setShowLibrary(true);
    const { data, error } = await supabase.storage
      .from('dilinh')
      .list('', { limit: 100, sortBy: { column: 'name', order: 'desc' } });

    if (!error) {
      const filesWithUrl = data.map(file => ({
        ...file,
        url: supabase.storage.from('dilinh').getPublicUrl(file.name).data.publicUrl
      }));
      setLibraryFiles(filesWithUrl);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>Bố cục & Giao diện</h1>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={loading || uploading}>
          <Save size={18} style={{ marginRight: '8px' }} />
          Lưu cấu hình
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Video size={20} color="var(--primary-color)" />
          <h2 style={{ marginBottom: 0 }}>Video / Hình ảnh Banner chính</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <div className="admin-form-group">
              <label>Link Video / Hình ảnh (URL)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={config.home_sections.find(s => s.id === 'hero')?.media_url || ''}
                  onChange={(e) => updateHeroMedia('media_url', e.target.value)}
                  placeholder="Dán link mp4 hoặc link ảnh..."
                />
                <button 
                  type="button"
                  className="admin-btn admin-btn-outline" 
                  onClick={fetchLibrary} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', padding: '6px 15px', borderRadius: '50px' }}
                  title="Duyệt file"
                >
                  <ImageIcon size={15} /> Thư viện
                </button>
                <button 
                  type="button"
                  className="admin-btn admin-btn-primary" 
                  onClick={() => fileInputRef.current.click()} 
                  disabled={uploading}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', padding: '6px 15px', borderRadius: '50px' }}
                >
                  {uploading ? <Loader className="spin" size={15} /> : <Upload size={15} />} 
                  Tải lên
                </button>
              </div>
            </div>
            
            <div className="admin-form-group">
              <label>Loại nội dung</label>
              <select 
                className="admin-select"
                value={config.home_sections.find(s => s.id === 'hero')?.media_type || 'video'}
                onChange={(e) => updateHeroMedia('media_type', e.target.value)}
              >
                <option value="video">Video (liên tục - Background)</option>
                <option value="image">Hình ảnh cố định</option>
              </select>
            </div>
            <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="video/*,image/*" />
          </div>

          <div style={{ background: '#f0f0f0', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', height: '200px', border: '2px dashed #ccc' }}>
            {config.home_sections.find(s => s.id === 'hero')?.media_type === 'video' ? (
              <video src={config.home_sections.find(s => s.id === 'hero')?.media_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop />
            ) : (
              <img src={config.home_sections.find(s => s.id === 'hero')?.media_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <LayoutIcon size={20} />
            <h2 style={{ marginBottom: 0 }}>Thứ tự & Hiển thị trang chủ</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {config.home_sections.map((section, idx) => (
              <div key={section.id} className="admin-item-row" style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 12px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={section.visible} onChange={() => {
                    const newS = [...config.home_sections];
                    newS[idx].visible = !newS[idx].visible;
                    setConfig({...config, home_sections: newS});
                  }} />
                  <span style={{ fontWeight: 600 }}>{section.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button className="admin-btn-outline" style={{ padding: '4px' }} onClick={() => {
                    const newS = [...config.home_sections];
                    if (idx > 0) [newS[idx], newS[idx-1]] = [newS[idx-1], newS[idx]];
                    setConfig({...config, home_sections: newS});
                  }} disabled={idx === 0}><MoveUp size={16} /></button>
                  <button className="admin-btn-outline" style={{ padding: '4px' }} onClick={() => {
                    const newS = [...config.home_sections];
                    if (idx < newS.length-1) [newS[idx], newS[idx+1]] = [newS[idx+1], newS[idx]];
                    setConfig({...config, home_sections: newS});
                  }} disabled={idx === config.home_sections.length-1}><MoveDown size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <MenuIcon size={20} />
            <h2 style={{ marginBottom: 0 }}>Menu chính</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {config.menu.map((item, idx) => (
              <div key={item.id} className="admin-item-row" style={{ 
                padding: '6px 12px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{item.path}</div>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button className="admin-btn-outline" style={{ padding: '4px' }} onClick={() => {
                    const newM = [...config.menu];
                    if (idx > 0) [newM[idx], newM[idx-1]] = [newM[idx-1], newM[idx]];
                    setConfig({...config, menu: newM});
                  }} disabled={idx === 0}><MoveUp size={16} /></button>
                  <button className="admin-btn-outline" style={{ padding: '4px' }} onClick={() => {
                    const newM = [...config.menu];
                    if (idx < newM.length-1) [newM[idx], newM[idx+1]] = [newM[idx+1], newM[idx]];
                    setConfig({...config, menu: newM});
                  }} disabled={idx === config.menu.length-1}><MoveDown size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLibrary && (
        <div className="admin-modal-overlay" style={{ zIndex: 3000 }}>
          <div className="admin-modal" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Thư viện file</h2>
              <button className="admin-btn" onClick={() => setShowLibrary(false)}><X size={24} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', maxHeight: '500px', overflowY: 'auto' }}>
              {libraryFiles.map((file, idx) => (
                <div key={idx} style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => {
                  updateHeroMedia('media_url', file.url);
                  updateHeroMedia('media_type', file.name.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image');
                  setShowLibrary(false);
                }}>
                  <div style={{ height: '100px', background: '#eee', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {file.name.match(/\.(mp4|webm|ogg)$/i) ? <Play size={30} color="#666" /> : <img src={file.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ fontSize: '10px', marginTop: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
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
