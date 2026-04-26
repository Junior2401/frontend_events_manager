import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArtisteApiService } from '../../../services/artiste-api.service';
import { Artiste } from '../../../models/artiste';

@Component({
  selector: 'app-create-artiste',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-artiste.html',
  styleUrl: './create-artiste.css'
})
export class CreateArtiste {

  stylesArtistiques = [
    'Afrobeat', 'RnB', 'Hip-Hop', 'Pop', 'Traditionnel',
    'Classique', 'Jazz', 'Gospel', 'Soul', 'Funk',
    'Slam', 'Reggae', 'Dancehall', 'Electro'
  ];

  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    nomDeScene: ['', Validators.required],
    styleArtistique: ['', Validators.required]   // <-- UN SEUL CHOIX
  });

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private artisteService: ArtisteApiService,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as Artiste;

    this.isSubmitting = true;

    this.artisteService.createArtiste(payload).subscribe({
      next: () => this.router.navigate(['/artistes']),
      error: (error) => {
        console.error('Erreur lors de la création :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/artistes']);
  }
}
