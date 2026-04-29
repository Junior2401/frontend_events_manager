import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { TypeEvenementApiService } from '../../../services/type-evenement-api.service';
import { TicketApiService } from '../../../services/ticket-api.service';
import { Evenement } from '../../../models/evenement';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-detail-evenement',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-evenement.html',
  styleUrl: './detail-evenement.css'
})
export class DetailEvenement implements OnInit {
  evenement: Evenement | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evenementService: EvenementApiService,
    private typeService: TypeEvenementApiService,
    private ticketService: TicketApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (!isNaN(id)) {
        this.loadAllData(id);
      } else {
        this.router.navigate(['/evenements']);
      }
    });
  }

  loadAllData(id: number): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.evenementService.getEvenementById(id).subscribe({
      next: (data) => {
        this.evenement = data;
        this.loadRelations(id);
      },
      error: (err) => {
        console.error('Erreur chargement événement:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadRelations(id: number): void {
    if (!this.evenement) return;

    console.log('Loading relations for event:', id);

    // 1. Charger le type d'événement
    if (this.evenement.typeEvenementId) {
      this.typeService.getTypeEvenementById(this.evenement.typeEvenementId)
        .pipe(catchError(() => of(null)))
        .subscribe(type => {
          if (this.evenement && type) this.evenement.typeEvenement = type;
          this.cdr.detectChanges();
        });
    }

    // 2. Charger les artistes (utiliser ceux de l'événement s'ils existent)
    if (this.evenement.artistes && this.evenement.artistes.length > 0) {
      console.log('Artists already in event:', this.evenement.artistes.length);
    } else {
      this.evenementService.getArtistesByEvenement(id)
        .pipe(catchError(() => of([])))
        .subscribe(artistes => {
          if (this.evenement) this.evenement.artistes = artistes || [];
          console.log('Loaded artists:', artistes.length);
          this.cdr.detectChanges();
        });
    }

    // 3. Charger les organisateurs (utiliser ceux de l'événement s'ils existent)
    if (this.evenement.organisateurs && this.evenement.organisateurs.length > 0) {
      console.log('✅ Organizers already in event:', this.evenement.organisateurs.length);
    } else {
      this.evenementService.getOrganisateursByEvenement(id)
        .pipe(catchError(() => of([])))
        .subscribe(orgs => {
          if (this.evenement) this.evenement.organisateurs = orgs || [];
          console.log('📥 Loaded organizers:', orgs.length);
          this.cdr.detectChanges();
        });
    }

    // 4. Charger et calculer les statistiques des tickets
    this.ticketService.getTicketsByEvenement(id)
      .pipe(catchError(() => of([])))
      .subscribe(tickets => {
        if (this.evenement) {
          this.evenement.ticketsVendus = tickets.filter(t => t.statut === 'ACHETE').length;
          this.evenement.placesDisponibles = Math.max(0, this.evenement.capacite - this.evenement.ticketsVendus);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  get fillPercentage(): number {
    if (!this.evenement || !this.evenement.capacite || this.evenement.capacite === 0) return 0;
    const vendus = this.evenement.ticketsVendus || 0;
    return Math.min(100, Math.round((vendus / this.evenement.capacite) * 100));
  }

  formatDate(date: any): string {
    if (!date) return '-';
    if (Array.isArray(date)) {
      const [year, month, day, hour, minute] = date;
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hour ?? 0).padStart(2, '0')}:${String(minute ?? 0).padStart(2, '0')}`;
    }
    return new Date(date).toLocaleString('fr-FR');
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'VALIDE': return 'bg-success';
      case 'ANNULE': return 'bg-danger';
      case 'PLANIFIE': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  getStatusLabel(status: string | undefined): string {
    switch (status) {
      case 'CREE': return 'Créé';
      case 'VALIDE': return 'Validé';
      case 'PLANIFIE': return 'Planifié';
      case 'ANNULE': return 'Annulé';
      default: return status || '-';
    }
  }

  onBack(): void {
    this.router.navigate(['/evenements']);
  }
}
