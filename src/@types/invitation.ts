import { PublicUser } from './publicUser'

export interface Invitation {
  // Définition des champs pour un membre
  id: number;
  from_user: PublicUser;
  to_user: PublicUser;
  // Ajoute d'autres champs nécessaires
}
  