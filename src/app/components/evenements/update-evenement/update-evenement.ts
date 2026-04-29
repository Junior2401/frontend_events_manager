import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { Evenement } from '../../../models/evenement';
import { TypeEvenementApiService } from '../../../services/type-evenement-api.service';
import { TypeEvenement } from '../../../models/type-evenement';
import { ArtisteApiService } from '../../../services/artiste-api.service';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Artiste } from '../../../models/artiste';
import { Organisateur } from '../../../models/organisateur';
import { forkJoin, of, catchError, Observable } from 'rxjs';

@Component({
  selector: 'app-update-evenement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-evenement.html',
  styleUrl: './update-evenement.css'
})
export class UpdateEvenement implements OnInit {
  readonly form = this.fb.group({
    libelle: ['', Validators.required],
    lieu: ['', Validators.required],
    date: ['', Validators.required],
    capacite: [0, [Validators.required, Validators.min(1)]],
    description: ['', Validators.required],
    statut: ['', Validators.required],
    typeEvenementId: [null as number | null, [Validators.required, Validators.min(1)]],
    typesPlace: [[] as string[]],
    artistesIds: [[] as number[]],
    organisateursIds: [[] as number[]]
  });

  id!: number;
  isLoading = true;
  isSubmitting = false;
  typeEvenements: TypeEvenement[] = [];
  artistes: Artiste[] = [];
  organisateurs: Organisateur[] = [];
  previousArtistesIds: number[] = [];
  previousOrganisateursIds: number[] = [];
  readonly availableTypesPlace = ["VIP", "Standard", "Premium", "Gold", "Silver", "Loge", "Balcon", "Orchestre"];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private evenementService: EvenementApiService,
    private typeEvenementService: TypeEvenementApiService,
    private artisteService: ArtisteApiService,
    private organisateurService: OrganisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      types: this.typeEvenementService.getTypeEvenements().pipe(catchError(() => of([]))),
      artistes: this.artisteService.getArtistes().pipe(catchError(() => of([]))),
      organisateurs: this.organisateurService.getOrganisateurs().pipe(catchError(() => of([]))),
      evenement: this.evenementService.getEvenementById(this.id),
      evenementArtistes: this.evenementService.getArtistesByEvenement(this.id).pipe(catchError(() => of([]))),
      evenementOrganisateurs: this.evenementService.getOrganisateursByEvenement(this.id).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ types, artistes, organisateurs, evenement, evenementArtistes, evenementOrganisateurs }) => {
        this.typeEvenements = types;
        this.artistes = artistes;
        this.organisateurs = organisateurs;

        let formattedDate = '';
        if (Array.isArray(evenement.date)) {
          formattedDate = `${evenement.date[0]}-${String(evenement.date[1]).padStart(2, '0')}-${String(evenement.date[2]).padStart(2, '0')}T${String(evenement.date[3] ?? 0).padStart(2, '0')}:${String(evenement.date[4] ?? 0).padStart(2, '0')}`;
        } else if (evenement.date) {
          formattedDate = String(evenement.date).substring(0, 16);
        }

        const artistesIds = (evenementArtistes || []).map(a => a.id!);
        const organisateursIds = (evenementOrganisateurs || []).map(o => o.id!);

        this.previousArtistesIds = [...artistesIds];
        this.previousOrganisateursIds = [...organisateursIds];

        this.form.patchValue({
          libelle: evenement.libelle,
          lieu: evenement.lieu,
          date: formattedDate,
          capacite: evenement.capacite,
          description: evenement.description,
          statut: evenement.statut,
          typeEvenementId: evenement.typeEvenementId,
          typesPlace: evenement.typesPlace || [],
          artistesIds: artistesIds,
          organisateursIds: organisateursIds
        });

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

    const payload: any = {
      id: this.id,
      libelle: val.libelle,
      lieu: val.lieu,
      date: val.date,
      capacite: Number(val.capacite),
      description: val.description,
      statut: val.statut,
      typeEvenementId: Number(val.typeEvenementId),
      typesPlace: val.typesPlace || [],
      artistesIds: val.artistesIds || [],
      organisateursIds: val.organisateursIds || []
    };

    this.isSubmitting = true;
    this.cdr.detectChanges();

    this.evenementService.updateEvenement(this.id, payload).subscribe({
      next: () => {
        // Gérer les changements des relations
        const currentArtistesIds = val.artistesIds || [];
        const currentOrganisateursIds = val.organisateursIds || [];

        const relationsTasks: Observable<any>[] = [];

        // Artistes à supprimer
        this.previousArtistesIds.forEach(id => {
          if (!currentArtistesIds.includes(id)) {
            relationsTasks.push(
              this.evenementService.removeArtisteFromEvenement(this.id, id)
                .pipe(catchError(err => {
                  console.error(`Erreur suppression artiste ${id}:`, err);
                  return of(null);
                }))
            );
          }
        });

        // Artistes à ajouter
        currentArtistesIds.forEach((id: number) => {
          if (!this.previousArtistesIds.includes(id)) {
            relationsTasks.push(
              this.evenementService.addArtisteToEvenement(this.id, id)
                .pipe(catchError(err => {
                  console.error(`Erreur ajout artiste ${id}:`, err);
                  return of(null);
                }))
            );
          }
        });

        // Organisateurs à supprimer
        this.previousOrganisateursIds.forEach(id => {
          if (!currentOrganisateursIds.includes(id)) {
            relationsTasks.push(
              this.evenementService.removeOrganisateurFromEvenement(this.id, id)
                .pipe(catchError(err => {
                  console.error(`Erreur suppression organisateur ${id}:`, err);
                  return of(null);
                }))
            );
          }
        });

        // Organisateurs à ajouter
        currentOrganisateursIds.forEach((id: number) => {
          if (!this.previousOrganisateursIds.includes(id)) {
            relationsTasks.push(
              this.evenementService.addOrganisateurToEvenement(this.id, id)
                .pipe(catchError(err => {
                  console.error(`Erreur ajout organisateur ${id}:`, err);
                  return of(null);
                }))
            );
          }
        });

        if (relationsTasks.length > 0) {
          forkJoin(relationsTasks).subscribe({
            next: () => {
              this.router.navigate(['/evenements'], { queryParams: { message: 'Événement mis à jour avec succès', type: 'success' } });
            },
            error: () => {
              this.router.navigate(['/evenements'], { queryParams: { message: 'Événement mis à jour (certaines relations non mises à jour)', type: 'warning' } });
            }
          });
        } else {
          this.router.navigate(['/evenements'], { queryParams: { message: 'Événement mis à jour avec succès', type: 'success' } });
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
        this.isSubmitting = false;
        this.cdr.detectChanges();
        alert('Erreur lors de la mise à jour (400 Bad Request probable).');
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/evenements']);
  }
}
