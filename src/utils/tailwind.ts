// src/utils/tailwind.ts
import { create } from 'twrnc';

const tw = create({
  theme: {
    extend: {
      colors: {
        primary: '#22C55E', // Xanh lá đậm (Secondary trong file cũ)
        primaryLight: '#DCFCE7', // Xanh lá nhạt cho nền thẻ
        brandDark: '#111827', // Màu đen cho banner AI
        card: '#FFFFFF',
        background: '#F3F4F6',
        textMain: '#111827',
        textSub: '#6B7280',
        softGray: '#F9FAFB', // Màu nền app
      },
    },
  },
});

export default tw;
