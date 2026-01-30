// src/domain/enums/HealthEnums.ts

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ActivityLevel {
  NO_EXERCISE = 'NO_EXERCISE', // Ít vận động
  LIGHT_EXERCISE = 'LIGHT_EXERCISE', // Vận động nhẹ
  NORMAL_EXERCISE = 'NORMAL_EXERCISE', // Vận động vừa
  HIGH_EXERCISE = 'HIGH_EXERCISE', // Vận động nặng
  VERY_HIGH_EXERCISE = 'VERY_HIGH_EXERCISE', // Rất nặng
}

export enum HealthGoal {
  LOSE_WEIGHT = 'LOSE_WEIGHT', // Giảm cân
  MAINTAIN = 'MAINTAIN', // Giữ cân
  EXTREME_GAIN = 'EXTREME_GAIN', // Tăng cân
}
