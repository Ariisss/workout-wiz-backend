import { Request } from 'express';

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

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
} 
