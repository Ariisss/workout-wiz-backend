import { Request } from 'express';
import { GoalType, IntensityLevel } from './workout-types';

// user type
export interface UserType {
    user_id: number;
    username: string;
    email: string;
    password: string;
    sex: Boolean;
    dob: string,
    height: number;
    weight: number;
    weeklyStreak: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface WeeklyProgress {
  assignedExercises: { [key: string]: number[] };
  completedExercises: { [key: string]: number[] };
  isWeekComplete: boolean;
}

// for user reg
export interface UserRegisterType{
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  email: string;
}

export interface UserLoginType {
  email: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
} 

// workout preference types
export interface WorkoutPreferenceType {
  preference_id: number;
  user_id: number;
  goal_type: string;
  with_gym: boolean;
  workout_days: string;
  intensity: IntensityLevel;
}   

export interface CreateWorkoutPreferenceType extends Omit<WorkoutPreferenceType, 'preference_id'> {}

export interface WorkoutPlanType {
  plan_id: number;
  user_id: number;
  plan_name: string;
  description: string;
  goal: GoalType[];
  duration_weeks: number;
  workout_days: string;
  intensity: IntensityLevel;
}

export interface PlanExerciseResponseType {
  plan_id: number;
  exercise_name: string;
  description: string;
  sets: number;
  reps: number;
  duration_mins: number;
  workout_day: string;
  met_value: number;
}

export interface PlanExerciseType {
  plan_exercise_id: number;
  plan_id: number;
  exercise_name: string;
  description: string;
  sets: number;
  reps: number;
  duration_mins: number;
  workout_day: string;
  met_value: number;
}

export interface ExerciseLogType {
  log_id: number;
  exercise_name: string;
  user_id: number;
  plan_exercise_id: number;
  date: Date;
  duration_mins: number;
  calories_burned: number;
}

export interface PlanIdType {
  plan_id: number;
}
