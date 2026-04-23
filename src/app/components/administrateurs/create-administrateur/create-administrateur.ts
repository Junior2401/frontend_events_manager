import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministrateurApiService } from '../../../services/administrateur-api.service';
import { Administrateur } from '../../../models/administrateur';

@Component({
  selector: 'app-create-administrateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-administrateur.html',
  styleUrl: './create-administrateur.css'
})
export class CreateAdministrateur implements OnInit {
  readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', [Validators.required]]
  });

  isSubmitting = false;
  isLoading = false;
  isEditMode = false;
  currentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private administrateurService: AdministrateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const parsedId = idParam ? Number(idParam) : Number.NaN;

    if (!Number.isNaN(parsedId)) {
      this.isEditMode = true;
      this.currentId = parsedId;
      this.loadAdministrateur(parsedId);
    }
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Modifier Administrateur' : 'Nouveau Administrateur';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Administrateur = {
      nom: this.form.controls.nom.value.trim(),
      prenom: this.form.controls.prenom.value.trim(),
      email: this.form.controls.email.value.trim(),
      role: this.form.controls.role.value.trim()
    };

    this.isSubmitting = true;

    if (this.isEditMode && this.currentId !== null) {
      this.administrateurService.updateAdministrateur(this.currentId, payload).subscribe({
        next: () => this.router.navigate(['/administrateurs']),
        error: (error: unknown) => {
          console.error('Erreur lors de la mise a jour :', error);
          this.isSubmitting = false;
        }
      });
      return;
    }

    this.administrateurService.createAdministrateur(payload).subscribe({
      next: () => this.router.navigate(['/administrateurs']),
      error: (error: unknown) => {
        console.error('Erreur lors de la creation :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/administrateurs']);
  }

  private loadAdministrateur(id: number): void {
    this.isLoading = true;
    this.administrateurService.getAdministrateurById(id).subscribe({
      next: (administrateur) => {
        this.form.patchValue({
          nom: administrateur.nom,
          prenom: administrateur.prenom,
          email: administrateur.email,
          role: administrateur.role
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
