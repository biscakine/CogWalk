export interface Participant {
  id: string;          // identifiant unique (uuid, email…)
  firstName: string;
  lastName: string;
  age?: number;        // facultatif
  // Ajoutez ici tout champ nécessaire (score, rôle, etc.)
}
