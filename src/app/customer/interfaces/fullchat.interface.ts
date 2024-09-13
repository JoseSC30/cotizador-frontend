export interface FullChatResponse {
  name:       string;
  userClient: User;
  userAsesor: User;
  chatAi:     ChatAI;
  id:         number;
}

export interface ChatAI {
  data:   null;
  images: string[];
  id:     number;
}

export interface User {
  id:       string;
  email:    string;
  name:     string;
  lastName: string;
  isActive: boolean;
  roles:    string[];
  profile?: Profile;
}

export interface Profile {
  id:            number;
  gender:        string;
  photo:         string;
  photoPublicId: string;
}
