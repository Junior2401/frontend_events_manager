import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministrateurApiService } from '../../../services/administrateur-api.service';
import { Administrateur } from '../../../models/administrateur';

@Component({
  selector: 'app-delete-administrateur',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white border-bottom py-3">
        <h5 class="card-title mb-0 fw-semibold">Confirmation de suppression</h5>
      </div>

      <div *ngIf="isLoading" class="card-body text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div *ngIf="!isLoading && administrateur" class="card-body text-center py-4">
        <p class="fs-5">
          Etes-vous sur de vouloir supprimer
          <strong class="text-primary">{{ administrateur.nom }} {{ administrateur.prenom }}</strong> ?
        </p>
        <p class="text-muted">Cette action est irreversible.</p>
      </div>

      <div class="card-footer bg-white border-top">
        <div class="row justify-content-center">
          <div class="col-sm-4 mb-2">
            <button class="btn btn-sm btn-secondary w-100" (click)="onBack()"><i class="bi bi-arrow-left-circle"></i> Retour</button>
          </div>
          <div class="col-sm-4">
            <button class="btn btn-sm btn-danger w-100" (click)="onDelete()" [disabled]="isSubmitting"><i class="bi bi-trash-fill"></i> Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './delete-administrateur.css'
})
export class DeleteAdministrateur implements OnInit {
  administrateur: Administrateur | null = null;
  isLoading = true;
  isSubmitting = false;
  id!: number;

  constructor(
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
        this.administrateur = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/administrateurs']);
  }

  onDelete(): void {
    if (!this.id) {
      return;
    }

    this.isSubmitting = true;
    this.administrateurService.deleteAdministrateur(this.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/administrateurs']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.isSubmitting = false;
      }
    });
  }
}
