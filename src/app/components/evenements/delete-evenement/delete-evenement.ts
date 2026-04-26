import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { Evenement } from '../../../models/evenement';

@Component({
  selector: 'app-delete-evenement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-evenement.html',
  styleUrl: './delete-evenement.css'
})
export class DeleteEvenement implements OnInit {
  evenement: Evenement | null = null;
  isLoading = true;
  isSubmitting = false;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evenementService: EvenementApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.evenementService.getEvenementById(this.id).subscribe({
      next: (data) => {
        this.evenement = data;
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
    this.router.navigate(['/evenements']);
  }

  onDelete(): void {
    if (!this.id) {
      return;
    }
    this.isSubmitting = true;
    this.cdr.detectChanges();
    this.evenementService.deleteEvenement(this.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
        this.router.navigate(['/evenements'], { 
          queryParams: { message: 'Événement supprimé avec succès', type: 'success' } 
        });
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
        
        let errorMsg = 'Impossible de supprimer cet événement.';
        if (error.error && (typeof error.error === 'string' || error.error.message)) {
          errorMsg = typeof error.error === 'string' ? error.error : error.error.message;
        }
        
        this.router.navigate(['/evenements'], { 
          queryParams: { message: errorMsg, type: 'danger' } 
        });
      }
    });
  }
}
