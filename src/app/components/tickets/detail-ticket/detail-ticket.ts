import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketApiService } from '../../../services/ticket-api.service';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Ticket } from '../../../models/ticket';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-detail-ticket',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-ticket.html',
  styleUrl: './detail-ticket.css'
})
export class DetailTicket implements OnInit {
  ticket: Ticket | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private ticketService: TicketApiService, 
    private evenementService: EvenementApiService,
    private utilisateurService: UtilisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAllData(id);
  }

  loadAllData(id: number): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.loadRelations();
      },
      error: (err) => {
        console.error('Erreur chargement ticket:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadRelations(): void {
    if (!this.ticket) return;

    let relationsLoaded = 0;
    const totalRelations = 2;

    const checkLoadingComplete = () => {
      relationsLoaded++;
      if (relationsLoaded === totalRelations) {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    };

    // 1. Charger l'événement
    this.evenementService.getEvenementById(this.ticket.evenementId)
      .pipe(catchError(() => of(null)))
      .subscribe(evenement => {
        if (this.ticket && evenement) this.ticket.evenement = evenement;
        this.cdr.detectChanges();
        checkLoadingComplete();
      });

    // 2. Charger l'utilisateur
    this.utilisateurService.getUtilisateurById(this.ticket.utilisateurId)
      .pipe(catchError(() => of(null)))
      .subscribe(utilisateur => {
        if (this.ticket && utilisateur) this.ticket.utilisateur = utilisateur;
        this.cdr.detectChanges();
        checkLoadingComplete();
      });

    // Sécurité : forcer la fin du chargement après 2 secondes si les sous-appels bloquent
    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 2000);
  }

  onBack(): void {
    this.router.navigate(['/tickets']);
  }

  formatDate(date: any): string {
    if (!date) return '';
    if (Array.isArray(date)) {
      const [year, month, day, hour, minute] = date;
      return `${this.pad(day)}/${this.pad(month)}/${year} ${this.pad(hour)}:${this.pad(minute)}`;
    }
    const d = new Date(date);
    return `${this.pad(d.getDate())}/${this.pad(d.getMonth() + 1)}/${d.getFullYear()} ${this.pad(d.getHours())}:${this.pad(d.getMinutes())}`;
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return '';
    return phone.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  }

  getStatusBadgeClass(status: string | undefined): string {
    if (!status) return 'bg-light text-dark border';

    switch (status.toUpperCase()) {
      case 'ACHETE':
        return 'bg-success';
      case 'ANNULE':
        return 'bg-danger';
      case 'REMBOURSE':
        return 'bg-info text-dark';
      default:
        return 'bg-light text-dark border';
    }
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Inconnu';

    switch (status.toUpperCase()) {
      case 'ACHETE':
        return 'Acheté';
      case 'ANNULE':
        return 'Annulé';
      case 'REMBOURSE':
        return 'Remboursé';
      default:
        return status;
    }
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }
}
