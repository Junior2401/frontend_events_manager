import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Organisateur } from '../../../models/organisateur';

@Component({
  selector: 'app-delete-organisateur',
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

      <div *ngIf="!isLoading && organisateur" class="card-body text-center py-4">
        <p class="fs-5">
          Etes-vous sur de vouloir supprimer
          <strong class="text-primary">{{ organisateur.nom }} {{ organisateur.prenom }}</strong> ?
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
  styleUrl: './delete-organisateur.css'
})
export class DeleteOrganisateur implements OnInit {
  organisateur: Organisateur | null = null;
  isLoading = true;
  isSubmitting = false;
  id!: number;

  constructor(private route: ActivatedRoute, private router: Router, private organisateurService: OrganisateurApiService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.organisateurService.getOrganisateurById(this.id).subscribe({
      next: (data) => {
        this.organisateur = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/organisateurs']);
  }

  onDelete(): void {
    if (!this.id) {
      return;
    }
    this.isSubmitting = true;
    this.organisateurService.deleteOrganisateur(this.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/organisateurs']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.isSubmitting = false;
      }
    });
  }
}
