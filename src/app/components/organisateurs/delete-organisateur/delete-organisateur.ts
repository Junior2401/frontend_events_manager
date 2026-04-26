import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Organisateur } from '../../../models/organisateur';

@Component({
  selector: 'app-delete-organisateur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-organisateur.html',
  styleUrl: './delete-organisateur.css'
})
export class DeleteOrganisateur implements OnInit {
  organisateur: Organisateur | null = null;
  isLoading = true;
  isSubmitting = false;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organisateurService: OrganisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.organisateurService.getOrganisateurById(this.id).subscribe({
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

  onDelete(): void {
    if (!this.id) {
      return;
    }
    this.isSubmitting = true;
    this.cdr.detectChanges();
    this.organisateurService.deleteOrganisateur(this.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
        this.router.navigate(['/organisateurs']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
