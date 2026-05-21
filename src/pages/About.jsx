import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero" style={{ 
        background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1596701062351-be5f6a45546b?auto=format&fit=crop&q=80&w=1600")',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '4.5rem' }}>Đặc Sản Nông Sản Di Linh</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: '300' }}>Hương vị từ vùng đất bazan màu mỡ</p>
        </div>
      </section>

      <section className="container about-content" style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '40px', color: 'var(--primary-color)' }}>Vùng Đất Di Linh - Nơi Giao Thoa Giữa Đất Và Trời</h2>
          
          <div style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#444' }}>
            <p style={{ marginBottom: '30px' }}>
              Nằm trên cao nguyên Di Linh với độ cao trung bình 1.000m so với mực nước biển, huyện Di Linh, tỉnh Lâm Đồng không chỉ nổi tiếng với những đồi cà phê bạt ngàn mà còn là xứ sở của các loại nông sản sạch, đạt chất lượng xuất khẩu. Với khí hậu ôn hòa quanh năm và thổ nhưỡng đất đỏ bazan màu mỡ, nơi đây đã tạo nên những loại rau củ có hương vị đặc trưng, giòn ngọt và giàu dinh dưỡng.
            </p>

            <h3 style={{ fontSize: '2rem', marginTop: '60px', marginBottom: '25px', color: 'var(--secondary-color)' }}>Hành Trình Của Những Loại Rau Củ "Sạch"</h3>
            <p style={{ marginBottom: '30px' }}>
              Mỗi sản phẩm mứt rau củ của chúng tôi đều bắt đầu từ những luống rau được canh tác theo phương pháp hữu cơ tại các nhà vườn ở Di Linh. Chúng tôi chọn lọc những củ cà rốt cam rực, những củ dền tím thẫm hay những củ khoai lang vàng óng khi chúng căng mọng nhất. 
            </p>

            <blockquote style={{ 
              borderLeft: '5px solid #C19A6B', 
              padding: '30px 40px', 
              margin: '50px 0', 
              background: 'var(--bg-color)',
              fontStyle: 'italic',
              fontSize: '1.4rem'
            }}>
              "Chúng tôi không chỉ bán mứt, chúng tôi kể câu chuyện về sự cần cù của người nông dân và sự tinh túy của đất trời Lâm Đồng."
            </blockquote>

            <h3 style={{ fontSize: '2rem', marginTop: '60px', marginBottom: '25px', color: 'var(--secondary-color)' }}>Công Nghệ Sấy Lạnh Tiên Tiến</h3>
            <p style={{ marginBottom: '30px' }}>
              Để giữ lại trọn vẹn giá trị dinh dưỡng và màu sắc tự nhiên mà không cần đến phẩm màu hay chất bảo quản, chúng tôi ứng dụng công nghệ sấy lạnh (Freeze Drying). Quy trình này giúp mứt giữ được độ dẻo, vị ngọt thanh tự nhiên và đặc biệt là hàm lượng vitamin gần như nguyên vẹn.
            </p>

            <p>
              Đến với Bánh Mứt Di Linh, bạn không chỉ được thưởng thức một món ăn nhẹ thơm ngon mà còn đang cảm nhận được tâm huyết và tình yêu của chúng tôi đối với nông sản Việt Nam.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
