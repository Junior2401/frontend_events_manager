import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketApiService } from '../../../services/ticket-api.service';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Ticket } from '../../../models/ticket';
import { Evenement } from '../../../models/evenement';
import { Utilisateur } from '../../../models/utilisateur';
import { forkJoin, of, catchError } from 'rxjs';

@Component({
  selector: 'app-update-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-ticket.html',
  styleUrl: './update-ticket.css'
})
export class UpdateTicket implements OnInit {
  form: FormGroup;
  id: number = 0;
  isLoading = true;
  isSubmitting = false;
  errorMessage: string | null = null;
  evenements: Evenement[] = [];
  utilisateurs: Utilisateur[] = [];
  selectedEventTypesPlace: string[] = [];
  
  readonly statuts = [
    { value: 'ACHETE', label: 'Acheté' },
    { value: 'ANNULE', label: 'Annulé' },
    { value: 'REMBOURSE', label: 'Remboursé' }
  ];

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
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketApiService,
    private evenementService: EvenementApiService,
    private utilisateurService: UtilisateurApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      numeroPlace: ['', Validators.required],
      place: ['', Validators.required],
      prix: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      statut: ['', Validators.required],
      evenementId: [0, [Validators.required, Validators.min(1)]],
      utilisateurId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/tickets']);
      return;
    }
    
    this.id = Number(idParam);
    if (isNaN(this.id)) {
      this.errorMessage = "ID de ticket invalide.";
      this.isLoading = false;
      return;
    }

    this.loadData();

    // Mises à jour dynamiques du formulaire
    this.form.get('evenementId')?.valueChanges.subscribe(id => {
      const numericId = Number(id);
      const ev = this.evenements.find(e => e.id === numericId);
      this.selectedEventTypesPlace = ev?.typesPlace || [];
      this.cdr.detectChanges();
    });

    this.form.get('place')?.valueChanges.subscribe(placeType => {
      if (placeType) {
        const upperType = String(placeType).toUpperCase();
        this.form.patchValue({ prix: this.pricesMap[upperType] || 50 });
      } else {
        this.form.patchValue({ prix: 0 });
      }
      this.cdr.detectChanges();
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      ticket: this.ticketService.getTicketById(this.id).pipe(catchError(() => of(null))),
      evenements: this.evenementService.getEvenements().pipe(catchError(() => of([]))),
      utilisateurs: this.utilisateurService.getUtilisateurs().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res: any) => {
        if (!res.ticket) {
          this.errorMessage = "Ticket introuvable.";
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        this.evenements = res.evenements || [];
        this.utilisateurs = res.utilisateurs || [];
        
        const t = res.ticket;
        const evId = t.evenementId || t.evenement?.id;
        const uId = t.utilisateurId || t.utilisateur?.id;

        const currentEv = this.evenements.find(e => e.id === Number(evId));
        this.selectedEventTypesPlace = currentEv?.typesPlace || [];

        this.form.patchValue({
          numeroPlace: t.numeroPlace || '',
          place: t.place || '',
          prix: t.prix || 0,
          statut: t.statut || 'ACHETE',
          evenementId: evId ? Number(evId) : 0,
          utilisateurId: uId ? Number(uId) : 0
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = "Erreur lors du chargement des ressources.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
      return;
    }

    const val = this.form.getRawValue();
    const payload: any = {
      id: this.id,
      numeroPlace: val.numeroPlace,
      place: val.place,
      prix: Number(val.prix),
      statut: val.statut,
      evenementId: Number(val.evenementId),
      utilisateurId: Number(val.utilisateurId)
    };

    this.isSubmitting = true;
    this.cdr.detectChanges();
    
    this.ticketService.updateTicket(this.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/tickets'], { queryParams: { message: 'Mise à jour réussie', type: 'success' } });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Erreur serveur : " + (err.error?.message || "Impossible de sauvegarder.");
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(date: any): string {
    if (!date) return '-';
    if (Array.isArray(date)) {
      const [y, m, d, h, min] = date;
      return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    }
    return new Date(date).toLocaleDateString('fr-FR');
  }

  onBack(): void {
    this.router.navigate(['/tickets']);
  }
}
