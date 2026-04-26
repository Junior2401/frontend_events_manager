import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UtilisateurApiService } from '../../../services/utilisateur-api.service';
import { Utilisateur } from '../../../models/utilisateur';

@Component({
  selector: 'app-detail-utilisateur',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './detail-utilisateur.html',
  styleUrl: './detail-utilisateur.css'
})
export class DetailUtilisateur implements OnInit {
  utilisateur: Utilisateur | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private utilisateurService: UtilisateurApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.utilisateurService.getUtilisateurById(id).subscribe({
      next: (data) => {
        this.utilisateur = data;
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
    this.router.navigate(['/utilisateurs']);
  }

  formatDate(date: any): string {
    if (!date) return '';
    if (Array.isArray(date)) {
      const [year, month, day, hour, minute] = date;
      return `${this.pad(day)}/${this.pad(month)}/${year} ${this.pad(hour)}:${this.pad(minute)}`;
    }
    const d = new Date(date);
    return `${this.pad(d.getDate())}/${this.pad(d.getMonth() + 1)}/${d.getFullYear()} ${this.pad(d.getHours())}:${this.pad(d.getMinutes())}`;
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return '';
    return phone.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }
}
