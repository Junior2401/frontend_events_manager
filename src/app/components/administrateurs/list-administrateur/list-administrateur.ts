import { ChangeDetectorRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
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

  constructor(
    private administrateurService: AdministrateurApiService,
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
}
