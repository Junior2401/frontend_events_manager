import { Routes } from '@angular/router';
import {ListTypeEvenement} from './components/type_evenements/list-type-evenement/list-type-evenement';
import {Dashboard} from './components/dashboard/dashboard';
import {CreateTypeEvenement} from './components/type_evenements/create-type-evenement/create-type-evenement';
import {DetailTypeEvenement} from './components/type_evenements/detail-type-evenement/detail-type-evenement';
import {ListTicket} from './components/tickets/list-ticket/list-ticket';
import {CreateTicket} from './components/tickets/create-ticket/create-ticket';
import {DeleteTicket} from './components/tickets/delete-ticket/delete-ticket';
import {DetailTicket} from './components/tickets/detail-ticket/detail-ticket';
import {UpdateTicket} from './components/tickets/update-ticket/update-ticket';
import {DeleteEvenement} from './components/evenements/delete-evenement/delete-evenement';
import {DetailEvenement} from './components/evenements/detail-evenement/detail-evenement';
import {CreateEvenement} from './components/evenements/create-evenement/create-evenement';
import {ListEvenement} from './components/evenements/list-evenement/list-evenement';
import {UpdateEvenement} from './components/evenements/update-evenement/update-evenement';
import {CreateUtilisateur} from './components/utilisateurs/create-utilisateur/create-utilisateur';
import {ListUtilisateur} from './components/utilisateurs/list-utilisateur/list-utilisateur';
import {DetailUtilisateur} from './components/utilisateurs/detail-utilisateur/detail-utilisateur';
import {DeleteUtilisateur} from './components/utilisateurs/delete-utilisateur/delete-utilisateur';
import {UpdateUtilisateur} from './components/utilisateurs/update-utilisateur/update-utilisateur';
import {ListArtiste} from './components/artistes/list-artiste/list-artiste';
import {CreateArtiste} from './components/artistes/create-artiste/create-artiste';
import {DetailArtiste} from './components/artistes/detail-artiste/detail-artiste';
import {DeleteArtiste} from './components/artistes/delete-artiste/delete-artiste';
import {UpdateArtiste} from './components/artistes/update-artiste/update-artiste';
import {ListOrganisateur} from './components/organisateurs/list-organisateur/list-organisateur';
import {CreateOrganisateur} from './components/organisateurs/create-organisateur/create-organisateur';
import {DetailOrganisateur} from './components/organisateurs/detail-organisateur/detail-organisateur';
import {DeleteOrganisateur} from './components/organisateurs/delete-organisateur/delete-organisateur';
import {UpdateOrganisateur} from './components/organisateurs/update-organisateur/update-organisateur';
import {ListAdministrateur} from './components/administrateurs/list-administrateur/list-administrateur';
import {CreateAdministrateur} from './components/administrateurs/create-administrateur/create-administrateur';
import {DetailAdministrateur} from './components/administrateurs/detail-administrateur/detail-administrateur';
import {DeleteAdministrateur} from './components/administrateurs/delete-administrateur/delete-administrateur';
import {UpdateAdministrateur} from './components/administrateurs/update-administrateur/update-administrateur';
import {UpdateTypeEvenement} from './components/type_evenements/update-type-evenement/update-type-evenement';
import {DeleteTypeEvenement} from './components/type_evenements/delete-type-evenement/delete-type-evenement';

export const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: 'accueil', component: Dashboard, title: 'Tableau de Board' },

  { path: 'tickets', component: ListTicket, title: 'Liste tickets' },
  { path: 'tickets/create', component: CreateTicket, title: 'Nouveau ticket' },
  { path: 'tickets/edit/:id', component: UpdateTicket, title: 'Modifier ticket' },
  { path: 'tickets/detail/:id', component: DetailTicket, title: 'Detail ticket' },
  { path: 'tickets/delete/:id', component: DeleteTicket, title: 'Supprimer ticket' },

  { path: 'evenements', component: ListEvenement, title: 'Liste evenements' },
  { path: 'evenements/create', component: CreateEvenement, title: 'Nouveau evenement' },
  { path: 'evenements/edit/:id', component: UpdateEvenement, title: 'Modifier evenement' },
  { path: 'evenements/detail/:id', component: DetailEvenement, title: 'Detail evenement' },
  { path: 'evenements/delete/:id', component: DeleteEvenement, title: 'Supprimer evenement' },

  { path: 'utilisateurs', component: ListUtilisateur, title: 'Liste utilisateurs' },
  { path: 'utilisateurs/create', component: CreateUtilisateur, title: 'Nouveau utilisateur' },
  { path: 'utilisateurs/edit/:id', component: UpdateUtilisateur, title: 'Modifier utilisateur' },
  { path: 'utilisateurs/detail/:id', component: DetailUtilisateur, title: 'Detail utilisateur' },
  { path: 'utilisateurs/delete/:id', component: DeleteUtilisateur, title: 'Supprimer utilisateur' },

  { path: 'artistes', component: ListArtiste, title: 'Liste artistes' },
  { path: 'artistes/create', component: CreateArtiste, title: 'Nouveau artiste' },
  { path: 'artistes/edit/:id', component: UpdateArtiste, title: 'Modifier artiste' },
  { path: 'artistes/detail/:id', component: DetailArtiste, title: 'Detail artiste' },
  { path: 'artistes/delete/:id', component: DeleteArtiste, title: 'Supprimer artiste' },

  { path: 'organisateurs', component: ListOrganisateur, title: 'Liste organisateurs' },
  { path: 'organisateurs/create', component: CreateOrganisateur, title: 'Nouveau organisateur' },
  { path: 'organisateurs/edit/:id', component: UpdateOrganisateur, title: 'Modifier organisateur' },
  { path: 'organisateurs/detail/:id', component: DetailOrganisateur, title: 'Detail organisateur' },
  { path: 'organisateurs/delete/:id', component: DeleteOrganisateur, title: 'Supprimer organisateur' },

  { path: 'administrateurs', component: ListAdministrateur, title: 'Liste administrateurs' },
  { path: 'administrateurs/create', component: CreateAdministrateur, title: 'Nouveau administrateur' },
  { path: 'administrateurs/edit/:id', component: UpdateAdministrateur, title: 'Modifier administrateur' },
  { path: 'administrateurs/detail/:id', component: DetailAdministrateur, title: 'Detail administrateur' },
  { path: 'administrateurs/delete/:id', component: DeleteAdministrateur, title: 'Supprimer administrateur' },

  { path: 'type-evenements', component: ListTypeEvenement, title: 'Liste type evenements' },
  { path: 'type-evenements/create', component: CreateTypeEvenement, title: 'Nouveau type evenements' },
  { path: 'type-evenements/detail/:id', component: DetailTypeEvenement, title: 'Detail type evenement' },
  { path: 'type-evenements/edit/:id', component: UpdateTypeEvenement, title: 'Modifier type evenement' },
  { path: 'type-evenements/delete/:id', component: DeleteTypeEvenement, title: 'Supprimer type evenement' },
];
