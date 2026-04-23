import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketApiService } from '../../../services/ticket-api.service';
import { Ticket } from '../../../models/ticket';

@Component({
  selector: 'app-update-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card card-warning card-outline mb-4">
      <div class="card-header"><div class="card-title">Modifier Ticket</div></div>
      <div *ngIf="isLoading" class="card-body text-center py-4"><div class="spinner-border text-primary"></div></div>
      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="card-body row g-3">
          <div class="col-md-6"><label class="form-label">Numero place</label><input class="form-control" formControlName="numeroPlace"></div>
          <div class="col-md-6"><label class="form-label">Place</label><input class="form-control" formControlName="place"></div>
          <div class="col-md-4"><label class="form-label">Prix</label><input class="form-control" type="number" formControlName="prix"></div>
          <div class="col-md-4"><label class="form-label">Statut</label><input class="form-control" formControlName="statut"></div>
          <div class="col-md-4"><label class="form-label">ID evenement</label><input class="form-control" type="number" formControlName="evenementId"></div>
          <div class="col-md-4"><label class="form-label">ID utilisateur</label><input class="form-control" type="number" formControlName="utilisateurId"></div>
        </div>
        <div class="card-footer">
          <button type="submit" class="btn btn-warning float-end" [disabled]="isSubmitting"><i class="bi bi-check-circle"></i> Mettre a jour</button>
          <button type="button" class="btn btn-secondary float-end me-2" (click)="onBack()"><i class="bi bi-arrow-left-circle"></i> Retour</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './update-ticket.css'
})
export class UpdateTicket implements OnInit {
  readonly form = this.fb.nonNullable.group({
    numeroPlace: ['', Validators.required],
    place: ['', Validators.required],
    prix: [0, Validators.required],
    statut: ['', Validators.required],
    evenementId: [0, Validators.required],
    utilisateurId: [0, Validators.required]
  });

  id!: number;
  isLoading = true;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private ticketService: TicketApiService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(this.id);
  }

  loadData(id: number): void {
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          numeroPlace: data.numeroPlace,
          place: data.place,
          prix: data.prix,
          statut: data.statut,
          evenementId: data.evenementId,
          utilisateurId: data.utilisateurId
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as Ticket;
    this.isSubmitting = true;
    this.ticketService.updateTicket(this.id, payload).subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: (error) => {
        console.error('Erreur lors de la mise a jour :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/tickets']);
  }
}
