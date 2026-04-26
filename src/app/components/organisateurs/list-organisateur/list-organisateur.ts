import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, ActivatedRoute } from '@angular/router';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Organisateur } from '../../../models/organisateur';

declare var $: any;

@Component({
  selector: 'app-list-organisateur',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './list-organisateur.html',
  styleUrl: './list-organisateur.css',
})
export class ListOrganisateur implements OnInit, AfterViewInit {
  dtOptions: any = {};
  organisateurs: Organisateur[] = [];
  isLoading = true;
  notification: { message: string, type: string } | null = null;

  constructor(
    private organisateurService: OrganisateurApiService,
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
    this.organisateurService.getOrganisateurs().subscribe({
      next: (data) => {
        this.organisateurs = data ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.organisateurs = [];
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

  formatDate(date: any): string {
    if (!date) return '-';
    if (Array.isArray(date)) {
      const [year, month, day, hour, minute] = date;
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hour ?? 0).padStart(2, '0')}:${String(minute ?? 0).padStart(2, '0')}`;
    }
    try {
      const d = new Date(date);
      return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return date;
    }
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    return phone;
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
}
