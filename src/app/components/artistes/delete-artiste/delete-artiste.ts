import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtisteApiService } from '../../../services/artiste-api.service';
import { Artiste } from '../../../models/artiste';

@Component({
  selector: 'app-delete-artiste',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-artiste.html',
  styleUrl: './delete-artiste.css'
})
export class DeleteArtiste implements OnInit {
  artiste: Artiste | null = null;
  isLoading = true;
  isSubmitting = false;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private artisteService: ArtisteApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = Number(params['id']);
      if (!isNaN(this.id)) {
        this.loadData();
      } else {
        console.error('ID invalide');
        this.router.navigate(['/artistes']);
      }
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.artisteService.getArtisteById(this.id).subscribe({
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

  onDelete(): void {
    console.log('Tentative de suppression de l\'artiste avec l\'ID :', this.id);
    if (!this.id) {
      console.warn('ID manquant pour la suppression');
      return;
    }
    this.isSubmitting = true;
    this.cdr.detectChanges();

    this.artisteService.deleteArtiste(this.id).subscribe({
      next: () => {
        console.log('Suppression réussie');
        this.isSubmitting = false;
        this.cdr.detectChanges();
        this.router.navigate(['/artistes'], { 
          queryParams: { message: 'Artiste supprimé avec succès', type: 'success' } 
        });
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
        
        let errorMsg = 'Impossible de supprimer cet artiste.';
        
        // Si l'API renvoie un message spécifique (ex: contrainte d'intégrité)
        if (error.error && typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.error && error.error.message) {
          errorMsg = error.error.message;
        } else if (error.status === 409 || error.status === 500) {
          errorMsg = 'Impossible de supprimer cet artiste car il est lié à d\'autres données.';
        }
        
        this.router.navigate(['/artistes'], { 
          queryParams: { message: errorMsg, type: 'danger' } 
        });
      }
    });
  }
}
