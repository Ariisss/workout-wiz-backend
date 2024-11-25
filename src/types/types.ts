import { Request } from 'express';
import { GoalType, IntensityLevel } from './workout-types';

// user type
export interface UserType {
    user_id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    sex: string;
    age: number;
    height: number;
    weight: number;
    createdAt: Date;
    updatedAt: Date;
}

// for user reg
export interface UserRegisterType extends Omit<UserType, 'id' | 'createdAt' | 'updatedAt'> {}

export interface JwtPayload {
  id: number;
  email: string;
  username: string;
}

export interface UserLoginType {
  email: string;
  password: string;
}

// export interface AuthenticatedRequest extends Request {
//   user: JwtPayload;
// } 

// workout preference types
export interface WorkoutPreferenceType {
  preference_id: number;
  user_id: number;
  goal_type: GoalType;
  with_gym: boolean;
  workout_days: string;
  intensity: IntensityLevel;
}   

export interface WorkoutPlanType {
  plan_id: number;
  user_id: number;
  plan_name: string;
  description: string;
  goal: GoalType;
  duration_weeks: number;
  workout_days: string;
  intensity: IntensityLevel;
}

export interface PlanExerciseType {
  plan_exercise_id: number;
  plan_id: number;
  exercise_name: string;
  description: string;
  sets: number;
  reps: number;
  workout_day: string;
  met_value: number;
}

