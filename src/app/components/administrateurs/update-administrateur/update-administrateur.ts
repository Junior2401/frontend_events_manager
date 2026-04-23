import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministrateurApiService } from '../../../services/administrateur-api.service';
import { Administrateur } from '../../../models/administrateur';

@Component({
  selector: 'app-update-administrateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card card-warning card-outline mb-4">
      <div class="card-header"><div class="card-title">Modifier Administrateur</div></div>
      <div *ngIf="isLoading" class="card-body text-center py-4"><div class="spinner-border text-primary"></div></div>
      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="card-body row g-3">
          <div class="col-md-6"><label class="form-label">Nom</label><input class="form-control" formControlName="nom"></div>
          <div class="col-md-6"><label class="form-label">Prenom</label><input class="form-control" formControlName="prenom"></div>
          <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" type="email" formControlName="email"></div>
          <div class="col-md-6"><label class="form-label">Role</label><input class="form-control" formControlName="role"></div>
        </div>
        <div class="card-footer">
          <button type="submit" class="btn btn-warning float-end" [disabled]="isSubmitting"><i class="bi bi-check-circle"></i> Mettre a jour</button>
          <button type="button" class="btn btn-secondary float-end me-2" (click)="onBack()"><i class="bi bi-arrow-left-circle"></i> Retour</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './update-administrateur.css'
})
export class UpdateAdministrateur implements OnInit {
  readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', [Validators.required]]
  });

  id!: number;
  isLoading = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private administrateurService: AdministrateurApiService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(this.id);
  }

  loadData(id: number): void {
    this.isLoading = true;
    this.administrateurService.getAdministrateurById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          role: data.role
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

    const payload: Administrateur = {
      nom: this.form.controls.nom.value.trim(),
      prenom: this.form.controls.prenom.value.trim(),
      email: this.form.controls.email.value.trim(),
      role: this.form.controls.role.value.trim()
    };

    this.isSubmitting = true;
    this.administrateurService.updateAdministrateur(this.id, payload).subscribe({
      next: () => this.router.navigate(['/administrateurs']),
      error: (error) => {
        console.error('Erreur lors de la mise a jour :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/administrateurs']);
  }
}
