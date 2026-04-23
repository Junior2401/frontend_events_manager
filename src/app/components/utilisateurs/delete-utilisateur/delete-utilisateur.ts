import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Utilisateur } from '../../../models/utilisateur';

@Component({
  selector: 'app-delete-utilisateur',
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

      <div *ngIf="!isLoading && utilisateur" class="card-body text-center py-4">
        <p class="fs-5">
          Etes-vous sur de vouloir supprimer
          <strong class="text-primary">{{ utilisateur.nom }} {{ utilisateur.prenom }}</strong> ?
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
  styleUrl: './delete-utilisateur.css'
})
export class DeleteUtilisateur implements OnInit {
  utilisateur: Utilisateur | null = null;
  isLoading = true;
  isSubmitting = false;
  id!: number;

  constructor(private route: ActivatedRoute, private router: Router, private utilisateurService: UtilisateurApiService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.utilisateurService.getUtilisateurById(this.id).subscribe({
      next: (data) => {
        this.utilisateur = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/utilisateurs']);
  }

  onDelete(): void {
    if (!this.id) {
      return;
    }
    this.isSubmitting = true;
    this.utilisateurService.deleteUtilisateur(this.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/utilisateurs']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.isSubmitting = false;
      }
    });
  }
}
