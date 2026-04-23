export interface Artiste {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string | null;
  nomDeScene: string;
  styleArtistique: string;
}
