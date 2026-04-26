import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Organisateur } from '../../../models/organisateur';

@Component({
  selector: 'app-create-organisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './create-organisateur.html',
  styleUrl: './create-organisateur.css'
})
export class CreateOrganisateur {
  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    societe: ['', Validators.required],
    telephonePro: ['', Validators.required]
  });
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private organisateurService: OrganisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as Organisateur;
    this.isSubmitting = true;
    this.organisateurService.createOrganisateur(payload).subscribe({
      next: () => this.router.navigate(['/organisateurs']),
      error: (error) => {
        console.error('Erreur lors de la creation :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/organisateurs']);
  }
}
