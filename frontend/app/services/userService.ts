import { ApiResponse, postRequest } from "./apiService";

interface CreateUser {
  username: string;
  password: string;
  email: string;
}

interface LoginUser {
  email: string;
  password: string;
}

interface UserToken {
  token: string;
}

export const createUser = async (
  payload: CreateUser
): Promise<ApiResponse<UserToken>> => {
  // API call to create user
  const response = await postRequest<UserToken, CreateUser>(
    "/registeruser",
    payload
  );
  return response;
};

export const loginUser = async (
  payload: LoginUser
): Promise<ApiResponse<UserToken>> => {
  // API call to login user
  const response = await postRequest<UserToken, LoginUser>("/login", payload);
  return response;
};
