import { CreateTopic, Topic } from "../types/topic";
import {
  ApiResponse,
  deleteRequest,
  getRequest,
  postRequest,
} from "./apiService";

export const createTopic = async (
  payload: CreateTopic
): Promise<ApiResponse<Topic>> => {
  const response = await postRequest<Topic, CreateTopic>("/topic", payload);
  return response;
};

export const getUserTopics = async (): Promise<ApiResponse<Topic[]>> => {
  const response = await getRequest<Topic[]>("/topics/user");
  return response;
};

export const deleteTopic = async (id: string): Promise<ApiResponse<null>> => {
  const response = await deleteRequest(`/topic/${id}`);
  return response;
};

export const getTopicById = async (id: string): Promise<ApiResponse<Topic>> => {
  const response = await getRequest<Topic>(`/topic/${id}`);
  return response;
}