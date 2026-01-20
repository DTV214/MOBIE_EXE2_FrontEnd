// src/utils/tailwind.ts
import { create } from 'twrnc';

const tw = create({
  theme: {
    extend: {
      colors: {
        // Bảng màu chính từ Figma - #7FB069
        primary: '#7FB069', // Màu xanh lá chính từ Figma
        primaryLight: '#E8F5E3', // Xanh lá nhạt cho nền
        primaryDark: '#6A9A5A', // Xanh lá đậm hơn
        brandDark: '#111827', // Màu đen cho text
        card: '#FFFFFF',
        background: '#F9FAFB', // Nền beige/cream nhạt
        backgroundGradient: '#F5F5F0', // Nền gradient beige
        textMain: '#111827',
        textSub: '#6B7280',
        softGray: '#F9FAFB',
        // Màu bổ sung cho onboarding
        cream: '#F5F5F0', // Màu cream từ design
        beige: '#FAFAF5', // Màu beige nhạt
      },
    },
  },
});

export default tw;
