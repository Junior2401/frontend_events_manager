import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketApiService } from '../../../services/ticket-api.service';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Ticket } from '../../../models/ticket';
import { Evenement } from '../../../models/evenement';
import { Utilisateur } from '../../../models/utilisateur';
import { forkJoin, of, catchError, switchMap } from 'rxjs';

@Component({
  selector: 'app-achat-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './achat-ticket.html',
  styleUrl: './achat-ticket.css'
})
export class AchatTicket implements OnInit {
  readonly form = this.fb.nonNullable.group({
    evenementId: [0, [Validators.required, Validators.min(1)]],
    // Informations utilisateur au lieu d'un ID
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],

    place: ['', Validators.required],
    prix: [0, [Validators.required, Validators.min(1)]],
    numeroPlace: ['', Validators.required],
    statut: ['ACHETE']
  });

  evenements: Evenement[] = [];
  selectedEvenement: Evenement | null = null;
  isSubmitting = false;
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Prix simulés par type de place
  private readonly prices: Record<string, number> = {
    'VIP': 150,
    'Premium': 100,
    'Gold': 120,
    'Silver': 80,
    'Standard': 50,
    'Loge': 200,
    'Balcon': 75,
    'Orchestre': 90
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketApiService,
    private evenementService: EvenementApiService,
    private utilisateurService: UtilisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const eventIdParam = this.route.snapshot.params['eventId'];

    this.evenementService.getEvenements().pipe(
      catchError(() => of([]))
    ).subscribe((evenements) => {
      this.evenements = evenements;

      if (eventIdParam) {
        const id = Number(eventIdParam);
        this.form.patchValue({ evenementId: id });
        this.onEvenementChange(id);
      }

      this.isLoading = false;
      this.cdr.detectChanges();
    });

    // Surveiller les changements de type de place pour mettre à jour le prix
    this.form.get('place')?.valueChanges.subscribe(type => {
      if (type && this.prices[type]) {
        this.form.patchValue({ prix: this.prices[type] });
      }
    });
  }

  onEvenementChange(id: number): void {
    this.selectedEvenement = this.evenements.find(e => e.id === Number(id)) || null;
    // Reset place and price when event changes
    this.form.patchValue({ place: '', prix: 0, numeroPlace: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.cdr.detectChanges();

    const val = this.form.getRawValue();

    // 1. Créer l'utilisateur d'abord
    const userPayload: Utilisateur = {
      nom: val.nom,
      prenom: val.prenom,
      email: val.email,
      telephone: val.telephone
    };

    this.utilisateurService.createUtilisateur(userPayload).pipe(
      switchMap(user => {
        // 2. Créer le ticket avec l'ID utilisateur obtenu
        const ticketPayload: Ticket = {
          numeroPlace: val.numeroPlace,
          place: val.place,
          prix: val.prix,
          statut: 'ACHETE',
          evenementId: val.evenementId,
          utilisateurId: user.id!
        };
        return this.ticketService.createTicket(ticketPayload);
      }),
      catchError(err => {
        console.error(err);
        throw err;
      })
    ).subscribe({
      next: () => {
        this.successMessage = "Félicitations ! Votre ticket a été acheté avec succès.";
        this.isSubmitting = false;
        this.form.reset({ statut: 'ACHETE' });
        this.selectedEvenement = null;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/accueil']);
        }, 5000);
      },
      error: (err) => {
        this.errorMessage = "Une erreur est survenue lors du processus. Veuillez vérifier vos informations.";
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/accueil']);
  }
}
