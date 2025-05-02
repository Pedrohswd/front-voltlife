export interface User {
    id: any;
    name: string;
    email: string;
    phone: string;
    role?: 'USER'| 'ADMIN';
  }
  
  export interface UserRegistration {
    name: string;
    email: string;
    password: string;
    date: any;
    role: 'USER' | 'ADMIN';
  }