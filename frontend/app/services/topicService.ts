import { CreateTopic, Topic, TopicReply } from "../types/topic";
import {
  ApiResponse,
  deleteRequest,
  getRequest,
  patchRequest,
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
}
;
export const getTopicsByUserId = async (id: string): Promise<ApiResponse<Topic[]>> => {
  const response = await getRequest<Topic[]>(`/topics/user/${id}`);
  return response;
};

export const deleteTopic = async (id: string): Promise<ApiResponse<null>> => {
  const response = await deleteRequest(`/topic/${id}`);
  return response;
};

export const getTopicById = async (id: string): Promise<ApiResponse<Topic>> => {
  const response = await getRequest<Topic>(`/topic/${id}`);
  return response;
};

export const getAllTopics = async (): Promise<ApiResponse<Topic[]>> => {
  const response = await getRequest<Topic[]>("/topics");
  return response;
};

export const getRepliesByTopicId = async (
  id: string
): Promise<ApiResponse<TopicReply[]>> => {
  const response = await getRequest<TopicReply[]>(`/topic/${id}/replies`);
  return response;
};

export const closeTopicById = async (id: string): Promise<ApiResponse<string>> => {
  const response = await patchRequest<string>(`/topic/${id}/close`, {});
  return response;
}