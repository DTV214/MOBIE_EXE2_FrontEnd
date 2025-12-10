import { create } from 'twrnc';
// Bạn có thể thêm custom colors từ Figma vào đây
const tw = create({
  theme: {
    extend: {
      colors: {
        primary: '#4ADE80', // Màu xanh lá chủ đạo trong Figma
        secondary: '#22C55E',
        dark: '#1F2937',
        card: '#FFFFFF',
        background: '#F3F4F6',
      },
    },
  },
});

export default tw;
