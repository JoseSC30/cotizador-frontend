import { Profile } from "./register-response.interface";

export interface LoginResponse {
  id:       string;
  email:    string;
  password: string;
  profile:  Profile;
  token:    string;
}




