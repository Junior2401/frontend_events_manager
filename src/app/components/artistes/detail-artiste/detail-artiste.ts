import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArtisteApiService } from '../../../services/artiste-api.service';
import { Artiste } from '../../../models/artiste';

@Component({
  selector: 'app-detail-artiste',
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
        <h5 class="card-title mb-0 fw-semibold">Detail artiste</h5>
        <button type="button" class="btn btn-outline-secondary btn-sm" (click)="onBack()"><i class="bi bi-arrow-left"></i> Retour</button>
      </div>
      <div *ngIf="isLoading" class="card-body text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>
      <div *ngIf="!isLoading && artiste" class="card-body">
        <div class="row mb-2"><div class="col-4 text-muted">Nom</div><div class="col-8">{{ artiste.nom }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Prenom</div><div class="col-8">{{ artiste.prenom }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Email</div><div class="col-8">{{ artiste.email }}</div></div>
        <div class="row mb-2"><div class="col-4 text-muted">Nom de scene</div><div class="col-8">{{ artiste.nomDeScene }}</div></div>
      </div>
      <div class="card-footer bg-white border-top d-flex justify-content-end gap-2 py-3">
        <button type="button" class="btn btn-primary btn-sm" [routerLink]="['/artistes/edit', artiste?.id]" [disabled]="!artiste?.id"><i class="bi bi-pencil-square"></i> Modifier</button>
        <button type="button" class="btn btn-danger btn-sm" [routerLink]="['/artistes/delete', artiste?.id]" [disabled]="!artiste?.id"><i class="bi bi-trash-fill"></i> Supprimer</button>
      </div>
    </div>
  `,
  styleUrl: './detail-artiste.css'
})
export class DetailArtiste implements OnInit {
  artiste: Artiste | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private artisteService: ArtisteApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.artisteService.getArtisteById(id).subscribe({
      next: (data) => {
        this.artiste = data;
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
    this.router.navigate(['/artistes']);
  }
}
