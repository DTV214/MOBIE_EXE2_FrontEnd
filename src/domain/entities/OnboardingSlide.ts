// src/domain/entities/OnboardingSlide.ts
export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  illustration?: string; // URL hoặc local asset path
  icon?: string; // Icon name hoặc component
}
