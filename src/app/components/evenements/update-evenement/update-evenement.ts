import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { Evenement } from '../../../models/evenement';

@Component({
  selector: 'app-update-evenement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-evenement.html',
  styleUrl: './update-evenement.css'
})
export class UpdateEvenement implements OnInit {
  readonly form = this.fb.nonNullable.group({
    libelle: ['', Validators.required],
    lieu: ['', Validators.required],
    date: ['', Validators.required],
    capacite: [0, Validators.required],
    description: ['', Validators.required],
    statut: ['', Validators.required],
    typeEvenementId: [0, Validators.required]
  });

  id!: number;
  isLoading = true;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private evenementService: EvenementApiService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.evenementService.getEvenementById(this.id).subscribe({
      next: (data) => {
        this.form.patchValue({
          libelle: data.libelle,
          lieu: data.lieu,
          date: Array.isArray(data.date) ? `${data.date[0]}-${String(data.date[1]).padStart(2, '0')}-${String(data.date[2]).padStart(2, '0')}T${String(data.date[3] ?? 0).padStart(2, '0')}:${String(data.date[4] ?? 0).padStart(2, '0')}` : data.date,
          capacite: data.capacite,
          description: data.description,
          statut: data.statut,
          typeEvenementId: data.typeEvenementId
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as unknown as Evenement;
    this.isSubmitting = true;
    this.evenementService.updateEvenement(this.id, payload).subscribe({
      next: () => this.router.navigate(['/evenements']),
      error: (error) => {
        console.error('Erreur lors de la mise a jour :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/evenements']);
  }
}
