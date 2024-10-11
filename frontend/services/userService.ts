import {
  CreateUser,
  LoginUser,
  TokenResponse,
  UserResponseData,
} from "../types/user";
import { ApiResponse, getRequest, postRequest } from "./apiService";

export const createUser = async (
  payload: CreateUser
): Promise<ApiResponse<TokenResponse>> => {
  // API call to create user
  const response = await postRequest<TokenResponse, CreateUser>(
    "/registeruser",
    payload
  );
  return response;
};

export const loginUser = async (
  payload: LoginUser
): Promise<ApiResponse<TokenResponse>> => {
  // API call to login user
  const response = await postRequest<TokenResponse, LoginUser>(
    "/login",
    payload
  );
  return response;
};

export const getLogdinUser = async (): Promise<ApiResponse<UserResponseData>> => {
  const response = await getRequest<UserResponseData>("/user/me");
  return response;
};
export const getUserById = async (id: string): Promise<ApiResponse<UserResponseData>> => {
  const response = await getRequest<UserResponseData>(`/user/${id}`);
  return response;
};
