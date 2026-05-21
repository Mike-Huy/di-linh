const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const articles = [
    {
      title: 'Mẹo Chế Biến Mứt Rau Củ Không Bị Lại Đường',
      slug: 'meo-che-bien-mut-rau-cu',
      content: '<p>Mứt rau củ là món ăn truyền thống, nhưng làm sao để mứt luôn dẻo ngon mà không bị kết tinh đường? Hãy cùng khám phá bí quyết từ các nghệ nhân Di Linh.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1547512111-c7a745b45f93?auto=format&fit=crop&q=80&w=800',
      post_type: 'article',
      status: true
    },
    {
      title: 'Khám Phá Cà Phê Di Linh - Niềm Tự Hào Của Cao Nguyên',
      slug: 'kham-pha-ca-phe-di-linh',
      content: '<p>Bên cạnh mứt rau củ, cà phê Di Linh cũng là một thực phẩm tinh túy được cả thế giới công nhận. Tìm hiểu về hành trình từ hạt cà phê đến tách trà mứt buổi sáng.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
      post_type: 'article',
      status: true
    },
    {
      title: 'Tác Dụng Tuyệt Vời Của Mứt Củ Dền Đối Đối Với Sức Khỏe',
      slug: 'tac-dung-tuyet-voi-cua-mut-cu-den',
      content: '<p>Ít ai biết rằng mứt củ dền không chỉ ngon mà còn chứa hàm lượng sắt và vitamin cực cao. Cùng xem cách tận dụng loại củ này trong bữa ăn hàng ngày.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1522160916674-325d7d3d186b?auto=format&fit=crop&q=80&w=800',
      post_type: 'article',
      status: true
    }
];

async function insertArticles() {
  const { data, error } = await supabase
    .from('dilinh_posts')
    .insert(articles);
  
  if (error) console.error('Error inserting articles:', error);
  else console.log('Successfully inserted articles:', data);
}

insertArticles();
