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
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketApiService,
    private evenementService: EvenementApiService,
    private utilisateurService: UtilisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const eventIdParam = this.route.snapshot.params['eventId'];

    this.isLoading = true;
    this.evenementService.getEvenements().pipe(
      catchError(err => {
        console.error('Erreur chargement événements:', err);
        return of([]);
      })
    ).subscribe((evenements) => {
      this.evenements = evenements || [];

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
      if (type) {
        const upperType = String(type).toUpperCase();
        const foundPrice = this.prices[upperType];
        if (foundPrice) {
          this.form.patchValue({ prix: foundPrice });
        } else {
          // Prix par défaut si la catégorie n'est pas dans la map simulée
          this.form.patchValue({ prix: 50 });
        }
      } else {
        this.form.patchValue({ prix: 0 });
      }
      this.cdr.detectChanges();
    });
  }

  onEvenementChange(id: any): void {
    const numericId = Number(id);
    if (!numericId) return;

    this.selectedEvenement = this.evenements.find(e => e.id === numericId) || null;
    
    // Si l'événement est trouvé mais n'a pas son type, on le charge
    if (this.selectedEvenement && !this.selectedEvenement.typeEvenement) {
      this.evenementService.getTypeEvenement(numericId).subscribe({
        next: (type) => {
          if (this.selectedEvenement && this.selectedEvenement.id === numericId) {
            this.selectedEvenement.typeEvenement = type;
            this.cdr.detectChanges();
          }
        }
      });
    }

    // Reset place and price when event changes
    this.form.patchValue({ place: '', prix: 0, numeroPlace: '' });
    this.cdr.detectChanges();
  }

  formatDate(date: any): string {
    if (!date) return 'Date non définie';
    if (Array.isArray(date)) {
      const [year, month, day, hour, minute] = date;
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hour ?? 0).padStart(2, '0')}:${String(minute ?? 0).padStart(2, '0')}`;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = "Veuillez remplir correctement tous les champs du formulaire.";
      return;
    }

    const val = this.form.getRawValue();
    const evenementId = Number(val.evenementId);

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.cdr.detectChanges();

    // 1. Vérifier la capacité et l'utilisateur
    forkJoin({
      event: this.evenementService.getEvenementById(evenementId).pipe(catchError(err => {
        console.error('Erreur event:', err);
        throw new Error("EVENT_NOT_FOUND");
      })),
      tickets: this.ticketService.getTicketsByEvenement(evenementId).pipe(catchError(() => of([]))),
      users: this.utilisateurService.getUtilisateurs().pipe(catchError(() => of([])))
    }).pipe(
      switchMap(({ event, tickets, users }) => {
        if (!event) throw new Error("EVENT_NOT_FOUND");
        
        const vendus = (tickets || []).filter(t => t && t.statut === 'ACHETE').length;
        if (event.capacite > 0 && vendus >= event.capacite) {
          throw new Error("COMPLET");
        }

        const email = String(val.email).toLowerCase().trim();
        const existingUser = (users || []).find(u => u && u.email && u.email.toLowerCase().trim() === email);
        
        if (existingUser && existingUser.id) {
          return of(existingUser);
        } else {
          const userPayload: Utilisateur = {
            nom: val.nom,
            prenom: val.prenom,
            email: val.email,
            telephone: val.telephone
          };
          return this.utilisateurService.createUtilisateur(userPayload).pipe(
            catchError(err => {
              // Tentative de récupération si conflit d'email
              return this.utilisateurService.getUtilisateurs().pipe(
                switchMap(newUsers => {
                  const retryUser = (newUsers || []).find(u => u.email.toLowerCase().trim() === email);
                  if (retryUser) return of(retryUser);
                  throw err;
                })
              );
            })
          );
        }
      }),
      switchMap(user => {
        if (!user || !user.id) throw new Error("USER_ERROR");
        
        const ticketPayload: any = {
          numeroPlace: val.numeroPlace,
          place: val.place,
          prix: Number(val.prix),
          statut: 'ACHETE',
          evenementId: evenementId,
          utilisateurId: user.id
        };
        return this.ticketService.createTicket(ticketPayload);
      })
    ).subscribe({
      next: () => {
        this.successMessage = "Félicitations ! Votre ticket a été réservé avec succès.";
        this.isSubmitting = false;
        this.form.reset({ statut: 'ACHETE', evenementId: 0, prix: 0 });
        this.selectedEvenement = null;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/accueil']), 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Erreur processus achat:', err);
        
        if (err.message === "COMPLET") {
          this.errorMessage = "Désolé, cet événement est complet.";
        } else if (err.message === "EVENT_NOT_FOUND") {
          this.errorMessage = "L'événement sélectionné est introuvable ou n'existe plus.";
        } else if (err.message === "USER_ERROR") {
          this.errorMessage = "Erreur lors de la création de votre profil acheteur.";
        } else if (err.status === 400) {
          this.errorMessage = "Certaines informations sont incorrectes ou mal formatées.";
        } else {
          this.errorMessage = "Le serveur n'a pas pu traiter votre commande. Veuillez réessayer.";
        }
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/accueil']);
  }
}
