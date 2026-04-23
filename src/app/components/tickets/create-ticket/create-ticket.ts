import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketApiService } from '../../../services/ticket-api.service';
import { Ticket } from '../../../models/ticket';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card card-primary card-outline mb-4">
      <div class="card-header"><div class="card-title">Nouveau Ticket</div></div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="card-body row g-3">
          <div class="col-md-6"><label class="form-label">Numero place</label><input class="form-control" formControlName="numeroPlace"></div>
          <div class="col-md-6"><label class="form-label">Place</label><input class="form-control" formControlName="place"></div>
          <div class="col-md-4"><label class="form-label">Prix</label><input class="form-control" type="number" formControlName="prix"></div>
          <div class="col-md-4"><label class="form-label">Statut</label><input class="form-control" formControlName="statut"></div>
          <div class="col-md-4"><label class="form-label">ID evenement</label><input class="form-control" type="number" formControlName="evenementId"></div>
          <div class="col-md-4"><label class="form-label">ID utilisateur</label><input class="form-control" type="number" formControlName="utilisateurId"></div>
        </div>
        <div class="card-footer">
          <button type="submit" class="btn btn-success float-end" [disabled]="isSubmitting"><i class="bi bi-check-circle"></i> Ajouter</button>
          <button type="button" class="btn btn-secondary float-end me-2" (click)="onBack()"><i class="bi bi-arrow-left-circle"></i> Retour</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './create-ticket.css'
})
export class CreateTicket {
  readonly form = this.fb.nonNullable.group({
    numeroPlace: ['', Validators.required],
    place: ['', Validators.required],
    prix: [0, Validators.required],
    statut: ['', Validators.required],
    evenementId: [0, Validators.required],
    utilisateurId: [0, Validators.required]
  });

  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router, private ticketService: TicketApiService) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as Ticket;
    this.isSubmitting = true;
    this.ticketService.createTicket(payload).subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: (error) => {
        console.error('Erreur lors de la creation :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/tickets']);
  }
}
