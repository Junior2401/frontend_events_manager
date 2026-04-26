import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketApiService } from '../../../services/ticket-api.service';
import { Ticket } from '../../../models/ticket';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Evenement } from '../../../models/evenement';
import { Utilisateur } from '../../../models/utilisateur';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-update-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-ticket.html',
  styleUrl: './update-ticket.css'
})
export class UpdateTicket implements OnInit {
  readonly form = this.fb.nonNullable.group({
    numeroPlace: ['', Validators.required],
    place: ['', Validators.required],
    prix: [0, Validators.required],
    statut: ['', Validators.required],
    evenementId: [0, [Validators.required, Validators.min(1)]],
    utilisateurId: [0, [Validators.required, Validators.min(1)]]
  });

  id!: number;
  isLoading = true;
  isSubmitting = false;
  evenements: Evenement[] = [];
  utilisateurs: Utilisateur[] = [];
  selectedEventTypesPlace: string[] = [];
  readonly statuts = [
    { value: 'ACHETE', label: 'Acheté' },
    { value: 'ANNULE', label: 'Annulé' },
    { value: 'REMBOURSE', label: 'Remboursé' }
  ];

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
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();

    // Mettre à jour la liste des types de places quand l'événement change
    this.form.get('evenementId')?.valueChanges.subscribe(id => {
      const ev = this.evenements.find(e => e.id === Number(id));
      this.selectedEventTypesPlace = ev?.typesPlace || [];
      this.cdr.detectChanges();
    });
  }

  loadData(): void {
    forkJoin({
      ticket: this.ticketService.getTicketById(this.id),
      evenements: this.evenementService.getEvenements(),
      utilisateurs: this.utilisateurService.getUtilisateurs()
    }).subscribe({
      next: (res) => {
        this.evenements = res.evenements;
        this.utilisateurs = res.utilisateurs;
        
        // Initialiser les types de places pour l'événement actuel
        const currentEv = this.evenements.find(e => e.id === res.ticket.evenementId);
        this.selectedEventTypesPlace = currentEv?.typesPlace || [];

        this.form.patchValue({
          numeroPlace: res.ticket.numeroPlace,
          place: res.ticket.place,
          prix: res.ticket.prix,
          statut: res.ticket.statut,
          evenementId: res.ticket.evenementId,
          utilisateurId: res.ticket.utilisateurId
        });
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

    const payload = this.form.getRawValue() as any;
    const cleanedPayload = { ...payload };
    delete cleanedPayload.evenementLibelle;
    delete cleanedPayload.utilisateurNomComplet;
    delete cleanedPayload.evenement;
    delete cleanedPayload.utilisateur;

    this.isSubmitting = true;
    this.cdr.detectChanges();
    
    this.ticketService.updateTicket(this.id, cleanedPayload).subscribe({
      next: () => {
        this.router.navigate(['/tickets']);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la mise a jour :', error);
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
