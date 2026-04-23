export interface Organisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string | null;
  societe: string;
  telephonePro: string;
}
