import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Utilisateur } from '../../../models/utilisateur';

@Component({
  selector: 'app-detail-utilisateur',
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
        <h5 class="card-title mb-0 fw-semibold">Detail utilisateur</h5>
        <button type="button" class="btn btn-outline-secondary btn-sm" (click)="onBack()"><i class="bi bi-arrow-left"></i> Retour</button>
      </div>
      <div *ngIf="isLoading" class="card-body text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>
      <div *ngIf="!isLoading && utilisateur" class="card-body">
        <div class="row mb-2"><div class="col-4 text-muted">Nom</div><div class="col-8">{{ utilisateur.nom }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Prenom</div><div class="col-8">{{ utilisateur.prenom }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Email</div><div class="col-8">{{ utilisateur.email }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Telephone</div><div class="col-8">{{ utilisateur.telephone }}</div></div>
      </div>
      <div class="card-footer bg-white border-top d-flex justify-content-end gap-2 py-3">
        <button type="button" class="btn btn-primary btn-sm" [routerLink]="['/utilisateurs/edit', utilisateur?.id]" [disabled]="!utilisateur?.id"><i class="bi bi-pencil-square"></i> Modifier</button>
        <button type="button" class="btn btn-danger btn-sm" [routerLink]="['/utilisateurs/delete', utilisateur?.id]" [disabled]="!utilisateur?.id"><i class="bi bi-trash-fill"></i> Supprimer</button>
      </div>
    </div>
  `,
  styleUrl: './detail-utilisateur.css'
})
export class DetailUtilisateur implements OnInit {
  utilisateur: Utilisateur | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private utilisateurService: UtilisateurApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.utilisateurService.getUtilisateurById(id).subscribe({
      next: (data) => {
        this.utilisateur = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/utilisateurs']);
  }
}
