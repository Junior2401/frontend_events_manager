import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketApiService } from '../../../services/ticket-api.service';
import { Ticket } from '../../../models/ticket';

@Component({
  selector: 'app-delete-ticket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-ticket.html',
  styleUrl: './delete-ticket.css'
})
export class DeleteTicket implements OnInit {
  ticket: Ticket | null = null;
  isLoading = true;
  isSubmitting = false;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(this.id);
  }

  loadData(id: number): void {
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
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

  onBack(): void {
    this.router.navigate(['/tickets']);
  }

  onDelete(): void {
    if (!this.id) {
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();
    this.ticketService.deleteTicket(this.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
        this.router.navigate(['/tickets']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
