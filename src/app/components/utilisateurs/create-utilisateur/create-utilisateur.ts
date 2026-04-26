import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Utilisateur } from '../../../models/utilisateur';

@Component({
  selector: 'app-create-utilisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-utilisateur.html',
  styleUrl: './create-utilisateur.css'
})
export class CreateUtilisateur {
  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required]
  });
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private utilisateurService: UtilisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as Utilisateur;
    this.isSubmitting = true;
    this.utilisateurService.createUtilisateur(payload).subscribe({
      next: () => {
        this.cdr.detectChanges();
        this.router.navigate(['/utilisateurs']);
      },
      error: (error) => {
        console.error('Erreur lors de la creation :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/utilisateurs']);
  }
}
