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
  username: string;
  profile_picture: string;
  social_media: SocialMedia;
  bio: string;
}

export interface SocialMedia {
  twitter: string;
  linkedin: string;
  github: string;
  facebook: string;
  instagram: string;
  snapchat: string;
  youtube: string;
  pinterest: string;
  discord: string;
  website: string;
}
