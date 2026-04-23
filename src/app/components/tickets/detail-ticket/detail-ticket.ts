import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketApiService } from '../../../services/ticket-api.service';
import { Ticket } from '../../../models/ticket';

@Component({
  selector: 'app-detail-ticket',
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
        <h5 class="card-title mb-0 fw-semibold">Detail ticket</h5>
        <button type="button" class="btn btn-outline-secondary btn-sm" (click)="onBack()"><i class="bi bi-arrow-left"></i> Retour</button>
      </div>
      <div *ngIf="isLoading" class="card-body text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>
      <div *ngIf="!isLoading && ticket" class="card-body">
        <div class="row mb-2"><div class="col-4 text-muted">Numero place</div><div class="col-8">{{ ticket.numeroPlace }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Place</div><div class="col-8">{{ ticket.place }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Prix</div><div class="col-8">{{ ticket.prix }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Statut</div><div class="col-8">{{ ticket.statut }}</div></div>
      </div>
      <div class="card-footer bg-white border-top d-flex justify-content-end gap-2 py-3">
        <button type="button" class="btn btn-primary btn-sm" [routerLink]="['/tickets/edit', ticket?.id]" [disabled]="!ticket?.id"><i class="bi bi-pencil-square"></i> Modifier</button>
        <button type="button" class="btn btn-danger btn-sm" [routerLink]="['/tickets/delete', ticket?.id]" [disabled]="!ticket?.id"><i class="bi bi-trash-fill"></i> Supprimer</button>
      </div>
    </div>
  `,
  styleUrl: './detail-ticket.css'
})
export class DetailTicket implements OnInit {
  ticket: Ticket | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private ticketService: TicketApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(id);
  }

  loadData(id: number): void {
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/tickets']);
  }
}
