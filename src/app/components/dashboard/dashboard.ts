import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EvenementApiService } from '../../services/evenement-api.service';
import { TicketApiService } from '../../services/ticket-api.service';
import { UtilisateurApiService } from '../../services/utilisateur-api.service';
import { ArtisteApiService } from '../../services/artiste-api.service';
import { AdministrateurApiService } from '../../services/administrateur-api.service';
import { OrganisateurApiService } from '../../services/organisateur-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  isLoading = true;

  evenementsCount = 0;
  ticketsCount = 0;
  utilisateursCount = 0;
  artistesCount = 0;
  administrateursCount = 0;
  organisateursCount = 0;

  constructor(
    private evenementService: EvenementApiService,
    private ticketService: TicketApiService,
    private utilisateurService: UtilisateurApiService,
    private artisteService: ArtisteApiService,
    private administrateurService: AdministrateurApiService,
    private organisateurService: OrganisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load all data
    Promise.all([
      this.loadEvenements(),
      this.loadTickets(),
      this.loadUtilisateurs(),
      this.loadArtistes(),
      this.loadAdministrateurs(),
      this.loadOrganisateurs()
    ]).then(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }).catch((err) => {
      console.error('Erreur chargement dashboard:', err);
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  private loadEvenements(): Promise<void> {
    return new Promise((resolve) => {
      this.evenementService.getEvenements().subscribe({
        next: (data) => {
          this.evenementsCount = data?.length ?? 0;
          resolve();
        },
        error: () => {
          this.evenementsCount = 0;
          resolve();
        }
      });
    });
  }

  private loadTickets(): Promise<void> {
    return new Promise((resolve) => {
      this.ticketService.getTickets().subscribe({
        next: (data) => {
          this.ticketsCount = data?.length ?? 0;
          resolve();
        },
        error: () => {
          this.ticketsCount = 0;
          resolve();
        }
      });
    });
  }

  private loadUtilisateurs(): Promise<void> {
    return new Promise((resolve) => {
      this.utilisateurService.getUtilisateurs().subscribe({
        next: (data) => {
          this.utilisateursCount = data?.length ?? 0;
          resolve();
        },
        error: () => {
          this.utilisateursCount = 0;
          resolve();
        }
      });
    });
  }

  private loadArtistes(): Promise<void> {
    return new Promise((resolve) => {
      this.artisteService.getArtistes().subscribe({
        next: (data) => {
          this.artistesCount = data?.length ?? 0;
          resolve();
        },
        error: () => {
          this.artistesCount = 0;
          resolve();
        }
      });
    });
  }

  private loadAdministrateurs(): Promise<void> {
    return new Promise((resolve) => {
      this.administrateurService.getAdministrateurs().subscribe({
        next: (data) => {
          this.administrateursCount = data?.length ?? 0;
          resolve();
        },
        error: () => {
          this.administrateursCount = 0;
          resolve();
        }
      });
    });
  }

  private loadOrganisateurs(): Promise<void> {
    return new Promise((resolve) => {
      this.organisateurService.getOrganisateurs().subscribe({
        next: (data) => {
          this.organisateursCount = data?.length ?? 0;
          resolve();
        },
        error: () => {
          this.organisateursCount = 0;
          resolve();
        }
      });
    });
  }
}
