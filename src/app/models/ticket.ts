import { Evenement } from './evenement';
import { Utilisateur } from './utilisateur';

export interface Ticket {
  id?: number;
  numeroPlace: string;
  place: string;
  prix: number;
  statut: string;
  dateAchat?: string | number[] | null;
  dateAnnulation?: string | number[] | null;
  dateRemboursement?: string | number[] | null;
  evenementId: number;
  utilisateurId: number;
  evenementLibelle?: string;
  utilisateurNomComplet?: string;
  evenement?: Evenement;
  utilisateur?: Utilisateur;
}
