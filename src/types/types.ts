
// user type
export interface UserType {
    id: string;
    firstName: string;
    lastName: string;
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

