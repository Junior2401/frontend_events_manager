import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtisteApiService } from '../../../services/artiste-api.service';
import { Artiste } from '../../../models/artiste';

@Component({
  selector: 'app-update-artiste',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card card-warning card-outline mb-4">
      <div class="card-header"><div class="card-title">Modifier Artiste</div></div>
      <div *ngIf="isLoading" class="card-body text-center py-4"><div class="spinner-border text-primary"></div></div>
      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="card-body row g-3">
          <div class="col-md-6"><label class="form-label">Nom</label><input class="form-control" formControlName="nom"></div>
          <div class="col-md-6"><label class="form-label">Prenom</label><input class="form-control" formControlName="prenom"></div>
          <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" type="email" formControlName="email"></div>
          <div class="col-md-6"><label class="form-label">Nom de scene</label><input class="form-control" formControlName="nomDeScene"></div>
          <div class="col-md-6"><label class="form-label">Style artistique</label><input class="form-control" formControlName="styleArtistique"></div>
        </div>
        <div class="card-footer">
          <button type="submit" class="btn btn-warning float-end" [disabled]="isSubmitting"><i class="bi bi-check-circle"></i> Mettre a jour</button>
          <button type="button" class="btn btn-secondary float-end me-2" (click)="onBack()"><i class="bi bi-arrow-left-circle"></i> Retour</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './update-artiste.css'
})
export class UpdateArtiste implements OnInit {
  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    nomDeScene: ['', Validators.required],
    styleArtistique: ['', Validators.required]
  });
  id!: number;
  isLoading = true;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private artisteService: ArtisteApiService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.artisteService.getArtisteById(this.id).subscribe({
      next: (data) => {
        this.form.patchValue({ nom: data.nom, prenom: data.prenom, email: data.email, nomDeScene: data.nomDeScene, styleArtistique: data.styleArtistique });
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
    const payload = this.form.getRawValue() as Artiste;
    this.isSubmitting = true;
    this.artisteService.updateArtiste(this.id, payload).subscribe({
      next: () => this.router.navigate(['/artistes']),
      error: (error) => {
        console.error('Erreur lors de la mise a jour :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/artistes']);
  }
}
