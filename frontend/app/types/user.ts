export interface CreateUser {
  name: string;
  password: string;
  email: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface UserResponseData {
  id: string;
  name: string;
  email: string;
  bio: string;
}