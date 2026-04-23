import {
  Component, OnInit, ChangeDetectorRef
} from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
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

  constructor(
    private typeEvenementService: TypeEvenementApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
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
}
