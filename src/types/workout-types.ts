export const GOAL_TYPES = {
    WEIGHT_LOSS: 'Weight Loss',
    MUSCLE_GAIN: 'Muscle Gain',
    ENDURANCE: 'Endurance',
    FLEXIBILITY: 'Flexibility',
    BALANCE: 'Balance'
} as const;

export const INTENSITY_LEVELS = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced'
} as const;

export type GoalType = typeof GOAL_TYPES[keyof typeof GOAL_TYPES];
export type IntensityLevel = typeof INTENSITY_LEVELS[keyof typeof INTENSITY_LEVELS];