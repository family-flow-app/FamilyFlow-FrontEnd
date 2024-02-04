export interface InvitationUser {
  id: number;
  family_id: number;
  name: string;
  description: string;
  image_url: string | null;
  created_at: Date;
  from_user_id: {
    firstname: string;
    lastname: string;
    image_url: string;
  };
}
