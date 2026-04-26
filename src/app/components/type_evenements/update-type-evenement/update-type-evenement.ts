import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {TypeEvenementApiService} from '../../../services/type-evenement-api.service';
import {TypeEvenement} from '../../../models/type-evenement';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-update-type-evenement',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './update-type-evenement.html',
  styleUrl: './update-type-evenement.css',
})
export class UpdateTypeEvenement implements OnInit {
  readonly form = this.fb.nonNullable.group({
    libelle: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(500)]]
  });

  typeEvenement: TypeEvenement | null = null;
  typeEvenements: TypeEvenement[] | null = null;
  id!: number;

  isSubmitting = false;
  isLoading = true;
  isEditMode = false;
  currentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private typeEvenementService: TypeEvenementApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loadData(this.id);
    }else {
      this.loadData();
    }

    if (!Number.isNaN(this.id)) {
      this.isEditMode = true;
      this.currentId = this.id;
      this.loadTypeEvenement(this.id);
    }
  }

  loadData(id?: number | null): void {
    this.isLoading = true;
    if(id == null){
      this.typeEvenementService.getTypeEvenements().subscribe({
        next: (data) => {
          this.typeEvenements = data ?? [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur API:', err);
          this.typeEvenements = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }else {
      this.typeEvenementService.getTypeEvenementById(id).subscribe({
        next: (data) => {
          this.typeEvenement = data;
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

  }

  onDelete(id?: number): void {
    if (!id) {
      return;
    }

    if (!confirm('Confirmer la suppression ?')) {
      return;
    }

    this.typeEvenementService.deleteTypeEvenement(id).subscribe({
      next: () => {
        this.loadData();
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Erreur lors de la suppression :', error);
        this.cdr.detectChanges();
      }
    });
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
    this.cdr.detectChanges();

    if (this.isEditMode && this.currentId !== null) {
      this.typeEvenementService.updateTypeEvenement(this.currentId, payload).subscribe({
        next: () => this.router.navigate(['/type-evenements']),
        error: (error: unknown) => {
          console.error('Erreur lors de la mise a jour :', error);
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    this.typeEvenementService.createTypeEvenement(payload).subscribe({
      next: () => this.router.navigate(['/type-evenements']),
      error: (error: unknown) => {
        console.error('Erreur lors de la creation :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Erreur lors du chargement :', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
