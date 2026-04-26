import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, ActivatedRoute } from '@angular/router';
import { ArtisteApiService } from '../../../services/artiste-api.service';
import { Artiste } from '../../../models/artiste';

declare var $: any;

@Component({
  selector: 'app-list-artiste',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './list-artiste.html',
  styleUrl: './list-artiste.css',
})
export class ListArtiste implements OnInit, AfterViewInit {
  dtOptions: any = {};
  artistes: Artiste[] = [];
  isLoading = true;
  notification: { message: string, type: string } | null = null;

  constructor(
    private artisteService: ArtisteApiService,
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
    this.artisteService.getArtistes().subscribe({
      next: (data) => {
        this.artistes = data ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.artistes = [];
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
}
