import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EvenementApiService } from '../../../services/evenement-api.service';
import { Evenement } from '../../../models/evenement';

@Component({
  selector: 'app-detail-evenement',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './detail-evenement.html',
  styleUrl: './detail-evenement.css'
})
export class DetailEvenement implements OnInit {
  evenement: Evenement | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private evenementService: EvenementApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.evenementService.getEvenementById(id).subscribe({
      next: (data) => {
        this.evenement = data;
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
    this.router.navigate(['/evenements']);
  }
}
