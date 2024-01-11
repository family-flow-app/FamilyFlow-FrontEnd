export interface Invitation {
  id: number;
  from_user: {
    id: number;
    firstname: string;
    lastname: string;
    image_url: string;
  };
  to_user: {
    id: number;
    firstname: string;
    lastname: string;
    image_url: string;
  };
}
