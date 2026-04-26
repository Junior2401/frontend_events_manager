import {
  Component, OnInit, ChangeDetectorRef
} from '@angular/core';
import { RouterModule, RouterLink, ActivatedRoute } from '@angular/router';
import { TypeEvenementApiService } from '../../../services/type-evenement-api.service';
import { TypeEvenement } from '../../../models/type-evenement';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-type-evenement',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './list-type-evenement.html',
  styleUrl: './list-type-evenement.css',
})
export class ListTypeEvenement implements OnInit {

  typeEvenements: TypeEvenement[] = [];
  isLoading = true;
  notification: { message: string, type: string } | null = null;

  constructor(
    private typeEvenementService: TypeEvenementApiService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.checkNotifications();
  }

  loadData(): void {
    this.isLoading = true;
    this.typeEvenementService.getTypeEvenements().subscribe({
      next: (data) => {
        this.typeEvenements = data ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.typeEvenements = [];
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
