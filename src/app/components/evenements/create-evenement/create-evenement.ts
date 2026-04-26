import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { Evenement } from '../../../models/evenement';
import { TypeEvenementApiService } from '../../../services/type-evenement-api.service';
import { TypeEvenement } from '../../../models/type-evenement';
import { ArtisteApiService } from '../../../services/artiste-api.service';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Artiste } from '../../../models/artiste';
import { Organisateur } from '../../../models/organisateur';
import { forkJoin, of, catchError } from 'rxjs';

@Component({
  selector: 'app-create-evenement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-evenement.html',
  styleUrl: './create-evenement.css'
})
export class CreateEvenement implements OnInit {
  readonly form = this.fb.group({
    libelle: ['', Validators.required],
    lieu: ['', Validators.required],
    date: ['', Validators.required],
    capacite: [0, [Validators.required, Validators.min(1)]],
    description: ['', Validators.required],
    statut: ['CREE', Validators.required],
    typeEvenementId: [null as number | null, [Validators.required, Validators.min(1)]],
    typesPlace: [[] as string[]],
    artistesIds: [[] as number[]],
    organisateursIds: [[] as number[]]
  });

  isSubmitting = false;
  isLoading = true;
  typeEvenements: TypeEvenement[] = [];
  artistes: Artiste[] = [];
  organisateurs: Organisateur[] = [];
  readonly availableTypesPlace = ["VIP", "Standard", "Premium", "Gold", "Silver", "Loge", "Balcon", "Orchestre"];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private evenementService: EvenementApiService,
    private typeEvenementService: TypeEvenementApiService,
    private artisteService: ArtisteApiService,
    private organisateurService: OrganisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin({
      types: this.typeEvenementService.getTypeEvenements().pipe(catchError(() => of([]))),
      artistes: this.artisteService.getArtistes().pipe(catchError(() => of([]))),
      organisateurs: this.organisateurService.getOrganisateurs().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ types, artistes, organisateurs }) => {
        this.typeEvenements = types;
        this.artistes = artistes;
        this.organisateurs = organisateurs;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement données:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onTypePlaceChange(type: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentTypes = this.form.value.typesPlace || [];
    if (checkbox.checked) {
      this.form.patchValue({ typesPlace: [...currentTypes, type] });
    } else {
      this.form.patchValue({ typesPlace: currentTypes.filter(t => t !== type) });
    }
  }

  isTypePlaceSelected(type: string): boolean {
    return (this.form.value.typesPlace || []).includes(type);
  }

  onArtisteChange(id: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentIds = this.form.value.artistesIds || [];
    if (checkbox.checked) {
      this.form.patchValue({ artistesIds: [...currentIds, id] });
    } else {
      this.form.patchValue({ artistesIds: currentIds.filter(i => i !== id) });
    }
  }

  isArtisteSelected(id: number): boolean {
    return (this.form.value.artistesIds || []).includes(id);
  }

  onOrganisateurChange(id: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentIds = this.form.value.organisateursIds || [];
    if (checkbox.checked) {
      this.form.patchValue({ organisateursIds: [...currentIds, id] });
    } else {
      this.form.patchValue({ organisateursIds: currentIds.filter(i => i !== id) });
    }
  }

  isOrganisateurSelected(id: number): boolean {
    return (this.form.value.organisateursIds || []).includes(id);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    
    // Payload STRICTEMENT identique à l'exemple de succès de l'API
    const payload: any = {
      libelle: val.libelle,
      lieu: val.lieu,
      date: val.date,
      capacite: Number(val.capacite),
      description: val.description,
      statut: val.statut,
      typeEvenementId: Number(val.typeEvenementId),
      typesPlace: val.typesPlace || []
    };

    // Note : On ne peut pas envoyer 'artistes' ou 'participer' car le DTO EvenementDTO ne les contient pas

    // On ne met PAS artistesIds ou organisateursIds car le serveur les rejette
    
    this.isSubmitting = true;
    this.cdr.detectChanges();

    this.evenementService.createEvenement(payload).subscribe({
      next: () => {
        this.router.navigate(['/evenements'], { queryParams: { message: 'Événement créé avec succès', type: 'success' } });
      },
      error: (err) => {
        console.error('Erreur lors de la création :', err);
        this.isSubmitting = false;
        this.cdr.detectChanges();
        
        let msg = "Erreur lors de l'enregistrement.";
        if (err.status === 400) msg = "Données invalides (400 Bad Request). Vérifiez les champs.";
        alert(msg);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/evenements']);
  }
}
