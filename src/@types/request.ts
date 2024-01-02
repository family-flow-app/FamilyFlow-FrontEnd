import { UserData } from '../@types/user'

export interface Request {
    // Définition des champs pour un membre
    id: number;
    user_id: number;
    email: string;
    image_url: string;
    firstname: string;
    lastname: string;
    // Ajoute d'autres champs nécessaires
  }
  