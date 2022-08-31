import { User } from "./user.model";

export interface Profile extends User {
    photoUrl?: string;
  }