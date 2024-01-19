import { Member } from './member';

export interface Family {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at: Date;
  members: Member[];
  0: any;
  lenght: any;
}
