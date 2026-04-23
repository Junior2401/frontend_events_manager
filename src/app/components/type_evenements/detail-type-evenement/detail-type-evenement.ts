import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {TypeEvenement} from '../../../models/type-evenement';
import {TypeEvenementApiService} from '../../../services/type-evenement-api.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-detail-type-evenement',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './detail-type-evenement.html',
  styleUrl: './detail-type-evenement.css',
})
export class DetailTypeEvenement  implements OnInit {
  typeEvenement: TypeEvenement | null = null;
  isLoading = true;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private typeEvenementService: TypeEvenementApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(this.id);
  }

  loadData(id: number): void {
    this.isLoading = true;

    this.typeEvenementService.getTypeEvenementById(id).subscribe({
      next: (data) => {
        this.typeEvenement = data;
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
    this.router.navigate(['/type-evenements']);
  }

}
