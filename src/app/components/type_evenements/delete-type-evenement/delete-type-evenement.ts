import { Component, OnInit } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeEvenementApiService } from '../../../services/type-evenement-api.service';
import { TypeEvenement } from '../../../models/type-evenement';

@Component({
  selector: 'app-delete-type-evenement',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './delete-type-evenement.html',
  styleUrl: './delete-type-evenement.css',
})
export class DeleteTypeEvenement implements OnInit {

  typeEvenement: TypeEvenement | null = null;
  isLoading = true;
  isSubmitting = false;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private typeEvenementService: TypeEvenementApiService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(this.id);
  }

  loadData(id: number): void {
    this.isLoading = true;

    this.typeEvenementService.getTypeEvenementById(id).subscribe({
      next: (data) => {
        this.typeEvenement = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/type-evenements']);
  }

  onDelete(): void {
    if (!this.id) return;

    this.isSubmitting = true;

    this.typeEvenementService.deleteTypeEvenement(this.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/type-evenements']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.isSubmitting = false;
      }
    });
  }
}

