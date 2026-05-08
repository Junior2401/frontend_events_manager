import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketApiService } from '../../../services/ticket-api.service';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Ticket } from '../../../models/ticket';
import { Evenement } from '../../../models/evenement';
import { Utilisateur } from '../../../models/utilisateur';
import { forkJoin, of, catchError, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css'
})
export class CreateTicket implements OnInit {
  readonly form = this.fb.nonNullable.group({
    numeroPlace: ['', Validators.required],
    place: ['', Validators.required], // Sera le type de place sélectionné
    prix: [0, [Validators.required, Validators.min(0)]],
    statut: [{ value: 'ACHETE', disabled: true }, Validators.required],
    evenementId: [0, [Validators.required, Validators.min(1)]],
    utilisateurId: [0, [Validators.required, Validators.min(1)]]
  });

  evenements: Evenement[] = [];
  utilisateurs: Utilisateur[] = [];
  selectedEventTypesPlace: string[] = [];
  isSubmitting = false;
  isLoading = true;
  errorMessage: string | null = null;

  // Prix par type de place (Harmonisé avec la billetterie publique)
  private readonly pricesMap: Record<string, number> = {
    'VIP': 150,
    'PREMIUM': 100,
    'GOLD': 120,
    'SILVER': 80,
    'STANDARD': 50,
    'LOGE': 200,
    'BALCON': 75,
    'ORCHESTRE': 90
  };

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private ticketService: TicketApiService,
    private evenementService: EvenementApiService,
    private utilisateurService: UtilisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin({
      evenements: this.evenementService.getEvenements().pipe(catchError(() => of([]))),
      utilisateurs: this.utilisateurService.getUtilisateurs().pipe(catchError(() => of([])))
    }).subscribe(({ evenements, utilisateurs }) => {
      this.evenements = evenements || [];
      this.utilisateurs = utilisateurs || [];
      this.isLoading = false;
      this.cdr.detectChanges();
    });

    // Mettre à jour la liste des types de places quand l'événement change
    this.form.get('evenementId')?.valueChanges.subscribe(id => {
      const numericId = Number(id);
      const ev = this.evenements.find(e => e.id === numericId);
      this.selectedEventTypesPlace = ev?.typesPlace || [];
      this.cdr.detectChanges();
    });

    // Mettre à jour le prix quand le type de place change
    this.form.get('place')?.valueChanges.subscribe(placeType => {
      if (placeType) {
        const upperType = String(placeType).toUpperCase();
        const foundPrice = this.pricesMap[upperType];
        if (foundPrice) {
          this.form.patchValue({ prix: foundPrice });
        } else {
          // Prix par défaut si non trouvé
          this.form.patchValue({ prix: 50 });
        }
      } else {
        this.form.patchValue({ prix: 0 });
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = "Certains champs obligatoires sont manquants.";
      return;
    }

    const payload = this.form.getRawValue() as any;
    const evenementId = Number(payload.evenementId);
    const utilisateurId = Number(payload.utilisateurId);

    if (!evenementId || !utilisateurId) {
      this.errorMessage = "Veuillez sélectionner un événement et un utilisateur.";
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();

    this.evenementService.getEvenementById(evenementId).pipe(
      catchError(err => {
        console.error('Erreur event fetch:', err);
        return of({ capacite: 9999 } as any); // Fallback si l'event fetch échoue
      }),
      switchMap(event => {
        return this.ticketService.getTicketsByEvenement(evenementId).pipe(
          catchError(() => of([])),
          switchMap(tickets => {
            const ticketList = tickets || [];
            const vendus = ticketList.filter(t => t?.statut === 'ACHETE').length;
            
            if (event.capacite > 0 && vendus >= event.capacite && payload.statut === 'ACHETE') {
              throw new Error("COMPLET");
            }
            
            const ticketPayload: Ticket = {
              numeroPlace: payload.numeroPlace,
              place: payload.place,
              prix: Number(payload.prix),
              statut: payload.statut,
              evenementId: evenementId,
              utilisateurId: utilisateurId
            };
            return this.ticketService.createTicket(ticketPayload);
          })
        );
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/tickets'], { queryParams: { message: 'Ticket émis avec succès', type: 'success' } });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Erreur émission ticket:', err);
        if (err.message === "COMPLET") {
          this.errorMessage = "Désolé, cet événement est complet.";
        } else {
          this.errorMessage = "Erreur serveur : " + (err.error?.message || err.message || "Enregistrement impossible");
        }
        this.cdr.detectChanges();
      }
    });
  }

  private proceedWithCreation(payload: Ticket): void {
    const cleanedPayload = { ...payload };
    delete cleanedPayload.evenementLibelle;
    delete cleanedPayload.utilisateurNomComplet;
    delete cleanedPayload.evenement;
    delete cleanedPayload.utilisateur;

    this.ticketService.createTicket(cleanedPayload).subscribe({
      next: () => {
        this.router.navigate(['/tickets'], { queryParams: { message: 'Ticket acheté avec succès', type: 'success' } });
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la creation :', error);
        this.errorMessage = "Une erreur est survenue lors de l'enregistrement.";
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(date: any): string {
    if (!date) return '';
    if (Array.isArray(date)) {
      const [year, month, day, hour, minute] = date;
      return `${this.pad(day)}/${this.pad(month)}/${year} ${this.pad(hour)}:${this.pad(minute)}`;
    }
    const d = new Date(date);
    return `${this.pad(d.getDate())}/${this.pad(d.getMonth() + 1)}/${d.getFullYear()} ${this.pad(d.getHours())}:${this.pad(d.getMinutes())}`;
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return '';
    return phone.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  onBack(): void {
    this.router.navigate(['/tickets']);
  }
}
