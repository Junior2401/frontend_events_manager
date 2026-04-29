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
      evenement: this.evenementService.getEvenementById(this.id).pipe(catchError(err => {
        console.error('Erreur lors du chargement de l\'événement:', err);
        return of(null);
      })),
      evenementArtistes: this.evenementService.getArtistesByEvenement(this.id).pipe(catchError(() => of([]))),
      evenementOrganisateurs: this.evenementService.getOrganisateursByEvenement(this.id).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ types, artistes, organisateurs, evenement, evenementArtistes, evenementOrganisateurs }) => {
        if (!evenement) {
          console.error('Événement non trouvé');
          this.router.navigate(['/evenements']);
          return;
        }

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

        console.log('Loaded relations for update:', { artists: artistesIds, organizers: organisateursIds });

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
    const currentIds = (this.form.value.artistesIds || []).filter((val: any) => val != null && val > 0);
    if (checkbox.checked) {
      this.form.patchValue({ artistesIds: [...currentIds, id] });
    } else {
      this.form.patchValue({ artistesIds: currentIds.filter(i => i !== id) });
    }
  }

  isArtisteSelected(id: number): boolean {
    const artistesIds = (this.form.value.artistesIds || []).filter((val: any) => val != null && val > 0);
    return artistesIds.includes(id);
  }

  onOrganisateurChange(id: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentIds = (this.form.value.organisateursIds || []).filter((val: any) => val != null && val > 0);
    if (checkbox.checked) {
      this.form.patchValue({ organisateursIds: [...currentIds, id] });
    } else {
      this.form.patchValue({ organisateursIds: currentIds.filter(i => i !== id) });
    }
  }

  isOrganisateurSelected(id: number): boolean {
    const organisateursIds = (this.form.value.organisateursIds || []).filter((val: any) => val != null && val > 0);
    return organisateursIds.includes(id);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const dateVal = val.date ? String(val.date).substring(0, 19) : null;

    const payload: any = {
      id: this.id,
      libelle: val.libelle,
      lieu: val.lieu,
      date: dateVal,
      capacite: Number(val.capacite),
      description: val.description,
      statut: val.statut,
      typeEvenementId: Number(val.typeEvenementId),
      typesPlace: val.typesPlace || []
    };

    this.isSubmitting = true;
    this.cdr.detectChanges();

    console.log('Updating event:', payload.libelle);

    this.evenementService.updateEvenement(this.id, payload).subscribe({
      next: () => {
        console.log('Event updated successfully');

        // Gérer les changements des relations
        const currentArtistesIds = (val.artistesIds || []).filter((id: any) => id != null && id > 0);
        const currentOrganisateursIds = (val.organisateursIds || []).filter((id: any) => id != null && id > 0);

        console.log('Relations change summary:');
        console.log('  Artists: from', this.previousArtistesIds, '→', currentArtistesIds);
        console.log('  Organizers: from', this.previousOrganisateursIds, '→', currentOrganisateursIds);

        const relationsTasks: Observable<any>[] = [];

        // Artistes à supprimer
        this.previousArtistesIds.forEach(id => {
          if (!currentArtistesIds.includes(id)) {
            console.log('🗑Removing artist:', id);
            relationsTasks.push(
              this.evenementService.removeArtisteFromEvenement(this.id, id)
                .pipe(catchError(err => {
                  console.error(`Error removing artist ${id}:`, err);
                  return of(null);
                }))
            );
          }
        });

        // Artistes à ajouter
        currentArtistesIds.forEach((id: number) => {
          if (!this.previousArtistesIds.includes(id)) {
            console.log('Adding artist:', id);
            relationsTasks.push(
              this.evenementService.addArtisteToEvenement(this.id, id)
                .pipe(catchError(err => {
                  console.error(`Error adding artist ${id}:`, err);
                  return of(null);
                }))
            );
          }
        });

        // Organisateurs à supprimer
        this.previousOrganisateursIds.forEach(id => {
          if (!currentOrganisateursIds.includes(id)) {
            console.log('🗑Removing organizer:', id);
            relationsTasks.push(
              this.evenementService.removeOrganisateurFromEvenement(this.id, id)
                .pipe(catchError(err => {
                  console.error(`Error removing organizer ${id}:`, err);
                  return of(null);
                }))
            );
          }
        });

        // Organisateurs à ajouter
        currentOrganisateursIds.forEach((id: number) => {
          if (!this.previousOrganisateursIds.includes(id)) {
            console.log('Adding organizer:', id);
            relationsTasks.push(
              this.evenementService.addOrganisateurToEvenement(this.id, id)
                .pipe(catchError(err => {
                  console.error(`Error adding organizer ${id}:`, err);
                  return of(null);
                }))
            );
          }
        });

        console.log(`Processing ${relationsTasks.length} relation changes...`);

        if (relationsTasks.length > 0) {
          forkJoin(relationsTasks).subscribe({
            next: () => {
              console.log('All relations updated successfully!');
              this.router.navigate(['/evenements'], { queryParams: { message: 'Événement mi à jour avec succès', type: 'success' } });
            },
            error: (err) => {
              console.error('Error updating relations:', err);
              this.router.navigate(['/evenements'], { queryParams: { message: 'Événement mis à jour (certaines relations en erreur)', type: 'warning' } });
            }
          });
        } else {
          console.log('ℹNo relation changes to apply');
          this.router.navigate(['/evenements'], { queryParams: { message: 'Événement mis à jour avec succès', type: 'success' } });
        }
      },
      error: (err) => {
        console.error('Error updating event:', err);
        this.isSubmitting = false;
        this.cdr.detectChanges();
        alert('Erreur lors de la mise à jour de l\'événement');
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/evenements']);
  }
}
