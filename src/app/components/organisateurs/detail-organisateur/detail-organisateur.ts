import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Organisateur } from '../../../models/organisateur';

@Component({
  selector: 'app-detail-organisateur',
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
        <h5 class="card-title mb-0 fw-semibold">Detail organisateur</h5>
        <button type="button" class="btn btn-outline-secondary btn-sm" (click)="onBack()"><i class="bi bi-arrow-left"></i> Retour</button>
      </div>
      <div *ngIf="isLoading" class="card-body text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>
      <div *ngIf="!isLoading && organisateur" class="card-body">
        <div class="row mb-2"><div class="col-4 text-muted">Nom</div><div class="col-8">{{ organisateur.nom }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Prenom</div><div class="col-8">{{ organisateur.prenom }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Email</div><div class="col-8">{{ organisateur.email }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Societe</div><div class="col-8">{{ organisateur.societe }}</div></div>
      </div>
      <div class="card-footer bg-white border-top d-flex justify-content-end gap-2 py-3">
        <button type="button" class="btn btn-primary btn-sm" [routerLink]="['/organisateurs/edit', organisateur?.id]" [disabled]="!organisateur?.id"><i class="bi bi-pencil-square"></i> Modifier</button>
        <button type="button" class="btn btn-danger btn-sm" [routerLink]="['/organisateurs/delete', organisateur?.id]" [disabled]="!organisateur?.id"><i class="bi bi-trash-fill"></i> Supprimer</button>
      </div>
    </div>
  `,
  styleUrl: './detail-organisateur.css'
})
export class DetailOrganisateur implements OnInit {
  organisateur: Organisateur | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private organisateurService: OrganisateurApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.organisateurService.getOrganisateurById(id).subscribe({
      next: (data) => {
        this.organisateur = data;
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
    this.router.navigate(['/organisateurs']);
  }
}
