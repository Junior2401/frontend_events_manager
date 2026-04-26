import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Utilisateur } from '../../../models/utilisateur';

@Component({
  selector: 'app-delete-utilisateur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-utilisateur.html',
  styleUrl: './delete-utilisateur.css'
})
export class DeleteUtilisateur implements OnInit {
  utilisateur: Utilisateur | null = null;
  isLoading = true;
  isSubmitting = false;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilisateurService: UtilisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.utilisateurService.getUtilisateurById(this.id).subscribe({
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

  onDelete(): void {
    if (!this.id) {
      return;
    }
    this.isSubmitting = true;
    this.cdr.detectChanges();
    this.utilisateurService.deleteUtilisateur(this.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
        this.router.navigate(['/utilisateurs'], {
          queryParams: { message: 'Utilisateur supprimé avec succès', type: 'success' }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();

        let errorMsg = 'Impossible de supprimer cet utilisateur.';
        if (error.error && (typeof error.error === 'string' || error.error.message)) {
          errorMsg = typeof error.error === 'string' ? error.error : error.error.message;
        }

        this.router.navigate(['/utilisateurs'], {
          queryParams: { message: errorMsg, type: 'danger' }
        });
      }
    });
  }
}
