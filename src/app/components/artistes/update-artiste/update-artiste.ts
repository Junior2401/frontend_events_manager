import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtisteApiService } from '../../../services/artiste-api.service';
import { Artiste } from '../../../models/artiste';

@Component({
  selector: 'app-update-artiste',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-artiste.html',
  styleUrl: './update-artiste.css'
})
export class UpdateArtiste implements OnInit {

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
    styleArtistique: ['', Validators.required]
  });

  isLoading = true;
  isSubmitting = false;
  artisteId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private artisteService: ArtisteApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.artisteId = Number(this.route.snapshot.paramMap.get('id'));

    this.artisteService.getArtisteById(this.artisteId).subscribe({
      next: (artiste) => {
        this.form.patchValue(artiste);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement artiste :', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as Artiste;

    this.isSubmitting = true;
    this.cdr.detectChanges();

    this.artisteService.updateArtiste(this.artisteId, payload).subscribe({
      next: () => this.router.navigate(['/artistes']),
      error: (error) => {
        console.error('Erreur lors de la mise à jour :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/artistes']);
  }
}
