export interface User {
    id: string;
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    age: number;
}

export interface RegistrationUser {
    email: string;
    password: string;
    name: string;
    address: string;
    phoneNumber: string;
    age: number;
}

export interface HomeUser extends User {
    transactionCount?: number;
    Role?: string;
}