import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeEvenementApiService } from '../../../services/type-evenement-api.service';
import { TypeEvenement } from '../../../models/type-evenement';

@Component({
  selector: 'app-create-type-evenement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-type-evenement.html',
  styleUrl: './create-type-evenement.css',
})
export class CreateTypeEvenement implements OnInit {
  readonly form = this.fb.nonNullable.group({
    libelle: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(500)]]
  });

  isSubmitting = false;
  isLoading = false;
  isEditMode = false;
  currentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private typeEvenementService: TypeEvenementApiService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const parsedId = idParam ? Number(idParam) : Number.NaN;

    if (!Number.isNaN(parsedId)) {
      this.isEditMode = true;
      this.currentId = parsedId;
      this.loadTypeEvenement(parsedId);
    }
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Modifier Type Evenement' : 'Nouveau Type Evenement';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: TypeEvenement = {
      libelle: this.form.controls.libelle.value.trim(),
      description: this.form.controls.description.value.trim()
    };

    this.isSubmitting = true;

    if (this.isEditMode && this.currentId !== null) {
      this.typeEvenementService.updateTypeEvenement(this.currentId, payload).subscribe({
        next: () => this.router.navigate(['/type-evenements']),
        error: (error: unknown) => {
          console.error('Erreur lors de la mise a jour :', error);
          this.isSubmitting = false;
        }
      });
      return;
    }

    this.typeEvenementService.createTypeEvenement(payload).subscribe({
      next: () => this.router.navigate(['/type-evenements']),
      error: (error: unknown) => {
        console.error('Erreur lors de la creation :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/type-evenements']);
  }

  private loadTypeEvenement(id: number): void {
    this.isLoading = true;
    this.typeEvenementService.getTypeEvenementById(id).subscribe({
      next: (typeEvenement) => {
        this.form.patchValue({
          libelle: typeEvenement.libelle,
          description: typeEvenement.description
        });
        this.isLoading = false;
      },
      error: (error: unknown) => {
        console.error('Erreur lors du chargement :', error);
        this.isLoading = false;
      }
    });
  }
}
