import { ChangeDetectorRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, ActivatedRoute } from '@angular/router';
import { AdministrateurApiService } from '../../../services/administrateur-api.service';
import { Administrateur } from '../../../models/administrateur';

declare var $: any;

@Component({
  selector: 'app-list-administrateur',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './list-administrateur.html',
  styleUrl: './list-administrateur.css',
})
export class ListAdministrateur implements OnInit, AfterViewInit {
  dtOptions: any = {};
  administrateurs: Administrateur[] = [];
  isLoading = true;
  notification: { message: string, type: string } | null = null;

  constructor(
    private administrateurService: AdministrateurApiService,
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

  loadData(): void {
    this.isLoading = true;
    this.administrateurService.getAdministrateurs().subscribe({
      next: (data) => {
        this.administrateurs = data ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.administrateurs = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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

  getRoleBadge(role: string): { label: string; class: string; icon: string } {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'Super Admin', class: 'bg-danger text-white', icon: 'bi bi-award-fill' };
      case 'ADMIN':
        return { label: 'Administrateur', class: 'bg-danger-subtle text-danger', icon: 'bi bi-shield-lock-fill' };
      case 'MANAGER':
        return { label: 'Manager', class: 'bg-primary-subtle text-primary', icon: 'bi bi-briefcase-fill' };
      case 'USER':
        return { label: 'Utilisateur', class: 'bg-success-subtle text-success', icon: 'bi bi-person-fill' };
      case 'VIEWER':
        return { label: 'Lecteur', class: 'bg-secondary-subtle text-secondary', icon: 'bi bi-eye-fill' };
      default:
        return { label: role, class: 'bg-light text-muted', icon: 'bi bi-question-circle' };
    }
  }

}
