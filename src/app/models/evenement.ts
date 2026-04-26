import { TypeEvenement } from './type-evenement';
import { Artiste } from './artiste';
import { Organisateur } from './organisateur';

export interface Evenement {
  id?: number;
  libelle: string;
  lieu: string;
  date: string | number[];
  capacite: number;
  description: string;
  statut: string;
  typeEvenementId: number;
  typeEvenement?: TypeEvenement;
  artistes?: Artiste[];
  organisateurs?: Organisateur[];
  artistesIds?: number[];
  organisateursIds?: number[];
  ticketsVendus?: number;
  placesDisponibles?: number;
  typesPlace?: string[];
}
