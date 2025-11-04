import { Gender } from "./gender.interface";

export interface SubscribeData {
  id?: number;
  name: string;
  email: string;
  gender: Gender | null;
}
