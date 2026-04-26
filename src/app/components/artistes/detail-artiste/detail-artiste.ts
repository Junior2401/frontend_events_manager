import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArtisteApiService } from '../../../services/artiste-api.service';
import { Artiste } from '../../../models/artiste';

@Component({
  selector: 'app-detail-artiste',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './detail-artiste.html' ,
  styleUrl: './detail-artiste.css'
})
export class DetailArtiste implements OnInit {
  artiste: Artiste | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private artisteService: ArtisteApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.artisteService.getArtisteById(id).subscribe({
      next: (data) => {
        this.artiste = data;
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
    this.router.navigate(['/artistes']);
  }
}
