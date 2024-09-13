import { ChatAI } from "./fullchat.interface";

export interface MembershipResponse {
  id:         string;
  email:      string;
  name:       string;
  lastName:   string;
  isActive:   boolean;
  roles:      string[];
  membership: Membership;
  fullChats:  FullChat[];
}

export interface FullChat {
  id:     number;
  name:   string;
  chatAi: ChatAI;
}

export interface Membership {
  id:        number;
  chatStock: ChatStock;
}

export interface ChatStock {
  id:          number;
  chatsNumber: number;
  occupied:    number;
}
