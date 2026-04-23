export interface Evenement {
  id?: number;
  libelle: string;
  lieu: string;
  date: string | number[];
  capacite: number;
  description: string;
  statut: string;
  typeEvenementId: number;
}
