import { Gender } from "./gender";

export interface SubscribeData {
  id?: number;
  name: string;
  email: string;
  gender: Gender | null;
}
