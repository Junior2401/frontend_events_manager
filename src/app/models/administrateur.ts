export interface Administrateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string | null;
  role: string;
}
