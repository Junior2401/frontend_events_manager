import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { Evenement } from '../../../models/evenement';

@Component({
  selector: 'app-create-evenement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card card-primary card-outline mb-4">
      <div class="card-header"><div class="card-title">Nouveau Evenement</div></div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="card-body row g-3">
          <div class="col-md-6"><label class="form-label">Libelle</label><input class="form-control" formControlName="libelle"></div>
          <div class="col-md-6"><label class="form-label">Lieu</label><input class="form-control" formControlName="lieu"></div>
          <div class="col-md-6"><label class="form-label">Date</label><input class="form-control" type="datetime-local" formControlName="date"></div>
          <div class="col-md-6"><label class="form-label">Capacite</label><input class="form-control" type="number" formControlName="capacite"></div>
          <div class="col-md-6"><label class="form-label">Statut</label><input class="form-control" formControlName="statut"></div>
          <div class="col-md-6"><label class="form-label">Type evenement ID</label><input class="form-control" type="number" formControlName="typeEvenementId"></div>
          <div class="col-12"><label class="form-label">Description</label><textarea class="form-control" rows="3" formControlName="description"></textarea></div>
        </div>
        <div class="card-footer">
          <button type="submit" class="btn btn-success float-end" [disabled]="isSubmitting"><i class="bi bi-check-circle"></i> Ajouter</button>
          <button type="button" class="btn btn-secondary float-end me-2" (click)="onBack()"><i class="bi bi-arrow-left-circle"></i> Retour</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './create-evenement.css'
})
export class CreateEvenement {
  readonly form = this.fb.nonNullable.group({
    libelle: ['', Validators.required],
    lieu: ['', Validators.required],
    date: ['', Validators.required],
    capacite: [0, Validators.required],
    description: ['', Validators.required],
    statut: ['', Validators.required],
    typeEvenementId: [0, Validators.required]
  });

  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router, private evenementService: EvenementApiService) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as unknown as Evenement;
    this.isSubmitting = true;
    this.evenementService.createEvenement(payload).subscribe({
      next: () => this.router.navigate(['/evenements']),
      error: (error) => {
        console.error('Erreur lors de la creation :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/evenements']);
  }
}
