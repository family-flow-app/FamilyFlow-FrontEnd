export interface UserData {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  description?: string;
  email: string;
  password?: string;
  image_url?: string | null;
  birthday?: Date;
  role: string;
  created_at: Date;
}
