import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Organisateur } from '../../../models/organisateur';

@Component({
  selector: 'app-create-organisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card card-primary card-outline mb-4">
      <div class="card-header"><div class="card-title">Nouveau Organisateur</div></div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="card-body row g-3">
          <div class="col-md-6"><label class="form-label">Nom</label><input class="form-control" formControlName="nom"></div>
          <div class="col-md-6"><label class="form-label">Prenom</label><input class="form-control" formControlName="prenom"></div>
          <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" type="email" formControlName="email"></div>
          <div class="col-md-6"><label class="form-label">Societe</label><input class="form-control" formControlName="societe"></div>
          <div class="col-md-6"><label class="form-label">Telephone pro</label><input class="form-control" formControlName="telephonePro"></div>
        </div>
        <div class="card-footer">
          <button type="submit" class="btn btn-success float-end" [disabled]="isSubmitting"><i class="bi bi-check-circle"></i> Ajouter</button>
          <button type="button" class="btn btn-secondary float-end me-2" (click)="onBack()"><i class="bi bi-arrow-left-circle"></i> Retour</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './create-organisateur.css'
})
export class CreateOrganisateur {
  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    societe: ['', Validators.required],
    telephonePro: ['', Validators.required]
  });
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router, private organisateurService: OrganisateurApiService) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as Organisateur;
    this.isSubmitting = true;
    this.organisateurService.createOrganisateur(payload).subscribe({
      next: () => this.router.navigate(['/organisateurs']),
      error: (error) => {
        console.error('Erreur lors de la creation :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/organisateurs']);
  }
}
