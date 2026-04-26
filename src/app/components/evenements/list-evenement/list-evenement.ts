import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, ActivatedRoute } from '@angular/router';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { TicketApiService } from '../../../services/ticket-api.service';
import { Evenement } from '../../../models/evenement';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-list-evenement',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './list-evenement.html',
  styleUrl: './list-evenement.css',
})
export class ListEvenement implements OnInit, AfterViewInit {
  dtOptions: any = {};
  evenements: Evenement[] = [];
  isLoading = true;
  notification: { message: string, type: string } | null = null;

  constructor(
    private evenementService: EvenementApiService,
    private ticketService: TicketApiService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.checkNotifications();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json'
      }
    };
  }

  loadData(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    // On charge les événements
    this.evenementService.getEvenements().subscribe({
      next: (data) => {
        this.evenements = data ?? [];
        
        // Pour éviter de saturer le réseau, on ne charge les compteurs que si la liste n'est pas trop longue
        // ou on pourrait imaginer un endpoint de stats global.
        // Ici, on va charger les tickets pour chaque événement mais de manière plus ordonnée.
        this.loadTicketStats();
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.evenements = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadTicketStats(): void {
    // On utilise forkJoin pour charger toutes les stats en parallèle proprement
    const requests = this.evenements.map(ev => 
      this.ticketService.getTicketsByEvenement(ev.id!).pipe(
        catchError(() => of([]))
      )
    );

    if (requests.length > 0) {
      forkJoin(requests).subscribe(allTickets => {
        allTickets.forEach((tickets, index) => {
          this.evenements[index].ticketsVendus = tickets.filter(t => t.statut === 'ACHETE').length;
        });
        this.cdr.detectChanges();
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ($('#example1').length > 0) {
        const table = ($('#example1') as any).DataTable({
          responsive: true,
          language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json'
          }
        });
      }
    }, 500);
  }

  formatDate(date: any): string {
    if (!date) return '-';
    if (Array.isArray(date)) {
      const [year, month, day, hour, minute] = date;
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hour ?? 0).padStart(2, '0')}:${String(minute ?? 0).padStart(2, '0')}`;
    }
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status?.toUpperCase()) {
      case 'VALIDE': return 'bg-success';
      case 'ANNULE': return 'bg-danger';
      case 'PLANIFIE': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  getStatusLabel(status: string | undefined): string {
    switch (status?.toUpperCase()) {
      case 'CREE': return 'Créé';
      case 'VALIDE': return 'Validé';
      case 'PLANIFIE': return 'Planifié';
      case 'ANNULE': return 'Annulé';
      default: return status || '-';
    }
  }

  getFillPercentage(item: Evenement): number {
    if (!item.capacite || item.capacite === 0) return 0;
    const vendus = item.ticketsVendus || 0;
    return Math.min(100, Math.round((vendus / item.capacite) * 100));
  }

  checkNotifications(): void {
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.notification = {
          message: params['message'],
          type: params['type'] || 'info'
        };
        this.cdr.detectChanges();
        setTimeout(() => this.closeNotification(), 5000);
      }
    });
  }

  closeNotification(): void {
    this.notification = null;
    this.cdr.detectChanges();
  }
}
