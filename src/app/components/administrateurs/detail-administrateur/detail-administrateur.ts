import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdministrateurApiService } from '../../../services/administrateur-api.service';
import { Administrateur } from '../../../models/administrateur';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-detail-administrateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './detail-administrateur.html',
  styleUrl: './detail-administrateur.css'
})
export class DetailAdministrateur implements OnInit {
  administrateur: Administrateur | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private administrateurService: AdministrateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(id);
  }

  loadData(id: number): void {
    this.isLoading = true;
    this.administrateurService.getAdministrateurById(id).subscribe({
      next: (data) => {
        this.administrateur = data;
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
    this.router.navigate(['/administrateurs']);
  }

  getRoleBadge(role: string): { label: string; class: string; icon: string } {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'Super Admin', class: 'bg-danger text-white', icon: 'bi bi-award-fill' };
      case 'ADMIN':
        return { label: 'Administrateur', class: 'bg-danger-subtle text-danger', icon: 'bi bi-shield-lock-fill' };
      case 'MANAGER':
        return { label: 'Manager', class: 'bg-primary-subtle text-primary', icon: 'bi bi-briefcase-fill' };
      case 'USER':
        return { label: 'Utilisateur', class: 'bg-success-subtle text-success', icon: 'bi bi-person-fill' };
      case 'VIEWER':
        return { label: 'Lecteur', class: 'bg-secondary-subtle text-secondary', icon: 'bi bi-eye-fill' };
      default:
        return { label: role, class: 'bg-light text-muted', icon: 'bi bi-question-circle' };
    }
  }

}
