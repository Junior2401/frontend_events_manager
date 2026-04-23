import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
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

  constructor(
    private organisateurService: OrganisateurApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();

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
}
