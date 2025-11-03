import { Gender } from "./gender";

export interface SubscribeData {
  name: string;
  email: string;
  gender: Gender | null;
}
