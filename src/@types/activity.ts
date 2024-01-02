import { Member } from './member';

export interface Activity {
  id: number | null; // Identifiant unique de l'activité
  name: string | null; // Nom de l'activité
  description: string | null; // Description de l'activité
  starting_time: Date | null; // Date et heure de début de l'activité (format TIMESTAMPTZ)
  ending_time: Date | null; // Date et heure de fin de l'activité (format TIMESTAMPTZ)
  category_id: number | null; // Identifiant de la catégorie de l'activité
  family_id: number | null; // Identifiant de la famille associée à l'activité
  user_id: number | null; // Identifiant de l'utilisateur ayant créé l'activité
  created_at: Date | null; // Date de création de l'activité (format TIMESTAMPTZ)
  updated_at: Date | null; // Date de mise à jour de l'activité (format TIMESTAMPTZ)
  assigned_to: Member[] | null; // Identifiants des utilisateurs assignés à l'activité
}
