import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Utilisateur } from '../../../models/utilisateur';

@Component({
  selector: 'app-create-utilisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card card-primary card-outline mb-4">
      <div class="card-header"><div class="card-title">Nouveau Utilisateur</div></div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="card-body row g-3">
          <div class="col-md-6"><label class="form-label">Nom</label><input class="form-control" formControlName="nom"></div>
          <div class="col-md-6"><label class="form-label">Prenom</label><input class="form-control" formControlName="prenom"></div>
          <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" type="email" formControlName="email"></div>
          <div class="col-md-6"><label class="form-label">Telephone</label><input class="form-control" formControlName="telephone"></div>
        </div>
        <div class="card-footer">
          <button type="submit" class="btn btn-success float-end" [disabled]="isSubmitting"><i class="bi bi-check-circle"></i> Ajouter</button>
          <button type="button" class="btn btn-secondary float-end me-2" (click)="onBack()"><i class="bi bi-arrow-left-circle"></i> Retour</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './create-utilisateur.css'
})
export class CreateUtilisateur {
  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required]
  });
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router, private utilisateurService: UtilisateurApiService) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as Utilisateur;
    this.isSubmitting = true;
    this.utilisateurService.createUtilisateur(payload).subscribe({
      next: () => this.router.navigate(['/utilisateurs']),
      error: (error) => {
        console.error('Erreur lors de la creation :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/utilisateurs']);
  }
}
