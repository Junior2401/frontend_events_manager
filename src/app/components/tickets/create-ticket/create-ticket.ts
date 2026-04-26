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
import { forkJoin, of, catchError } from 'rxjs';

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
    statut: ['ACHETE', Validators.required],
    evenementId: [0, [Validators.required, Validators.min(1)]],
    utilisateurId: [0, [Validators.required, Validators.min(1)]]
  });

  evenements: Evenement[] = [];
  utilisateurs: Utilisateur[] = [];
  selectedEventTypesPlace: string[] = [];
  isSubmitting = false;
  isLoading = true;
  errorMessage: string | null = null;

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
      this.evenements = evenements;
      this.utilisateurs = utilisateurs;
      this.isLoading = false;
      this.cdr.detectChanges();
    });

    // Mettre à jour la liste des types de places quand l'événement change
    this.form.get('evenementId')?.valueChanges.subscribe(id => {
      const ev = this.evenements.find(e => e.id === Number(id));
      this.selectedEventTypesPlace = ev?.typesPlace || [];
      this.cdr.detectChanges();
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as unknown as Ticket;
    this.isSubmitting = true;
    this.cdr.detectChanges();

    this.evenementService.getEvenementById(payload.evenementId).subscribe({
      next: (event) => {
        this.ticketService.getTicketsByEvenement(payload.evenementId).subscribe({
          next: (tickets) => {
            const ticketList = tickets || [];
            const vendus = ticketList.filter(t => t?.statut === 'ACHETE').length;
            if (vendus >= event.capacite && payload.statut === 'ACHETE') {
              this.errorMessage = `Désolé, cet événement est complet (${event.capacite} places maximum).`;
              this.isSubmitting = false;
              this.cdr.detectChanges();
            } else {
              this.proceedWithCreation(payload);
            }
          },
          error: () => {
            this.proceedWithCreation(payload);
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.proceedWithCreation(payload);
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
