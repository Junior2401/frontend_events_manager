import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministrateurApiService } from '../../../services/administrateur-api.service';
import { Administrateur } from '../../../models/administrateur';

@Component({
  selector: 'app-update-administrateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-administrateur.html',
  styleUrls: ['./update-administrateur.css']
})
export class UpdateAdministrateur implements OnInit {
  readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', [Validators.required]]
  });

  id!: number;
  isLoading = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private administrateurService: AdministrateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(this.id);
  }

  loadData(id: number): void {
    this.isLoading = true;
    this.administrateurService.getAdministrateurById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
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

    const payload: Administrateur = {
      nom: this.form.controls.nom.value.trim(),
      prenom: this.form.controls.prenom.value.trim(),
      email: this.form.controls.email.value.trim(),
      role: this.form.controls.role.value.trim()
    };

    this.isSubmitting = true;
    this.administrateurService.updateAdministrateur(this.id, payload).subscribe({
      next: () => this.router.navigate(['/administrateurs']),
      error: (error) => {
        console.error('Erreur lors de la mise a jour :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/administrateurs']);
  }
}
