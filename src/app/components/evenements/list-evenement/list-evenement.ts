import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { Evenement } from '../../../models/evenement';

declare var $: any;

@Component({
  selector: 'app-list-evenement',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './list-evenement.html',
  styleUrl: './list-evenement.css',
})
export class ListEvenement implements OnInit, AfterViewInit {
  dtOptions: any = {};
  evenements: Evenement[] = [];
  isLoading = true;

  constructor(
    private evenementService: EvenementApiService,
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
    this.evenementService.getEvenements().subscribe({
      next: (data) => {
        this.evenements = data ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.evenements = [];
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
