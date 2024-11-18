
// user type
export interface UserType {
    id: number;
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

