import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Organisateur } from '../../../models/organisateur';

@Component({
  selector: 'app-update-organisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-organisateur.html',
  styleUrl: './update-organisateur.css'
})
export class UpdateOrganisateur implements OnInit {
  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    societe: ['', Validators.required],
    telephonePro: ['', Validators.required]
  });
  id!: number;
  isLoading = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private organisateurService: OrganisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.organisateurService.getOrganisateurById(this.id).subscribe({
      next: (data) => {
        this.form.patchValue({ nom: data.nom, prenom: data.prenom, email: data.email, societe: data.societe, telephonePro: data.telephonePro });
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as Organisateur;
    this.isSubmitting = true;
    this.organisateurService.updateOrganisateur(this.id, payload).subscribe({
      next: () => this.router.navigate(['/organisateurs']),
      error: (error) => {
        console.error('Erreur lors de la mise a jour :', error);
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/organisateurs']);
  }
}
