export interface Presupuesto {
  index:         number;
  message:       Message;
  logprobs:      null;
  finish_reason: string;
}

export interface Message {
  role:    string;
  content: string;
}
