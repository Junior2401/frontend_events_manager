import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, ActivatedRoute } from '@angular/router';
import { TicketApiService } from '../../../services/ticket-api.service';
import { Ticket } from '../../../models/ticket';

declare var $: any;

@Component({
  selector: 'app-list-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './list-ticket.html',
  styleUrl: './list-ticket.css',
})
export class ListTicket implements OnInit, AfterViewInit {
  dtOptions: any = {};
  tickets: Ticket[] = [];
  isLoading = true;
  notification: { message: string, type: string } | null = null;

  constructor(
    private ticketService: TicketApiService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.checkNotifications();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
        { extend: 'copy', className: 'btn btn-secondary' },
        { extend: 'csv', className: 'btn btn-secondary' },
        { extend: 'excel', className: 'btn btn-secondary' },
        { extend: 'pdf', className: 'btn btn-secondary' },
        { extend: 'print', className: 'btn btn-secondary' },
        { extend: 'colvis', className: 'btn btn-secondary' }
      ],
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json'
      }
    };
  }

  loadData(): void {
    this.isLoading = true;
    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.tickets = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const table = ($('#example1') as any).DataTable({
        dom: 'Bfrtip',
        buttons: [
          { extend: 'copy', className: 'btn btn-sm btn-secondary' },
          { extend: 'excel', className: 'btn btn-sm btn-success' },
          { extend: 'pdf', className: 'btn btn-sm btn-danger' },
          { extend: 'colvis', className: 'btn btn-sm btn-info' }
        ],
        responsive: true,
        language: {
          url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json'
        }
      });
      table.buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    }, 200);
  }

  checkNotifications(): void {
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.notification = {
          message: params['message'],
          type: params['type'] || 'info'
        };
        this.cdr.detectChanges();

        // Auto-fermeture après 5 secondes
        setTimeout(() => {
          this.closeNotification();
        }, 5000);
      }
    });
  }

  closeNotification(): void {
    this.notification = null;
    this.cdr.detectChanges();
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

  getStatusBadgeClass(status: string | undefined): string {
    if (!status) return 'bg-light text-dark border';

    switch (status.toUpperCase()) {
      case 'ACHETE':
        return 'bg-success';
      case 'ANNULE':
        return 'bg-danger';
      case 'REMBOURSE':
        return 'bg-info text-dark';
      default:
        return 'bg-light text-dark border';
    }
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Inconnu';

    switch (status.toUpperCase()) {
      case 'ACHETE':
        return 'Acheté';
      case 'ANNULE':
        return 'Annulé';
      case 'REMBOURSE':
        return 'Remboursé';
      default:
        return status;
    }
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }
}
