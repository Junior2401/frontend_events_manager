import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Organisateur } from '../../../models/organisateur';

@Component({
  selector: 'app-update-organisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card card-warning card-outline mb-4">
      <div class="card-header"><div class="card-title">Modifier Organisateur</div></div>
      <div *ngIf="isLoading" class="card-body text-center py-4"><div class="spinner-border text-primary"></div></div>
      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="card-body row g-3">
          <div class="col-md-6"><label class="form-label">Nom</label><input class="form-control" formControlName="nom"></div>
          <div class="col-md-6"><label class="form-label">Prenom</label><input class="form-control" formControlName="prenom"></div>
          <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" type="email" formControlName="email"></div>
          <div class="col-md-6"><label class="form-label">Societe</label><input class="form-control" formControlName="societe"></div>
          <div class="col-md-6"><label class="form-label">Telephone pro</label><input class="form-control" formControlName="telephonePro"></div>
        </div>
        <div class="card-footer">
          <button type="submit" class="btn btn-warning float-end" [disabled]="isSubmitting"><i class="bi bi-check-circle"></i> Mettre a jour</button>
          <button type="button" class="btn btn-secondary float-end me-2" (click)="onBack()"><i class="bi bi-arrow-left-circle"></i> Retour</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './update-organisateur.css'
})
export class UpdateOrganisateur implements OnInit {
  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    societe: ['', Validators.required],
    telephonePro: ['', Validators.required]
  });
  id!: number;
  isLoading = true;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private organisateurService: OrganisateurApiService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.organisateurService.getOrganisateurById(this.id).subscribe({
      next: (data) => {
        this.form.patchValue({ nom: data.nom, prenom: data.prenom, email: data.email, societe: data.societe, telephonePro: data.telephonePro });
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
    const payload = this.form.getRawValue() as Organisateur;
    this.isSubmitting = true;
    this.organisateurService.updateOrganisateur(this.id, payload).subscribe({
      next: () => this.router.navigate(['/organisateurs']),
      error: (error) => {
        console.error('Erreur lors de la mise a jour :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/organisateurs']);
  }
}
